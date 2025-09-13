import React from "react";

import Navbar from './Navbar';



const BlogSalesFileSharing = ({ onNavigate }: BlogSalesFileSharingProps) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/20 text-white text-sm font-bold mb-8 backdrop-blur-sm border border-white/30 shadow-lg">
              <span className="mr-2">📈</span>
              Sales Strategy Guide
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
              Stop Losing Deals to Lost Attachments
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-10 text-white leading-relaxed max-w-4xl mx-auto drop-shadow-md font-medium">
              How professional sales file delivery transforms prospects into closed deals. Discover why 30% of B2B deals stall over poor material delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <span className="inline-flex items-center px-5 py-3 rounded-full bg-white/25 text-white font-bold backdrop-blur-sm border border-white/40 shadow-lg">
                🎯 Sales Strategy
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 text-white font-medium backdrop-blur-sm border border-white/20">
                � B2B Growth
              </span>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/15 text-white font-medium backdrop-blur-sm border border-white/20">
                💼 Professional Tools
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <article className="prose prose-slate prose-lg max-w-none">
          
          {/* Introduction */}
          <div className="text-lg md:text-xl text-slate-700 mb-12 leading-relaxed space-y-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
              <p className="text-xl font-semibold mb-4 text-red-900">
                The brutal truth about B2B sales: <strong>30% of deals stall because prospects never properly received or accessed your materials</strong>. Another 25% slow down because your pitch deck looked unprofessional on mobile.
              </p>
            </div>
            <p className="text-slate-600 leading-relaxed">
              While you're wondering why "hot prospects" went cold, they're struggling with your 15MB attachment that bounced three times, or squinting at your beautiful slide deck rendered as microscopic text on their phone.
            </p>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-10 rounded-2xl mb-12 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">The Data Behind Professional Sales Material Delivery</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">40%</div>
                <div className="text-sm md:text-base text-slate-700 font-medium">Increase in perceived value with professional presentation</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-3">65%</div>
                <div className="text-sm md:text-base text-slate-700 font-medium">Improvement in follow-up timing with engagement tracking</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-3">55%</div>
                <div className="text-sm md:text-base text-slate-700 font-medium">Boost in completion rates with mobile-optimized delivery</div>
              </div>
            </div>
          </div>

          {/* Problems Section */}
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">What's Broken With Traditional Sales File Sharing</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-red-50 border border-red-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-red-900 flex items-center">
                <span className="text-2xl mr-3">📧</span>
                Email Attachments: The Momentum Killer
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Size failures:</strong> Large pitch decks bounce or never arrive
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Mobile nightmare:</strong> PDFs are unreadable on phones (67% of first views)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Zero analytics:</strong> No idea if they opened it, how long they spent, or what interested them
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Forwarding chaos:</strong> Your materials spread without context or control
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-orange-900 flex items-center">
                <span className="text-2xl mr-3">☁️</span>
                Cloud Links: The Generic Experience
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Dropbox/Drive folders:</strong> Look unprofessional for important sales materials
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">No customization:</strong> Your pitch lives in Google's interface, not yours
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Expiration issues:</strong> WeTransfer links die, creating urgency problems
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Lost context:</strong> Files become separated from your sales narrative
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution Section */}
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">The Professional Sales Alternative: Trackable Pitch Portals</h2>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-8 md:p-10 rounded-2xl mb-10">
            <p className="text-lg md:text-xl mb-8 text-slate-700 leading-relaxed">Instead of another "Please find attached..." email, imagine sending this:</p>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-green-900 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              A Personalized Sales Experience
            </h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-900">Custom URL:</strong> 
                  <code className="ml-2 px-3 py-1 bg-white rounded text-sm border">yourcompany.com/proposal-acme-corp</code>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-900">Prospect branding:</strong> Their logo alongside yours shows partnership approach
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-900">Embedded viewing:</strong> No downloads needed, perfect mobile experience
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-900">Contextual sections:</strong> Executive summary, detailed proposal, case studies, pricing
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <div>
                  <strong className="text-slate-900">Call-to-action integration:</strong> Direct links to calendar booking or next steps
                </div>
              </li>
            </ul>
          </div>

          {/* Testimonials */}
          <div className="bg-slate-50 border border-slate-200 p-8 md:p-10 rounded-2xl mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">Real Sales Team Results</h3>
            <div className="space-y-8">
              <blockquote className="bg-white border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
                <p className="text-lg text-slate-700 italic leading-relaxed mb-4">
                  "Our proposal open rates went from 60% to 95%. More importantly, we can see exactly which sections prospects spend time on—it's changed how we follow up."
                </p>
                <footer className="text-slate-900 font-semibold flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-bold">
                    D
                  </div>
                  — David Chen, VP Sales, TechSolutions Inc.
                </footer>
              </blockquote>
              
              <blockquote className="bg-white border-l-4 border-purple-500 p-6 rounded-r-xl shadow-sm">
                <p className="text-lg text-slate-700 italic leading-relaxed mb-4">
                  "Stopped losing deals to 'I never got your email.' Every proposal now has a trackable link that works perfectly on mobile."
                </p>
                <footer className="text-slate-900 font-semibold flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3 text-purple-600 font-bold">
                    J
                  </div>
                  — Jennifer Rodriguez, Regional Sales Manager
                </footer>
              </blockquote>
              
              <blockquote className="bg-white border-l-4 border-indigo-500 p-6 rounded-r-xl shadow-sm">
                <p className="text-lg text-slate-700 italic leading-relaxed mb-4">
                  "The branded presentation makes us look like a premium partner, not just another vendor. It's become part of our competitive advantage."
                </p>
                <footer className="text-slate-900 font-semibold flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3 text-indigo-600 font-bold">
                    M
                  </div>
                  — Mike Thompson, Business Development Director
                </footer>
              </blockquote>
            </div>
          </div>

          {/* Process Section */}
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">How Top Sales Teams Transform Their Material Delivery</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-blue-50 border border-blue-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-blue-900 flex items-center">
                <span className="text-2xl mr-3">🔄</span>
                The Strategic Sales Handoff Process
              </h3>
              <ol className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900">Upload your pitch materials</strong> (decks, proposals, case studies, pricing sheets)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900">Customize for the prospect</strong> (add their name/company, relevant case studies)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900">Create trackable delivery</strong> (branded portal with engagement analytics)
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">4</span>
                  <div>
                    <strong className="text-slate-900">Send personalized link</strong> (professional, mobile-perfect, always accessible)
                  </div>
                </li>
              </ol>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-green-900 flex items-center">
                <span className="text-2xl mr-3">✨</span>
                What Your Prospects Experience
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <strong className="text-slate-900">Instant access</strong> on any device, no downloads required
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <strong className="text-slate-900">Professional presentation</strong> that reflects your service quality
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <strong className="text-slate-900">Easy navigation</strong> between proposal sections and supporting materials
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <strong className="text-slate-900">Forward-friendly links</strong> they can confidently share internally
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  <div>
                    <strong className="text-slate-900">Always current content</strong> (you control updates without new emails)
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* ROI Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-8 md:p-10 rounded-2xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">The ROI of Professional Sales Material Delivery</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-6 text-purple-900 flex items-center">
                  <span className="text-xl mr-3">📈</span>
                  Immediate Sales Impact
                </h3>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Increase open rates by 35%:</strong> Trackable links perform better than attachments
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Improve mobile engagement by 55%:</strong> Responsive design captures mobile-first prospects
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Reduce delivery failures by 90%:</strong> No more bounced emails or lost attachments
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Accelerate follow-up timing by 40%:</strong> Real engagement data improves call timing
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-6 text-pink-900 flex items-center">
                  <span className="text-xl mr-3">🎯</span>
                  Strategic Business Advantages
                </h3>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Differentiate from competitors:</strong> Professional delivery sets you apart
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Justify premium pricing:</strong> Quality presentation supports higher rates
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Improve conversion rates:</strong> Better prospect experience drives more closes
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 mt-1">•</span>
                    <div>
                      <strong className="text-slate-900">Scale successful approaches:</strong> Analytics reveal what resonates across deals
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Competitive Advantage */}
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">Competitive Advantage Through Superior Prospect Experience</h2>
          
          <div className="bg-blue-50 border border-blue-200 p-8 md:p-10 rounded-2xl mb-10">
            <p className="text-lg md:text-xl mb-8 text-slate-700 leading-relaxed">
              While your competitors send generic PDF attachments, you're delivering experiences. This attention to every prospect touchpoint is what separates consultative sellers from commodity vendors.
            </p>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-6 text-blue-900 flex items-center">
              <span className="text-2xl mr-3">🧠</span>
              The Intelligence Advantage
            </h3>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <div>
                  <strong className="text-slate-900">Engagement patterns:</strong> Which prospects are most interested based on viewing behavior
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <div>
                  <strong className="text-slate-900">Content resonance:</strong> What sections drive the most engagement across deals
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <div>
                  <strong className="text-slate-900">Timing intelligence:</strong> When prospects are actively reviewing (perfect for follow-up calls)
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-3 mt-1">•</span>
                <div>
                  <strong className="text-slate-900">Stakeholder mapping:</strong> See how materials get shared within prospect organizations
                </div>
              </li>
            </ul>
          </div>

          {/* Implementation Strategy */}
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-slate-900">Implementation Strategy for Sales Teams</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-green-50 border border-green-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-green-900 flex items-center">
                <span className="text-2xl mr-3">🚀</span>
                Start With Your Highest-Value Opportunities
              </h3>
              <ol className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">1</span>
                  <div>Choose your most important active proposal</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">2</span>
                  <div>Create a branded portal instead of sending attachment</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">3</span>
                  <div>Monitor engagement analytics and follow up based on actual interest</div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-1 flex-shrink-0">4</span>
                  <div>Compare close rate and timeline to previous attachment-based approaches</div>
                </li>
              </ol>
            </div>
            
            <div className="bg-indigo-50 border border-indigo-200 p-8 rounded-2xl">
              <h3 className="text-xl md:text-2xl font-semibold mb-6 text-indigo-900 flex items-center">
                <span className="text-2xl mr-3">📊</span>
                Scale Across Your Sales Process
              </h3>
              <ul className="space-y-4 text-slate-700">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Template library:</strong> Create reusable formats for common pitch scenarios
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Team training:</strong> Show reps how engagement data improves their follow-up
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-3 mt-1">•</span>
                  <div>
                    <strong className="text-slate-900">Manager insights:</strong> Track team-wide engagement patterns for coaching opportunities
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-10 md:p-16 rounded-2xl text-center mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
            <div className="relative">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">Turn Every Pitch Into a Competitive Advantage</h2>
              <p className="text-lg md:text-xl mb-8 text-slate-200 leading-relaxed max-w-4xl mx-auto">
                Professional sales teams understand that every prospect interaction shapes their competitive position. Your material delivery method either reinforces your premium positioning or undermines it.
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 md:p-8 max-w-3xl mx-auto">
                <p className="text-base md:text-lg text-blue-200 leading-relaxed">
                  <strong className="text-white">The data is clear:</strong> Prospects remember how you make them feel during the sales process. Make them hunt through email attachments, and they'll remember the frustration. Deliver a seamless, professional experience, and they'll remember why they should choose you.
                </p>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 md:p-12 rounded-2xl mb-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-800/30 to-purple-800/30"></div>
            <div className="relative">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">Your Next Big Proposal: Make It Memorable</h2>
              <p className="text-base md:text-lg mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Your sales materials deserve better than email attachment roulette. Your prospects deserve better than PDF frustration. Your team deserves the competitive advantage that professional delivery provides.
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-lg md:text-xl font-semibold mb-4 text-white">
                  Ready to transform every pitch from a forgettable attachment into a memorable, trackable experience that drives more closes?
                </p>
              </div>
              <div className="text-lg md:text-xl font-bold text-yellow-300">
                Stop losing deals to lost attachments. Start winning with intelligent delivery.
              </div>
            </div>
          </div>

          {/* Back to Blog CTA */}
          <div className="text-center mb-12">
            <button
              onClick={() => window.location.href = '/blog-page'}
              className="inline-flex items-center px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors duration-200"
            >
              ← Back to All Articles
            </button>
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-slate-200">
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-slate-600 mb-3">RELATED TOPICS</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['sales proposal delivery', 'pitch deck sharing', 'B2B sales tools', 'proposal presentation', 'sales material delivery', 'trackable sales content', 'professional sales process'].map((tag) => (
                <span key={tag} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer">
                  #{tag.replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>

        </article>
      </div>
    </div>
  );
};

export default BlogSalesFileSharing;
