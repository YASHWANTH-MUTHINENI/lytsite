import React from "react";

import { Button } from './ui/button';
import { Upload, Calendar, Clock, ArrowRight, User, Tag, ArrowLeft } from 'lucide-react';
import Navbar from './Navbar';

const BlogPage = () => {
  
  const blogPosts = [
    {
      id: 'photographer-client-galleries',
      title: 'How Photographers Can Deliver Client Galleries That Wow (Without Dropbox Confusion)',
      excerpt: 'Transform your photo delivery from clunky file dumps into stunning client experiences that drive referrals and justify premium pricing.',
      author: 'Lytsite Team',
      date: '2025-01-10',
      readTime: '8 min read',
      category: 'Photography',
      tags: ['photography', 'client-delivery', 'business-tips'],
      image: '/api/placeholder/800/400',
      featured: true
    },
    {
      id: 'sales-file-sharing',
      title: 'Stop Losing Deals to Lost Attachments: Smarter Sales File Sharing',
      excerpt: 'How professional sales file delivery transforms prospects into closed deals. Discover why 30% of B2B deals stall over poor material delivery.',
      author: 'Lytsite Team',
      date: '2025-01-08',
      readTime: '12 min read',
      category: 'Sales',
      tags: ['sales', 'B2B', 'proposal-delivery'],
      image: '/api/placeholder/800/400',
      featured: false
    }
  ];

  const categories = ['All', 'Photography', 'Sales', 'Agency Tools', 'Business Tips'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4">
            {/* Back to Home Button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Lytsite Blog</h1>
              </div>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Tips, insights, and best practices for creating professional file sharing experiences that wow your clients.
              </p>
            </div>
          </div>
        </section>

        {/* Categories - Mobile Scrollable */}
        <section className="py-6 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4">
            <div className="flex sm:justify-center gap-3 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  className={`rounded-full px-4 sm:px-6 py-2 whitespace-nowrap flex-shrink-0 ${
                    category === 'All' 
                      ? 'bg-primary hover:bg-primary/90 text-white' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 md:mb-12 text-center">Latest Articles</h2>
              
              <div className="grid gap-8 md:gap-12">
                {blogPosts.map((post, index) => (
                  <article key={post.id} className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 ${post.featured ? 'ring-2 ring-primary/20' : ''}`}>
                    <div className={`grid gap-0 ${index % 2 === 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-2'} ${index % 2 === 1 ? 'lg:[&>*:nth-child(1)]:order-2 lg:[&>*:nth-child(2)]:order-1' : ''}`}>
                      {/* Image */}
                      <div className="aspect-[16/9] lg:aspect-[4/3] relative overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                          <div className="text-center p-6 md:p-8">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Upload className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            </div>
                            <p className="text-slate-600 font-medium text-sm md:text-base">
                              {post.category} Insights
                            </p>
                          </div>
                        </div>
                        {post.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-white shadow-lg">
                              Featured
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {post.category}
                          </span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 mb-6 leading-relaxed text-sm md:text-base">
                          {post.excerpt}
                        </p>
                        
                        {/* Meta Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                              <span className="text-slate-600">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                              <span className="text-slate-600">
                                {new Date(post.date).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 md:w-4 md:h-4 text-slate-400" />
                              <span className="text-slate-600">{post.readTime}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => window.location.href = `/${`blog-${post.id}`}`}
                          className="w-full sm:w-fit bg-primary hover:bg-primary/90 text-white group"
                        >
                          Read Full Article
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              {/* Coming Soon Placeholder */}
              <div className="mt-12 md:mt-16 text-center">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 border border-slate-200">
                  <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Tag className="w-8 h-8 text-slate-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-700 mb-4">More Articles Coming Soon</h3>
                  <p className="text-slate-600 max-w-2xl mx-auto">
                    We're working on more helpful guides covering templates, client success stories, and advanced tips for professional file sharing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-gradient-to-br from-slate-50 to-white border-t border-slate-100">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Ready to Transform Your Client Delivery?
              </h2>
              <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed">
                Stop sending messy file links. Create beautiful, professional sharing experiences that wow your clients and drive more business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-3 text-sm md:text-base"
                >
                  Get Started Free
                </Button>
                <Button 
                  onClick={() => window.location.href = '/templates'}
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-50 px-6 md:px-8 py-3 text-sm md:text-base"
                >
                  View Templates
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogPage;
