import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Download, 
  Share2, 
  QrCode,
  ExternalLink,
  Ticket,
  Star
} from "lucide-react";

interface EventTemplateProps {
  onNavigate: (page: string) => void;
}

const eventSchedule = [
  {
    time: "9:00 AM",
    title: "Registration & Welcome Coffee",
    speaker: "Event Team",
    type: "networking"
  },
  {
    time: "10:00 AM",
    title: "Opening Keynote: The Future of Design",
    speaker: "Sarah Chen, Design Director at Meta",
    type: "keynote"
  },
  {
    time: "11:00 AM",
    title: "Workshop: Design Systems at Scale",
    speaker: "Alex Rivera, Senior Designer",
    type: "workshop"
  },
  {
    time: "12:30 PM",
    title: "Networking Lunch",
    speaker: "All Attendees",
    type: "break"
  },
  {
    time: "2:00 PM",
    title: "Panel: AI in Creative Industries",
    speaker: "Industry Leaders Panel",
    type: "panel"
  },
  {
    time: "3:30 PM",
    title: "Closing Remarks & Networking",
    speaker: "Event Organizers",
    type: "networking"
  }
];

const speakers = [
  {
    name: "Sarah Chen",
    role: "Design Director, Meta",
    image: "https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzIwMTY1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Alex Rivera",
    role: "Senior Designer, Figma",
    image: "https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3MjQxMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    name: "Jordan Kim",
    role: "VP Design, Stripe",
    image: "https://images.unsplash.com/photo-1651924492297-4b4bd30fcab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBnYWxsZXJ5fGVufDF8fHx8MTc1NzI0MTE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const getSessionTypeColor = (type: string) => {
  switch (type) {
    case 'keynote': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'workshop': return 'bg-green-50 text-green-700 border-green-200';
    case 'panel': return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'break': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export default function EventTemplate({ onNavigate }: EventTemplateProps) {
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
                onClick={() => onNavigate('homepage')}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lytsite
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <h1 className="text-lg font-semibold text-slate-900">Event</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Live Event
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
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden mb-12">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1560523159-94c9d18bcf27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25mZXJlbmNlJTIwZXZlbnQlMjBzdGFnZXxlbnwxfHx8fDE3NTcyNDQ4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Design Conference 2025"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-4xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Design Conference 2025
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-blue-100">
                  Shaping the Future of Digital Design
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-lg">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    March 15, 2025
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    9:00 AM - 5:00 PM
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    San Francisco, CA
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">500+ Attendees</h3>
                <p className="text-slate-600">Join designers from top companies worldwide</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">12 Expert Speakers</h3>
                <p className="text-slate-600">Learn from industry leaders and innovators</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Early Bird Pricing</h3>
                <p className="text-slate-600">Limited time offer - save 30% on tickets</p>
              </CardContent>
            </Card>
          </div>

          {/* Schedule */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Event Schedule</h2>
            <Card>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {eventSchedule.map((session, index) => (
                    <div key={index} className="p-6 border-b border-slate-200 last:border-b-0">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="text-lg font-semibold text-primary">{session.time}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900 mb-1">{session.title}</h3>
                              <p className="text-slate-600">{session.speaker}</p>
                            </div>
                            <Badge className={getSessionTypeColor(session.type)}>
                              {session.type.charAt(0).toUpperCase() + session.type.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Speakers */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Featured Speakers</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {speakers.map((speaker, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                      <ImageWithFallback
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{speaker.name}</h3>
                    <p className="text-slate-600">{speaker.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Registration CTA */}
          <div className="text-center mb-16">
            <Card className="bg-primary text-white">
              <CardContent className="p-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Join Us?</h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Don't miss this opportunity to connect with the design community and learn from the best.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
                    <Ticket className="w-4 h-4 mr-2" />
                    Register Now - $199
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Download className="w-4 h-4 mr-2" />
                    Download Brochure
                  </Button>
                </div>
                <p className="text-sm text-blue-200 mt-4">
                  Early bird pricing ends March 1st • Limited seats available
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Event Details</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Date</div>
                      <div className="text-slate-600">Saturday, March 15, 2025</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Time</div>
                      <div className="text-slate-600">9:00 AM - 5:00 PM PST</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <div className="font-medium text-slate-900">Venue</div>
                      <div className="text-slate-600">Moscone Center, San Francisco, CA</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">Share This Event</h3>
                <div className="space-y-4 mb-6">
                  <Button variant="outline" className="w-full justify-start">
                    📱 Copy Event Link
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📧 Email Invitation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    💬 Share on Social
                  </Button>
                </div>
                
                <div className="text-center">
                  <div className="inline-block p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <div className="w-24 h-24 bg-white flex items-center justify-center rounded">
                      <QrCode className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-3">
                    Scan to view event details
                  </p>
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
            Organized with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => onNavigate('homepage')}
            >
              Lytsite
            </span>
            {" "}• Professional event pages made simple
          </p>
        </div>
      </footer>
    </div>
  );
}