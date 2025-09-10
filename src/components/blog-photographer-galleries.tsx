import React from 'react';
import { Button } from './ui/button';
import { Upload, Calendar, Clock, ArrowLeft, User, Share2, Heart, MessageCircle, Tag } from 'lucide-react';
import Navbar from './Navbar';

interface BlogPostProps {
  onNavigate: (page: string) => void;
}

const PhotographerGalleriesPost: React.FC<BlogPostProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onNavigate={onNavigate} />
      
      <main className="pt-20">
        {/* Article Header */}
        <article className="pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <div className="mb-8">
                <Button 
                  variant="ghost" 
                  onClick={() => onNavigate('blog-page')}
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors px-4 py-2 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to All Articles
                </Button>
              </div>

              {/* Hero Section */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden rounded-2xl p-8 md:p-12 lg:p-16 mb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-indigo-600/20"></div>
                <div className="relative">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/20">
                    <span className="mr-2">📸</span>
                    Photography Business
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                    How Photographers Can Deliver Client Galleries That Wow (Without Dropbox Confusion)
                  </h1>
                  
                  <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
                    Transform your photo delivery from clunky file dumps into stunning client experiences that drive referrals and justify premium pricing.
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Lytsite Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>September 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>8 min read</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Article Content */}
              <div className="prose prose-lg prose-slate max-w-none">
                <div className="bg-red-50 border border-red-200 p-8 md:p-10 mb-12 rounded-2xl">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center">
                    <span className="text-2xl mr-3">⚠️</span>
                    The Hidden Problem Killing Your Client Experience
                  </h2>
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed">You've spent hours perfecting that golden hour portrait or capturing every emotional wedding moment. Your editing is flawless, your composition stunning. But then comes delivery day—and everything falls apart.</p>
                  
                  <p className="font-semibold text-slate-900 mb-6">Here's what's really happening to your beautiful work:</p>
                  <ul className="space-y-4 text-slate-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      <div>Clients can't figure out how to download ZIP files on their phones</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      <div>Google Drive links expire or hit permission errors</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      <div>WeTransfer downloads fail halfway through</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      <div>Your carefully curated photo story becomes a confusing folder maze</div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-3 mt-1">•</span>
                      <div>The emotional impact gets buried under technical frustration</div>
                    </li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Cost of Poor Photo Delivery</h3>
                <p className="text-slate-700 mb-6">When clients struggle with downloads, they remember the frustration—not your artistry. Poor delivery experiences lead to:</p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">❌ What You're Losing:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>Fewer referrals</strong> ("the photos were great but such a hassle to get")</li>
                      <li>• <strong>Support headaches</strong> (endless "how do I download?" emails)</li>
                      <li>• <strong>Reduced perceived value</strong> (premium work delivered like amateur hour)</li>
                      <li>• <strong>Lost marketing opportunities</strong> (clients won't share clunky links)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-3">✅ What You Could Gain:</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>40% more referrals</strong> from delighted clients</li>
                      <li>• <strong>60% fewer support emails</strong> about downloads</li>
                      <li>• <strong>20-30% higher pricing</strong> justified by premium experience</li>
                      <li>• <strong>Viral sharing</strong> of your beautiful galleries</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Your Delivery Method Shapes Your Brand Perception</h3>
                <p className="text-slate-700 mb-6">Your photo delivery is the final touchpoint in your client journey—and often the most memorable.</p>
                
                <div className="bg-blue-50 p-6 rounded-xl mb-8">
                  <p className="text-slate-700 mb-4"><strong>Think about it:</strong> Your clients have been anticipating these photos for weeks. The moment they click your delivery link is their <strong>peak emotional moment</strong>. Make it smooth and beautiful, and they'll associate that feeling with your brand forever.</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">Research shows clients form lasting impressions within 50 milliseconds. A professional presentation:</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-green-600 font-medium">✅ Increases referral likelihood by 40%</p>
                      <p className="text-green-600 font-medium">✅ Justifies 20-30% higher pricing</p>
                    </div>
                    <div>
                      <p className="text-green-600 font-medium">✅ Reduces support requests by 60%</p>
                      <p className="text-green-600 font-medium">✅ Creates shareable moments that market your business</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">What's Actually Broken with Traditional Methods</h3>
                
                <div className="space-y-6 mb-8">
                  <div className="border-l-4 border-red-400 pl-6">
                    <h4 className="text-xl font-semibold text-slate-900 mb-3">Google Drive & Dropbox Problems</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>Mobile nightmare:</strong> ZIP files don't download properly on phones (60% of clients view on mobile first)</li>
                      <li>• <strong>Expiration anxiety:</strong> Links die, permissions change, access gets lost</li>
                      <li>• <strong>No storytelling:</strong> Your photo narrative becomes a generic file list</li>
                      <li>• <strong>Brand invisibility:</strong> Your work sits in Google's interface, not yours</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-orange-400 pl-6">
                    <h4 className="text-xl font-semibold text-slate-900 mb-3">WeTransfer & Email Limitations</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>Size restrictions:</strong> 2GB limits force multiple confusing links</li>
                      <li>• <strong>Download failures:</strong> Large files timeout, especially on slower connections</li>
                      <li>• <strong>Temporary access:</strong> Files disappear after 7 days</li>
                      <li>• <strong>Zero customization:</strong> No way to add your branding or story</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Professional Alternative: Gallery Sites That Tell Stories</h3>
                
                <div className="bg-primary/5 p-8 rounded-2xl mb-8">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Imagine sending your clients this instead:</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-3">A Personalized Gallery Experience</h5>
                      <ul className="space-y-2 text-slate-700">
                        <li>• <strong>Custom URL:</strong> yoursite.com/sarah-john-wedding</li>
                        <li>• <strong>Branded presentation:</strong> Your logo, colors, and style throughout</li>
                        <li>• <strong>Mobile-perfect viewing:</strong> Swipe through photos like Instagram Stories</li>
                        <li>• <strong>One-click downloading:</strong> "Download All" or select favorites</li>
                        <li>• <strong>Social sharing built-in:</strong> QR codes and direct links for family</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h5 className="font-semibold text-slate-900 mb-3">Real Photographer Results</h5>
                      <blockquote className="text-slate-700 italic mb-4">
                        "Since switching to branded gallery delivery, my referrals increased 50%. Clients actually share the gallery links now—it's become part of my marketing."
                      </blockquote>
                      <p className="text-sm text-slate-600">— Jessica Chen, Wedding Photographer</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">How Lytsite Transforms Your Photo Delivery Process</h3>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Upload Photos</h4>
                    <p className="text-slate-600 text-sm">Drag & drop your edited photos, just like Drive</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Add Branding</h4>
                    <p className="text-slate-600 text-sm">30-second customization with client names</p>
                  </div>
                  
                  <div className="text-center p-6 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-2">Send One Link</h4>
                    <p className="text-slate-600 text-sm">No ZIP files, no confusion, just beauty</p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">The ROI of Professional Photo Delivery</h3>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-green-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-4">Immediate Benefits</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>Reduce support emails by 60%:</strong> No more download help requests</li>
                      <li>• <strong>Increase sharing by 3x:</strong> Clients share beautiful galleries, not file links</li>
                      <li>• <strong>Save 2 hours per wedding:</strong> No ZIP creation or download troubleshooting</li>
                    </ul>
                  </div>
                  
                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-slate-900 mb-4">Long-term Business Impact</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li>• <strong>Justify 20-30% higher rates:</strong> Premium delivery supports premium pricing</li>
                      <li>• <strong>Boost referrals by 40%:</strong> Great experiences get recommended</li>
                      <li>• <strong>Build brand recognition:</strong> Consistent professional presentation</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Next Steps: Elevate Every Delivery</h3>
                <p className="text-slate-700 mb-6">Your photography deserves better than ZIP file delivery. Your clients deserve better than link confusion.</p>
                
                <div className="bg-primary/5 p-8 rounded-2xl mb-8">
                  <h4 className="font-semibold text-slate-900 mb-4">Start With Your Next Shoot</h4>
                  <ol className="space-y-2 text-slate-700">
                    <li>1. Choose one upcoming gallery delivery</li>
                    <li>2. Create a branded gallery site instead of sharing raw files</li>
                    <li>3. Watch how differently clients respond to professional presentation</li>
                    <li>4. Notice the reduction in support emails and increase in shares</li>
                  </ol>
                </div>

                <p className="text-xl text-slate-700 font-medium mb-8">
                  <strong>Ready to transform your photo delivery from a necessary evil into a competitive advantage?</strong>
                </p>
                
                <p className="text-lg text-slate-600">
                  Your work deserves a delivery experience as beautiful as the moments you capture.
                </p>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600 font-medium">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['photography', 'client-delivery', 'photo-gallery', 'business-tips', 'wedding-photography', 'portrait-photography'].map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share & Actions */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Comment
                    </Button>
                  </div>
                  <Button 
                    onClick={() => onNavigate('blog')}
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-900"
                  >
                    ← Back to Blog
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Ready to Transform Your Client Galleries?
                </h3>
                <p className="text-slate-600 mb-6">
                  Stop sending confusing file links. Create beautiful, professional galleries that wow your clients.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => onNavigate('homepage')}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                  >
                    Start Creating Galleries
                  </Button>
                  <Button 
                    onClick={() => onNavigate('templates-page')}
                    variant="outline" 
                    className="border-slate-300 text-slate-700 hover:bg-white px-8 py-3"
                  >
                    View Gallery Templates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PhotographerGalleriesPost;
