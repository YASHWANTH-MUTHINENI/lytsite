import React, { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import Navbar from "./Navbar";
import { 
  ArrowLeft,
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle
} from "lucide-react";

export default function Contact() {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Button
              variant="ghost"
              onClick={() => window.location.href = '/'}
              className="mb-8 text-white hover:text-gray-100 hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              Get in <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Form */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Send us a message</h2>
                    <p className="text-slate-800">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Message sent successfully!</h3>
                      <p className="text-slate-800 mb-6">
                        Thank you for contacting us. We'll get back to you soon.
                      </p>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send another message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-slate-900 mb-2">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-900 mb-2">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="How can we help you?"
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-800 mb-2">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your inquiry..."
                          className="w-full resize-none"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Sending...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </div>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h2>
                  <p className="text-slate-700 mb-8">
                    Get in touch through any of these channels. We're here to help with questions, 
                    technical support, or business inquiries.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Email */}
                  <Card className="border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                          <p className="text-slate-700 text-sm mb-2">
                            For general inquiries and support
                          </p>
                          <a 
                            href="mailto:hello@lytsite.com" 
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            hello@lytsite.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support */}
                  <Card className="border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Technical Support</h3>
                          <p className="text-slate-700 text-sm mb-2">
                            Need help with your account or platform?
                          </p>
                          <a 
                            href="mailto:support@lytsite.com" 
                            className="text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            support@lytsite.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Business */}
                  <Card className="border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 mb-1">Business Inquiries</h3>
                          <p className="text-slate-700 text-sm mb-2">
                            Enterprise solutions and partnerships
                          </p>
                          <a 
                            href="mailto:business@lytsite.com" 
                            className="text-purple-600 hover:text-purple-700 font-medium"
                          >
                            business@lytsite.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Response Time */}
                <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="w-5 h-5 text-slate-700" />
                      <h3 className="font-semibold text-slate-900">Response Times</h3>
                    </div>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span>General inquiries:</span>
                        <span className="font-medium">Within 24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical support:</span>
                        <span className="font-medium">Within 12 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Business inquiries:</span>
                        <span className="font-medium">Within 48 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Office Info */}
                <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-slate-700" />
                      <h3 className="font-semibold text-slate-900">Our Location</h3>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      We're a remote-first company with team members around the globe, 
                      dedicated to providing 24/7 support for our international user base.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-700 mb-8">
              Can't find what you're looking for? Our FAQ section might have the answers.
            </p>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.location.href = '/faq'}
              className="px-8 py-3"
            >
              View FAQ
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src="/logo.png" 
              alt="Lytsite" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold">Lytsite</span>
          </div>
          <p className="text-slate-400 mb-6">
            Professional file sharing made simple.
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
          </div>
        </div>
      </footer>
    </div>
  );
}