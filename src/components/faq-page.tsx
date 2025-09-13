import React, { useState } from "react";

import { Button } from './ui/button';
import { Upload, ChevronDown, ChevronUp, Mail, ArrowLeft, Home, Plus, Minus } from 'lucide-react';
import Navbar from './Navbar';

const FAQPage = () => {
  
  const [openSection, setOpenSection] = useState<string | null>('general');

  const faqSections = [
    {
      id: 'general',
      title: '🔹 General',
      questions: [
        {
          question: 'What is Lytsite?',
          answer: 'Lytsite is the fastest way to turn your files into a beautiful, sharable mini-website. Just drop your files → pick a template → get a link + QR code. No more messy ZIPs, Drive links, or email attachments.'
        },
        {
          question: 'Who is Lytsite for?',
          answer: 'Lytsite is designed for:\n\n🎨 Photographers, designers, videographers delivering projects\n💼 Agencies & freelancers sending assets to clients\n📈 Sales teams sharing decks, brochures, and proposals\n🛍️ Indie sellers & makers showcasing products\n👩‍🎓 Job seekers turning resumes into live portfolios'
        }
      ]
    },
    {
      id: 'uploads',
      title: '🔹 Uploads & Files',
      questions: [
        {
          question: 'What types of files can I upload?',
          answer: 'You can upload:\n\nImages (JPG, PNG, WebP)\nVideos (MP4, MOV)\nDocuments (PDF, PPTX, DOCX)\nArchives (ZIP, RAR)\nDesign assets (PSD, AI, Sketch, Figma exports)'
        },
        {
          question: "What's the max file size I can upload?",
          answer: 'Free: up to 2 GB per delivery\nStandard: 10 GB\nPro: 25 GB\nBusiness: 100 GB'
        },
        {
          question: 'How long do my files stay online?',
          answer: 'Free: 7 days\nStandard: 30 days\nPro & Business: until you delete them (no forced expiry).'
        }
      ]
    },
    {
      id: 'sharing',
      title: '🔹 Links, Sharing & Security',
      questions: [
        {
          question: 'How do I share my files?',
          answer: 'Every upload generates a clean URL (like lytsite.com/yourproject) and a QR code you can put in emails, messages, or even on printed flyers.'
        },
        {
          question: 'Can I protect my files with a password?',
          answer: 'Yes, password protection is available in Standard, Pro, and Business plans.'
        },
        {
          question: 'Can I track who views or downloads my files?',
          answer: 'Free: No tracking\nStandard: Basic (views, downloads count)\nPro: Advanced analytics (per-recipient insights)\nBusiness: Full lead/client tracking + dashboard'
        },
        {
          question: 'Can I update files without changing the link?',
          answer: 'Yes — Pro and Business users can replace files or add new versions while keeping the same link. Clients will always have the latest version.'
        }
      ]
    },
    {
      id: 'templates',
      title: '🔹 Templates & Presentation',
      questions: [
        {
          question: 'What templates are available?',
          answer: 'At launch, Lytsite includes:\n\nClient Delivery Page\nPhoto Gallery Showcase\nPortfolio / Resume Site\nEvent Invite / Flyer\nPitch Deck Viewer\nProduct Showcase'
        },
        {
          question: 'Can I add my own branding?',
          answer: 'Yes:\n\nStandard: Light customization\nPro: Custom branding & logo\nBusiness: White-label with your own domain'
        },
        {
          question: 'Do the templates work on mobile?',
          answer: 'Absolutely. Every template is responsive and optimized for both desktop and mobile viewing.'
        }
      ]
    },
    {
      id: 'pro',
      title: '🔹 Pro Features',
      questions: [
        {
          question: 'What is "Timeline & Versioning"?',
          answer: 'You can upload updated versions of your files (e.g., V1, V2, Final) → they appear in a timeline block, so clients can see project progress without confusion.'
        },
        {
          question: 'What is "Bulk Site Generation"?',
          answer: 'Upload your files + a CSV of client names/emails → Lytsite generates personalized delivery sites for each client automatically.'
        },
        {
          question: 'Can I use Lytsite for live presentations?',
          answer: 'Yes, with Pro & Business, you can share your link in "live mode" and present directly in the browser, like a deck. Attendees don\'t need any software.'
        }
      ]
    },
    {
      id: 'billing',
      title: '🔹 Billing & Pricing',
      questions: [
        {
          question: 'Is Lytsite free to use?',
          answer: 'Yes, we offer a Free plan with limited storage, expiry, and watermark. Paid plans unlock more storage, branding, and pro features.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'Credit/debit cards and PayPal (Stripe powered).'
        },
        {
          question: 'Can I cancel anytime?',
          answer: 'Yes. You can upgrade/downgrade/cancel your plan at any time from your account settings.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer refunds within 7 days of purchase if you haven\'t used more than 10% of your plan quota.'
        }
      ]
    },
    {
      id: 'technical',
      title: '🔹 Technical & Support',
      questions: [
        {
          question: 'How fast are uploads and downloads?',
          answer: 'We use global CDN + chunked uploads. This means files upload in parallel, and downloads are served from the nearest edge server for maximum speed.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes:\n\nEncrypted in transit (HTTPS)\nEncrypted at rest (AES-256)\nOptional password protection\nExpiry & revoke links anytime'
        },
        {
          question: 'Do you provide customer support?',
          answer: 'Free: Community support\nStandard: Email support\nPro: Priority email support\nBusiness: Priority + SLA'
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-6">
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4">
            {/* Back Button */}
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">Frequently Asked Questions</h1>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed">
                Find answers to common questions about Lytsite's features, pricing, and how to get the most out of our platform.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqSections.map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 border border-slate-200 hover:border-primary/30 group"
                >
                  <h2 className="text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">{section.title}</h2>
                  <div className="flex-shrink-0 ml-4">
                    {openSection === section.id ? (
                      <Minus className="w-5 h-5 text-primary" />
                    ) : (
                      <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>

                {openSection === section.id && (
                  <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {section.questions.map((qa, index) => (
                      <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-50/50 rounded-xl p-6 border-l-4 border-primary/20 ml-6">
                        <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                            Q
                          </span>
                          {qa.question}
                        </h3>
                        <div className="ml-9 text-slate-700 leading-relaxed whitespace-pre-line">
                          {qa.answer}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Back to Home CTA */}
        <section className="py-12 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to get started?</h2>
              <p className="text-slate-600 mb-8">
                Transform how you share files with your clients. Create beautiful, professional sharing pages in seconds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                >
                  Back to Home
                </Button>
                <Button 
                  onClick={() => window.location.href = '/templates'}
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3"
                >
                  View Templates
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Still have questions?</h2>
              <p className="text-slate-600 mb-8">
                Can't find the answer you're looking for? Our support team is here to help you get the most out of Lytsite.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3">
                  Join Community
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQPage;
