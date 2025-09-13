import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Download, 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  ExternalLink,
  Figma,
  Palette,
  Monitor,
  Smartphone,
  Camera
} from "lucide-react";



const skills = [
  { name: "UI/UX Design", icon: <Figma className="w-5 h-5" />, level: 95 },
  { name: "Visual Design", icon: <Palette className="w-5 h-5" />, level: 90 },
  { name: "Web Design", icon: <Monitor className="w-5 h-5" />, level: 88 },
  { name: "Mobile Design", icon: <Smartphone className="w-5 h-5" />, level: 85 },
  { name: "Photography", icon: <Camera className="w-5 h-5" />, level: 75 }
];

const portfolioItems = [
  {
    id: 1,
    title: "E-commerce Mobile App",
    category: "Mobile Design",
    image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBkZXNpZ258ZW58MXx8fHwxNzU3MTcyNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Complete UI/UX design for a fashion e-commerce mobile application"
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1730794545099-14902983739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzU3MTI4MjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Analytics dashboard design for project management software"
  },
  {
    id: 3,
    title: "Brand Identity",
    category: "Visual Design",
    image: "https://images.unsplash.com/photo-1670341445726-8a9f4169da8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZGluZyUyMGxvZ28lMjBkZXNpZ258ZW58MXx8fHwxNzU3MTUwNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Complete brand identity package for sustainable tech startup"
  },
  {
    id: 4,
    title: "Creative Portfolio",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHdvcmtzcGFjZSUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NzE2NDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Personal portfolio website for digital artist"
  }
];

export default function PortfolioResume() {
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
              <h1 className="text-lg font-semibold text-slate-900">Portfolio</h1>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Resume
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzIwMTY1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Alex Rivera"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                    Alex Rivera
                  </h1>
                  <p className="text-xl text-primary mb-4">Senior UI/UX Designer</p>
                  <p className="text-lg text-slate-600 leading-relaxed mb-6">
                    Passionate about creating beautiful, user-centered digital experiences. 
                    5+ years designing for startups and enterprise companies.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">Available for hire</Badge>
                    <Badge variant="outline">Remote friendly</Badge>
                    <Badge variant="outline">San Francisco, CA</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Get in touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">alex@alexrivera.design</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">San Francisco, CA</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm">linkedin.com/in/alexrivera</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">alexrivera.design</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">About</h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed mb-4">
                  I'm a Senior UI/UX Designer with over 5 years of experience creating digital products 
                  that users love. My approach combines user research, visual design, and strategic thinking 
                  to solve complex problems with elegant solutions.
                </p>
                <p className="text-slate-600 leading-relaxed mb-4">
                  I've worked with startups and Fortune 500 companies, helping them design everything from 
                  mobile apps to enterprise dashboards. I'm passionate about accessibility, design systems, 
                  and creating inclusive experiences for all users.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  When I'm not designing, you can find me exploring San Francisco's coffee scene, 
                  taking photos, or contributing to open-source design projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-semibold text-slate-900 mb-8">Skills & Expertise</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-primary">
                      {skill.icon}
                    </div>
                    <h3 className="font-medium text-slate-900">{skill.name}</h3>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{skill.level}% proficiency</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">Featured Work</h2>
            <Button variant="outline">
              View All Projects
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-video relative">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-800">{item.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 mb-4">{item.description}</p>
                  <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-white transition-colors">
                    View Project
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Experience Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8">Experience</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Senior UI/UX Designer</h3>
                    <p className="text-primary mb-2">TechCorp Inc. • 2022 - Present</p>
                    <p className="text-slate-600">
                      Lead design for B2B SaaS platform serving 10k+ users. Redesigned core user flows, 
                      increased conversion by 40%, and established company-wide design system.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Product Designer</h3>
                    <p className="text-primary mb-2">StartupXYZ • 2020 - 2022</p>
                    <p className="text-slate-600">
                      Designed mobile-first fintech app from concept to launch. Collaborated with engineering 
                      and product teams to deliver features used by 100k+ active users.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">Visual Designer</h3>
                    <p className="text-primary mb-2">Creative Agency • 2019 - 2020</p>
                    <p className="text-slate-600">
                      Created brand identities and marketing materials for diverse clients. 
                      Specialized in digital design, typography, and brand strategy.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="bg-primary text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Let's work together</h2>
              <p className="text-xl text-blue-100 mb-8">
                I'm always interested in new opportunities and exciting projects.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Built with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Lytsite
            </span>
            {" "}• Professional portfolios made simple
          </p>
        </div>
      </footer>
    </div>
  );
}