import React, { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import Navbar from "./Navbar";
import { 
  ArrowLeft,
  Search,
  BookOpen,
  MessageCircle,
  FileText,
  Settings,
  Upload,
  Download,
  Share2,
  Users,
  Shield,
  CreditCard,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  Clock
} from "lucide-react";

export default function HelpCenter() {
  
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of using Lytsite",
      articles: [
        { title: "What is Lytsite?", views: "1.2k", time: "2 min read" },
        { title: "Creating your first template", views: "950", time: "3 min read" },
        { title: "Uploading files", views: "800", time: "2 min read" },
        { title: "Sharing your projects", views: "650", time: "3 min read" },
      ]
    },
    {
      id: "templates",
      title: "Templates & Design",
      icon: FileText,
      description: "Customize and manage your templates",
      articles: [
        { title: "Choosing the right template", views: "720", time: "4 min read" },
        { title: "Customizing colors and branding", views: "580", time: "5 min read" },
        { title: "Adding your logo", views: "430", time: "2 min read" },
        { title: "Template best practices", views: "340", time: "6 min read" },
      ]
    },
    {
      id: "files",
      title: "File Management",
      icon: Upload,
      description: "Upload, organize, and manage your files",
      articles: [
        { title: "Supported file formats", views: "890", time: "3 min read" },
        { title: "File size limits", views: "670", time: "2 min read" },
        { title: "Organizing your files", views: "450", time: "4 min read" },
        { title: "Batch uploading", views: "320", time: "3 min read" },
      ]
    },
    {
      id: "sharing",
      title: "Sharing & Collaboration",
      icon: Share2,
      description: "Share your work and collaborate with others",
      articles: [
        { title: "Generating share links", views: "1.1k", time: "2 min read" },
        { title: "QR code sharing", views: "640", time: "3 min read" },
        { title: "Password protection", views: "520", time: "4 min read" },
        { title: "Analytics and views", views: "380", time: "3 min read" },
      ]
    },
    {
      id: "account",
      title: "Account & Billing",
      icon: Settings,
      description: "Manage your account and subscription",
      articles: [
        { title: "Account settings", views: "550", time: "3 min read" },
        { title: "Subscription plans", views: "780", time: "4 min read" },
        { title: "Billing and payments", views: "420", time: "3 min read" },
        { title: "Canceling your subscription", views: "290", time: "2 min read" },
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: HelpCircle,
      description: "Common issues and solutions",
      articles: [
        { title: "Upload failed - what to do?", views: "650", time: "3 min read" },
        { title: "Link not working", views: "480", time: "2 min read" },
        { title: "Performance issues", views: "370", time: "4 min read" },
        { title: "Browser compatibility", views: "290", time: "3 min read" },
      ]
    }
  ];

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageCircle,
      action: () => window.location.href = '/contact',
      color: "bg-blue-500"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step guides",
      icon: ExternalLink,
      action: () => window.open('https://youtube.com', '_blank'),
      color: "bg-red-500"
    },
    {
      title: "Community Forum",
      description: "Connect with other users",
      icon: Users,
      action: () => window.open('https://community.lytsite.com', '_blank'),
      color: "bg-green-500"
    },
    {
      title: "Feature Requests",
      description: "Suggest new features",
      icon: ExternalLink,
      action: () => window.open('https://feedback.lytsite.com', '_blank'),
      color: "bg-purple-500"
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    searchQuery === "" ||
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-8 text-white hover:text-gray-100 hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Help Center
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Find answers to your questions and learn how to get the most out of Lytsite
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 w-full text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder-gray-300 focus:bg-white/20"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">50+</div>
              <div className="text-gray-300">Help Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">24/7</div>
              <div className="text-gray-300">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5k+</div>
              <div className="text-gray-300">Questions Answered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Need Immediate Help?</h2>
            <p className="text-lg text-slate-600">Quick actions to get you back on track</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" onClick={action.action}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{action.title}</h3>
                  <p className="text-slate-600 text-sm">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-slate-600">Find detailed guides and tutorials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-xl transition-all duration-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <category.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{category.title}</h3>
                      <p className="text-slate-600 text-sm">{category.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.articles.slice(0, 3).map((article, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer group/article">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900 mb-1 group-hover/article:text-blue-600 transition-colors duration-200">
                            {article.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-xs text-slate-500">
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.time}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover/article:text-blue-600 transition-colors duration-200" />
                      </div>
                    ))}
                    
                    {category.articles.length > 3 && (
                      <div className="pt-2">
                        <Button variant="ghost" size="sm" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          View all {category.articles.length} articles
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600">Try searching with different keywords or browse our categories above.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Our support team is here to help you succeed with Lytsite
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Support</h3>
              <p className="text-gray-300 text-sm">support@lytsite.com</p>
              <p className="text-gray-400 text-xs">Response within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-300 text-sm">Available 24/7</p>
              <p className="text-gray-400 text-xs">Instant responses</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
              <p className="text-gray-400 text-xs">Mon-Fri, 9AM-6PM EST</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/contact'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/faq'}
              className="border-white/20 text-white hover:bg-white/10 px-8"
            >
              View FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">
              © 2025 Lytsite. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <button 
                onClick={() => window.location.href = '/'} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => window.location.href = '/about-us'} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => window.location.href = '/privacy-policy'} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Privacy
              </button>
              <button 
                onClick={() => window.location.href = '/terms-conditions'} 
                className="text-slate-400 hover:text-white transition-colors"
              >
                Terms
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}