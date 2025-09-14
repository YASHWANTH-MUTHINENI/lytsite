import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import Homepage from './components/homepage';
import TemplatesPage from './components/templates-page';
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
import PrivacyPolicy from './components/privacy-policy';
import TermsOfService from './components/terms-of-service';
import TermsConditions from './components/terms-conditions';
import RefundCancellation from './components/refund-cancellation';
import AboutUs from './components/about-us';
import Contact from './components/contact';
import HelpCenter from './components/help-center';
import Feedback from './components/feedback';
import Payment from './components/Payment';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/photo-gallery" element={<PhotoGallery />} />
            <Route path="/portfolio-resume" element={<PortfolioResume />} />
            <Route path="/event-template" element={<EventTemplate />} />
            <Route path="/product-template" element={<ProductTemplate />} />
            <Route path="/case-study-template" element={<CaseStudyTemplate />} />
            <Route path="/pitch-template" element={<PitchTemplate />} />
            <Route path="/universal-file-template" element={<UniversalFileTemplate />} />
            <Route path="/hero-examples" element={<HeroBlockExamples />} />
            <Route path="/backend-data-test" element={<BackendDataTest />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/photographer-client-galleries" element={<PhotographerGalleriesPost />} />
            <Route path="/blog/agency-delivery" element={<BlogAgencyDelivery />} />
            <Route path="/blog/sales-file-sharing" element={<BlogSalesFileSharing />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/refund-cancellation" element={<RefundCancellation />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/payment" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}