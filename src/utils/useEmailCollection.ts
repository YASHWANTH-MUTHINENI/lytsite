import { useState, useEffect } from 'react';
import { getAnonymousSessionId } from './sessionManager';

interface EmailCollectionState {
  hasEmail: boolean;
  email: string | null;
  collectionTrigger: string | null;
  shouldShowModal: boolean;
  modalTrigger: string | null;
}

interface EngagementEvent {
  type: 'first_comment' | 'first_favorite' | 'high_views' | 'return_visit';
  projectId: string;
  projectTitle?: string;
  metadata?: any;
}

const EMAIL_STORAGE_KEY = 'lytsite_user_email';
const EMAIL_TRIGGERS_KEY = 'lytsite_email_triggers';
const MODAL_SHOWN_KEY = 'lytsite_modal_shown';

/**
 * Hook for managing progressive email collection
 */
export function useEmailCollection() {
  const [state, setState] = useState<EmailCollectionState>({
    hasEmail: false,
    email: null,
    collectionTrigger: null,
    shouldShowModal: false,
    modalTrigger: null
  });

  useEffect(() => {
    // Initialize state from localStorage
    const email = localStorage.getItem(EMAIL_STORAGE_KEY);
    const triggers = JSON.parse(localStorage.getItem(EMAIL_TRIGGERS_KEY) || '{}');
    
    setState(prev => ({
      ...prev,
      hasEmail: !!email,
      email: email,
      collectionTrigger: triggers.collected_via || null
    }));
  }, []);

  /**
   * Check if we should show email collection modal for an engagement event
   */
  const checkShouldShowModal = (event: EngagementEvent): boolean => {
    // Don't show if user already has email
    if (state.hasEmail) return false;

    const modalShown = JSON.parse(localStorage.getItem(MODAL_SHOWN_KEY) || '{}');
    const sessionId = getAnonymousSessionId();
    
    // Don't show if modal already shown for this trigger
    if (modalShown[`${event.type}_${sessionId}`]) return false;

    // Define trigger conditions
    const triggerConditions = {
      first_comment: true, // Always show on first comment
      first_favorite: true, // Always show on first favorite
      high_views: true, // Show when views > threshold
      return_visit: checkReturnVisit()
    };

    return triggerConditions[event.type] || false;
  };

  /**
   * Check if this is a return visit (user came back after 24h)
   */
  const checkReturnVisit = (): boolean => {
    const lastVisit = localStorage.getItem('lytsite_last_visit');
    const now = Date.now();
    
    if (!lastVisit) {
      localStorage.setItem('lytsite_last_visit', now.toString());
      return false;
    }

    const timeSinceLastVisit = now - parseInt(lastVisit);
    const twentyFourHours = 24 * 60 * 60 * 1000;
    
    // Update last visit
    localStorage.setItem('lytsite_last_visit', now.toString());
    
    return timeSinceLastVisit > twentyFourHours;
  };

  /**
   * Trigger email collection modal
   */
  const triggerEmailCollection = (event: EngagementEvent) => {
    if (checkShouldShowModal(event)) {
      setState(prev => ({
        ...prev,
        shouldShowModal: true,
        modalTrigger: event.type
      }));
    }
  };

  /**
   * Submit email and close modal
   */
  const submitEmail = async (email: string, trigger: string, projectId?: string) => {
    try {
      // Store email locally
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      
      // Store trigger information
      const triggers = {
        collected_via: trigger,
        collected_at: Date.now(),
        project_id: projectId
      };
      localStorage.setItem(EMAIL_TRIGGERS_KEY, JSON.stringify(triggers));

      // Mark modal as shown for this trigger
      const modalShown = JSON.parse(localStorage.getItem(MODAL_SHOWN_KEY) || '{}');
      const sessionId = getAnonymousSessionId();
      modalShown[`${trigger}_${sessionId}`] = true;
      localStorage.setItem(MODAL_SHOWN_KEY, JSON.stringify(modalShown));

      // Send to backend for storage
      await fetch('/api/email-collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          trigger,
          projectId,
          anonymousSessionId: sessionId,
          timestamp: Date.now()
        }),
      });

      // Update state
      setState(prev => ({
        ...prev,
        hasEmail: true,
        email: email,
        collectionTrigger: trigger,
        shouldShowModal: false,
        modalTrigger: null
      }));

      // Track successful collection
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'email_collected', {
          trigger: trigger,
          project_id: projectId
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to submit email:', error);
      return false;
    }
  };

  /**
   * Close modal without submitting
   */
  const closeModal = () => {
    // Track modal dismissal
    if (state.modalTrigger && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'email_modal_dismissed', {
        trigger: state.modalTrigger
      });
    }

    // Mark modal as shown to prevent repeated prompts
    const modalShown = JSON.parse(localStorage.getItem(MODAL_SHOWN_KEY) || '{}');
    const sessionId = getAnonymousSessionId();
    if (state.modalTrigger) {
      modalShown[`${state.modalTrigger}_${sessionId}`] = true;
      localStorage.setItem(MODAL_SHOWN_KEY, JSON.stringify(modalShown));
    }

    setState(prev => ({
      ...prev,
      shouldShowModal: false,
      modalTrigger: null
    }));
  };

  /**
   * Convenience methods for common triggers
   */
  const onFirstComment = (projectId: string, projectTitle?: string) => {
    triggerEmailCollection({
      type: 'first_comment',
      projectId,
      projectTitle
    });
  };

  const onFirstFavorite = (projectId: string, projectTitle?: string) => {
    triggerEmailCollection({
      type: 'first_favorite',
      projectId,
      projectTitle
    });
  };

  const onHighViews = (projectId: string, viewCount: number, projectTitle?: string) => {
    if (viewCount >= 10) { // Threshold for "high views"
      triggerEmailCollection({
        type: 'high_views',
        projectId,
        projectTitle,
        metadata: { viewCount }
      });
    }
  };

  const onReturnVisit = (projectId: string, projectTitle?: string) => {
    triggerEmailCollection({
      type: 'return_visit',
      projectId,
      projectTitle
    });
  };

  return {
    ...state,
    triggerEmailCollection,
    submitEmail,
    closeModal,
    // Convenience methods
    onFirstComment,
    onFirstFavorite,
    onHighViews,
    onReturnVisit
  };
}