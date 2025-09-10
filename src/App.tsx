import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeProvider';
import Homepage from './components/homepage';
import TemplatesPage from './components/templates-page';
import ClientDelivery from './components/client-delivery';
import PhotoGallery from './components/photo-gallery';
import PortfolioResume from './components/portfolio-resume';
import EventTemplate from './components/event-template';
import ProductTemplate from './components/product-template';
import CaseStudyTemplate from './components/case-study-template';
import PitchTemplate from './components/pitch-template';
import UniversalFileTemplate from './components/universal-file-template';
import HeroBlockExamples from './components/hero-block-examples';
import BackendDataTest from './components/backend-data-test';
import FAQPage from './components/faq-page';
import BlogPage from './components/blog-page';
import PhotographerGalleriesPost from './components/blog-photographer-galleries';
import BlogAgencyDelivery from './components/blog-agency-delivery';
import BlogSalesFileSharing from './components/blog-sales-file-sharing';

type Page = 'homepage' | 'templates-page' | 'client-delivery' | 'photo-gallery' | 'portfolio-resume' | 'event-template' | 'product-template' | 'case-study-template' | 'pitch-template' | 'universal-file-template' | 'hero-examples' | 'backend-data-test' | 'faq' | 'blog' | 'blog-photographer-client-galleries' | 'blog-agency-delivery' | 'blog-sales-file-sharing';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('homepage');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'homepage':
        return <Homepage onNavigate={handleNavigate} />;
      case 'templates-page':
        return <TemplatesPage onNavigate={handleNavigate} />;
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
      case 'backend-data-test':
        return <BackendDataTest onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'blog-photographer-client-galleries':
        return <PhotographerGalleriesPost onNavigate={handleNavigate} />;
      case 'blog-agency-delivery':
        return <BlogAgencyDelivery onBack={() => setCurrentPage('blog')} />;
      case 'blog-sales-file-sharing':
        return <BlogSalesFileSharing onNavigate={handleNavigate} />;
      case 'hero-examples':
        return <HeroBlockExamples />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
        {renderPage()}
      </div>
    </ThemeProvider>
  );
}