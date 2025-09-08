import { useState } from 'react';
import Homepage from './components/homepage';
import ClientDelivery from './components/client-delivery';
import PhotoGallery from './components/photo-gallery';
import PortfolioResume from './components/portfolio-resume';
import EventTemplate from './components/event-template';
import ProductTemplate from './components/product-template';
import CaseStudyTemplate from './components/case-study-template';
import PitchTemplate from './components/pitch-template';
import UniversalFileTemplate from './components/universal-file-template';
import HeroBlockExamples from './components/hero-block-examples';

type Page = 'homepage' | 'client-delivery' | 'photo-gallery' | 'portfolio-resume' | 'event-template' | 'product-template' | 'case-study-template' | 'pitch-template' | 'universal-file-template' | 'hero-examples';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('homepage');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'homepage':
        return <Homepage onNavigate={handleNavigate} />;
      case 'client-delivery':
        return <ClientDelivery onNavigate={handleNavigate} />;
      case 'photo-gallery':
        return <PhotoGallery onNavigate={handleNavigate} />;
      case 'portfolio-resume':
        return <PortfolioResume onNavigate={handleNavigate} />;
      case 'event-template':
        return <EventTemplate onNavigate={handleNavigate} />;
      case 'product-template':
        return <ProductTemplate onNavigate={handleNavigate} />;
      case 'case-study-template':
        return <CaseStudyTemplate onNavigate={handleNavigate} />;
      case 'pitch-template':
        return <PitchTemplate onNavigate={handleNavigate} />;
      case 'universal-file-template':
        return <UniversalFileTemplate onNavigate={handleNavigate} />;
      case 'hero-examples':
        return <HeroBlockExamples />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderPage()}
    </div>
  );
}