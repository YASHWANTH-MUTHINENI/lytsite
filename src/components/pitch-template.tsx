import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Share2, 
  Download,
  Calendar,
  Mail,
  Phone,
  ExternalLink,
  CheckCircle,
  ArrowRight
} from "lucide-react";



const marketMetrics = [
  { label: "Market Size", value: "$2.5B", subtext: "Total addressable market", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Growth Rate", value: "35%", subtext: "Year-over-year growth", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Target Users", value: "10M+", subtext: "Potential customers", icon: <Users className="w-5 h-5" /> },
  { label: "Revenue Goal", value: "$5M", subtext: "Year 2 projection", icon: <Target className="w-5 h-5" /> }
];

const timeline = [
  { phase: "Q1 2025", title: "MVP Launch", description: "Core platform with basic features" },
  { phase: "Q2 2025", title: "User Acquisition", description: "Marketing push and partnerships" },
  { phase: "Q3 2025", title: "Feature Expansion", description: "Advanced features and integrations" },
  { phase: "Q4 2025", title: "Scale & Growth", description: "International expansion planning" }
];

const teamMembers = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-founder",
    background: "Former VP at Meta, 10+ years in tech",
    image: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzIwMTY1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-founder",
    background: "Former Staff Engineer at Google, AI/ML expert",
    image: "https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3MjQxMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Emily Johnson",
    role: "VP Marketing",
    background: "Former CMO at successful B2B SaaS startup",
    image: "https://images.unsplash.com/photo-1651924492297-4b4bd30fcab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBnYWxsZXJ5fGVufDF8fHx8MTc1NzI0MTE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const fundingBreakdown = [
  { category: "Product Development", percentage: 40, amount: "$800K" },
  { category: "Marketing & Sales", percentage: 30, amount: "$600K" },
  { category: "Team Expansion", percentage: 20, amount: "$400K" },
  { category: "Operations", percentage: 10, amount: "$200K" }
];

export default function PitchTemplate() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lytsite
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg font-semibold text-slate-900">Pitch Deck</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
                Series A
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6">Series A Funding Round</Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              NextGen AI Platform
            </h1>
            <p className="text-2xl text-slate-600 mb-8 max-w-4xl mx-auto">
              Revolutionizing how businesses leverage artificial intelligence 
              to automate workflows and drive growth.
            </p>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-12 max-w-4xl mx-auto">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMHBpdGNofGVufDF8fHx8MTc1NzI0NDg3Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="NextGen AI Platform pitch"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Download className="w-5 h-5 mr-2" />
                Download Deck
              </Button>
            </div>
          </div>

          {/* Seeking Investment */}
          <div className="text-center mb-20">
            <Card className="bg-primary text-white max-w-4xl mx-auto">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-4">Seeking $2M Series A</h2>
                <p className="text-xl text-blue-100 mb-8">
                  To accelerate product development, expand our team, and scale our go-to-market strategy
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="text-3xl font-bold mb-2">18 months</div>
                    <div className="text-blue-200">Runway Extension</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">50x</div>
                    <div className="text-blue-200">Revenue Multiple</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-2">$25M</div>
                    <div className="text-blue-200">Exit Potential</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Opportunity */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Market Opportunity</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {marketMetrics.map((metric, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {metric.icon}
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-2">{metric.value}</div>
                    <div className="text-lg font-medium text-slate-900 mb-1">{metric.label}</div>
                    <div className="text-sm text-slate-600">{metric.subtext}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">The Problem We're Solving</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  83% of businesses struggle to implement AI solutions effectively, wasting millions on failed projects. 
                  Current tools are either too complex for non-technical teams or too simplistic for real business needs.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 mb-2">$12.8B</div>
                    <div className="text-sm text-red-700">Wasted on failed AI projects annually</div>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">8 months</div>
                    <div className="text-sm text-yellow-700">Average time to implement AI solutions</div>
                  </div>
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">65%</div>
                    <div className="text-sm text-blue-700">of AI projects never reach production</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Our Solution</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">NextGen AI Platform</h3>
                    <p className="text-lg text-slate-600 leading-relaxed mb-6">
                      A no-code AI platform that enables businesses to build, deploy, and scale 
                      AI-powered workflows in minutes, not months.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Drag-and-drop workflow builder</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Pre-trained AI models for common tasks</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">One-click deployment to production</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Enterprise-grade security and compliance</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-100 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">🚀</div>
                    <div className="text-2xl font-bold text-slate-900 mb-2">95% Faster</div>
                    <div className="text-slate-600">Time to deploy AI solutions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Business Model & Traction */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Business Model</h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">Starter Plan</div>
                      <div className="text-sm text-slate-600">Small teams, basic features</div>
                    </div>
                    <div className="text-xl font-bold text-primary">$99/mo</div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">Professional Plan</div>
                      <div className="text-sm text-slate-600">Growing businesses, advanced AI</div>
                    </div>
                    <div className="text-xl font-bold text-primary">$299/mo</div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">Enterprise Plan</div>
                      <div className="text-sm text-slate-600">Large organizations, custom solutions</div>
                    </div>
                    <div className="text-xl font-bold text-primary">$999/mo</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Early Traction</h3>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">127</div>
                    <div className="text-slate-600">Paying Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">$47K</div>
                    <div className="text-slate-600">Monthly Recurring Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">156%</div>
                    <div className="text-slate-600">Net Revenue Retention</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">$12K</div>
                    <div className="text-slate-600">Average Contract Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">The Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-slate-600">{member.background}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Roadmap</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {timeline.map((item, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <Badge className="bg-primary text-white mb-4">{item.phase}</Badge>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600">{item.description}</p>
                  </CardContent>
                  {index < timeline.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-slate-300" />
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Use of Funds */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">Use of Funds</h2>
            <Card>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">$2M Funding Breakdown</h3>
                    <div className="space-y-4">
                      {fundingBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3"
                              style={{ backgroundColor: `hsl(${index * 90}, 70%, 50%)` }}
                            ></div>
                            <span className="font-medium text-slate-900">{item.category}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">{item.amount}</div>
                            <div className="text-sm text-slate-600">{item.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Expected Outcomes</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Launch enterprise-grade features</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Scale to 1,000+ customers</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Reach $1M+ ARR</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Expand to international markets</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <span className="text-slate-700">Build strategic partnerships</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Next Steps */}
          <div className="text-center">
            <Card className="bg-primary text-white">
              <CardContent className="p-12">
                <h2 className="text-4xl font-bold mb-4">Let's Build the Future Together</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  We're looking for strategic investors who share our vision of democratizing AI. 
                  Join us in revolutionizing how businesses leverage artificial intelligence.
                </p>
                
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <Mail className="w-8 h-8 mx-auto mb-3" />
                    <div className="font-semibold">Email</div>
                    <div className="text-blue-200">sarah@nextgenai.com</div>
                  </div>
                  <div className="text-center">
                    <Phone className="w-8 h-8 mx-auto mb-3" />
                    <div className="font-semibold">Phone</div>
                    <div className="text-blue-200">+1 (555) 123-4567</div>
                  </div>
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-3" />
                    <div className="font-semibold">Schedule</div>
                    <div className="text-blue-200">calendly.com/nextgenai</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Investment Meeting
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Deck
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Crafted with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Lytsite
            </span>
            {" "}• Professional pitch decks made simple
          </p>
        </div>
      </footer>
    </div>
  );
}