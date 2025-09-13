import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import Navbar from "./Navbar";
import { 
  ArrowLeft,
  Shield,
  Zap,
  Users,
  Globe,
  Heart,
  Target,
  Lightbulb,
  Award
} from "lucide-react";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-8 text-white hover:text-gray-100 hover:bg-white/10 border border-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              About <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Lytsite</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed">
              We're on a mission to revolutionize how professionals share and deliver files to their clients.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-800 leading-relaxed">
                To transform the way professionals deliver work to their clients by replacing outdated file-sharing methods 
                with beautiful, secure, and professional presentation websites that enhance business relationships and showcase 
                work in its best light.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Problem We Solve</h3>
                <p className="text-slate-800 mb-6 leading-relaxed">
                  For too long, professionals have been forced to share their work through generic file-sharing platforms, 
                  email attachments, or ZIP files. These methods don't do justice to the quality of work being delivered 
                  and create friction in client relationships.
                </p>
                <p className="text-slate-800 leading-relaxed">
                  Lytsite changes this by instantly transforming your files into professional, branded websites that 
                  impress clients and make your work shine.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">10 sec</div>
                    <div className="text-sm text-slate-600">Setup time</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">10k+</div>
                    <div className="text-sm text-slate-600">Files shared</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">99.9%</div>
                    <div className="text-sm text-slate-600">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">SOC 2</div>
                    <div className="text-sm text-slate-600">Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Values</h2>
              <p className="text-lg text-slate-800">
                The principles that guide everything we do at Lytsite.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Client-First</h3>
                  <p className="text-slate-800 leading-relaxed">
                    Every feature we build is designed to enhance the client experience and strengthen professional relationships.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Simplicity</h3>
                  <p className="text-slate-800 leading-relaxed">
                    Professional results shouldn't require technical expertise. We make powerful tools accessible to everyone.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Security</h3>
                  <p className="text-slate-800 leading-relaxed">
                    Your work and your clients' data are protected with enterprise-grade security and privacy measures.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Excellence</h3>
                  <p className="text-slate-800 leading-relaxed">
                    We believe great work deserves a great presentation. Every detail matters in showcasing your expertise.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Innovation</h3>
                  <p className="text-slate-800 leading-relaxed">
                    We constantly push boundaries to find better ways to connect professionals with their clients.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Reliability</h3>
                  <p className="text-slate-800 leading-relaxed">
                    When you're presenting to clients, everything must work perfectly. We ensure 99.9% uptime and flawless performance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-lg text-slate-800">
                Born from the frustration of delivering professional work through unprofessional channels.
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-slate-800">
              <p className="text-lg leading-relaxed mb-6">
                Lytsite was founded in 2025 by a team of professionals who were tired of seeing beautiful work 
                delivered through ugly, generic file-sharing platforms. As designers, developers, and content creators 
                ourselves, we experienced firsthand the disconnect between the quality of work we produced and the 
                unprofessional way it had to be shared.
              </p>
              
              <p className="text-lg leading-relaxed mb-6">
                We realized that the final moment of delivery - when a client first sees your work - is just as important 
                as the work itself. It's the difference between sending a crumpled business card and presenting a 
                beautifully designed portfolio.
              </p>
              
              <p className="text-lg leading-relaxed mb-8">
                Today, Lytsite empowers thousands of professionals to deliver their work with the professionalism 
                it deserves. From photographers sharing client galleries to agencies delivering campaign assets, 
                we're transforming how professional relationships are built through better presentation.
              </p>

              <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Join Our Mission</h3>
                <p className="text-slate-800 mb-6">
                  Ready to elevate how you deliver work to your clients?
                </p>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
                >
                  Get Started Today
                </Button>
              </div>
            </div>
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
              onClick={() => navigate('/')} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-slate-400 hover:text-white transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => navigate('/privacy-policy')} 
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