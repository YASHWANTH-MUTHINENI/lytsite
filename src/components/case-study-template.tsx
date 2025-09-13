
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Target, 
  TrendingUp, 
  Share2, 
  Download,
  ChevronRight,
  ExternalLink,
  ArrowRight
} from "lucide-react";



const projectDetails = {
  duration: "3 months",
  team: "4 designers, 2 developers",
  role: "Lead UX Designer",
  tools: ["Figma", "Miro", "Principle", "React"]
};

const metrics = [
  { label: "User Engagement", value: "+45%", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Task Completion", value: "+62%", icon: <Target className="w-5 h-5" /> },
  { label: "User Satisfaction", value: "4.8/5", icon: <Users className="w-5 h-5" /> },
  { label: "Bounce Rate", value: "-28%", icon: <TrendingUp className="w-5 h-5" /> }
];

const processSteps = [
  {
    phase: "Research",
    title: "Understanding the Problem",
    description: "Conducted user interviews, analyzed competitor landscape, and identified key pain points in the existing experience.",
    deliverables: ["User Interviews", "Competitive Analysis", "Problem Statement"]
  },
  {
    phase: "Ideation",
    title: "Exploring Solutions",
    description: "Facilitated design workshops, created user journey maps, and developed multiple solution concepts through rapid prototyping.",
    deliverables: ["Journey Maps", "Wireframes", "Concept Prototypes"]
  },
  {
    phase: "Design",
    title: "Crafting the Experience",
    description: "Developed high-fidelity designs, created a comprehensive design system, and built interactive prototypes for testing.",
    deliverables: ["High-fidelity Mockups", "Design System", "Interactive Prototypes"]
  },
  {
    phase: "Testing",
    title: "Validating the Solution",
    description: "Ran usability tests, gathered feedback, iterated on designs, and prepared handoff materials for development.",
    deliverables: ["Usability Test Results", "Design Iterations", "Development Handoff"]
  }
];

export default function CaseStudyTemplate() {
  
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
                onClick={() => window.location.href = '/'}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lytsite
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg font-semibold text-slate-900">Case Study</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                UX Case Study
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">UX Design Case Study</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Redesigning the E-commerce Experience
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              How we increased user engagement by 45% and task completion by 62% 
              through a comprehensive redesign of the shopping experience.
            </p>
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1622117515670-fcb02499491f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjYXNlJTIwc3R1ZHklMjByZXNlYXJjaHxlbnwxfHx8fDE3NTcyNDQ4Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="E-commerce redesign case study"
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-900">Duration</div>
                <div className="text-sm text-slate-600">{projectDetails.duration}</div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-900">Team</div>
                <div className="text-sm text-slate-600">{projectDetails.team}</div>
              </div>
              <div className="text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-900">Role</div>
                <div className="text-sm text-slate-600">{projectDetails.role}</div>
              </div>
              <div className="text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-sm font-medium text-slate-900">Tools</div>
                <div className="text-sm text-slate-600">{projectDetails.tools.join(", ")}</div>
              </div>
            </div>
          </div>

          {/* Results/Metrics */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Impact & Results</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {metric.icon}
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-slate-600">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Problem Statement */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The Challenge</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                The existing e-commerce platform was experiencing high bounce rates and low conversion rates. 
                Users frequently abandoned their shopping carts and struggled to find products efficiently. 
                Our goal was to redesign the entire shopping experience to be more intuitive and engaging.
              </p>
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Problems Identified:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600">Complex navigation made product discovery difficult</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600">Checkout process had too many steps and form fields</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600">Mobile experience was not optimized for touch interactions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-slate-600">Lack of trust signals and social proof throughout the journey</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Design Process</h2>
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-primary/5 p-8 md:w-1/3">
                        <Badge className="bg-primary text-white mb-4">{step.phase}</Badge>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                        <p className="text-slate-600">{step.description}</p>
                      </div>
                      <div className="p-8 md:w-2/3">
                        <h4 className="text-lg font-semibold text-slate-900 mb-4">Key Deliverables:</h4>
                        <ul className="space-y-3">
                          {step.deliverables.map((deliverable, idx) => (
                            <li key={idx} className="flex items-center text-slate-600">
                              <ChevronRight className="w-4 h-4 text-primary mr-2" />
                              {deliverable}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Solution */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">The Solution</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We redesigned the entire e-commerce experience with a focus on simplicity, trust, and mobile-first design. 
                The new experience features streamlined navigation, a simplified checkout process, and enhanced product discovery.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Improvements:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600">Redesigned navigation with smart categorization</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600">Streamlined 3-step checkout process</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600">Mobile-optimized touch interactions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600">Enhanced product pages with social proof</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Design Principles:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600"><span className="font-medium">Simplicity:</span> Reduce cognitive load</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600"><span className="font-medium">Trust:</span> Build confidence throughout</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600"><span className="font-medium">Speed:</span> Optimize for quick decisions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600"><span className="font-medium">Accessibility:</span> Design for everyone</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lessons Learned */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Learnings</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">User Research is Critical</h3>
                  <p className="text-slate-600">
                    Early user interviews revealed pain points we hadn't considered. This research became 
                    the foundation for all design decisions and helped us prioritize features effectively.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Mobile-First Approach</h3>
                  <p className="text-slate-600">
                    Designing for mobile first forced us to focus on the essential elements and 
                    create a more streamlined experience that worked well across all devices.
                  </p>
                </div>
                
                <div className="border-l-4 border-primary pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Iterative Testing</h3>
                  <p className="text-slate-600">
                    Regular usability testing throughout the design process helped us catch issues early 
                    and validate solutions before implementation, saving significant development time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Next Steps</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                While the redesign has been successful, we continue to monitor user behavior and 
                iterate on the experience. Our next focus areas include:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-slate-900">
                    <ArrowRight className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium">Personalization features</span>
                  </div>
                  <div className="flex items-center text-slate-900">
                    <ArrowRight className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium">AI-powered recommendations</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center text-slate-900">
                    <ArrowRight className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium">Enhanced search functionality</span>
                  </div>
                  <div className="flex items-center text-slate-900">
                    <ArrowRight className="w-4 h-4 text-primary mr-2" />
                    <span className="font-medium">Social shopping features</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <Card className="bg-primary text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Interested in the Full Case Study?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Download the complete case study with detailed wireframes, user flows, 
                  and implementation guidelines.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
                    <Download className="w-4 h-4 mr-2" />
                    Download Full Case Study
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Site
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
            Created with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => window.location.href = '/'}
            >
              Lytsite
            </span>
            {" "}• Professional case studies made simple
          </p>
        </div>
      </footer>
    </div>
  );
}