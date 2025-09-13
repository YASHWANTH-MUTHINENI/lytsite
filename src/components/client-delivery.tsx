import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Download, FileText, Image, Video, Archive, Eye, ArrowLeft } from "lucide-react";

// Interface for Client Delivery specific data
interface ClientDeliveryData {
  projectName: string;
  clientName: string;
  deliveryDate: string;
  status: string;
  description: string;
  files: Array<{
    id?: number;
    name: string;
    type: string;
    size: string;
    preview?: boolean;
    thumbnail?: string;
    url?: string;
    uploadedAt?: string;
    uploadedBy?: string;
    description?: string;
  }>;
  contactInfo: {
    email: string;
    website?: string;
    phone?: string;
  };
}

interface ClientDeliveryProps {
  data?: ClientDeliveryData; // Optional - falls back to mockData if not provided
}

// Mock data for testing - matches the new interface
const mockData: ClientDeliveryData = {
  projectName: "Brand Redesign 2025",
  clientName: "TechCorp Inc.",
  deliveryDate: "January 15, 2025",
  status: "Ready for Download",
  description: "Sarah Design Studio has shared 6 files with you. Download individual files or get everything at once.",
  files: [
  {
    id: 1,
    name: "Project_Presentation.pdf",
    type: "pdf",
    size: "2.4 MB",
    preview: true,
    thumbnail: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMGRlc2lnbnxlbnwxfHx8fDE3NTcyMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    name: "Final_Logo_Files.zip",
    type: "archive",
    size: "15.8 MB",
    preview: false
  },
  {
    id: 3,
    name: "Brand_Guidelines.pdf",
    type: "pdf",
    size: "4.2 MB",
    preview: true,
    thumbnail: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMGRlc2lnbnxlbnwxfHx8fDE3NTcyMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    name: "Mockup_Designs.png",
    type: "image",
    size: "8.1 MB",
    preview: true,
    thumbnail: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMGRlc2lnbnxlbnwxfHx8fDE3NTcyMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 5,
    name: "Walkthrough_Video.mp4",
    type: "video",
    size: "45.2 MB",
    preview: true,
    thumbnail: "https://images.unsplash.com/photo-1710799885122-428e63eff691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHBvcnRmb2xpbyUyMGRlc2lnbnxlbnwxfHx8fDE3NTcyMzI4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 6,
    name: "Source_Files.zip",
    type: "archive",
    size: "128.5 MB",
    preview: false
  }
  ],
  contactInfo: {
    email: "sarah@designstudio.com",
    phone: "+1 (555) 123-4567",
    website: "https://sarahdesignstudio.com"
  }
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'image':
      return <Image className="w-5 h-5 text-green-500" />;
    case 'video':
      return <Video className="w-5 h-5 text-blue-500" />;
    case 'archive':
      return <Archive className="w-5 h-5 text-yellow-500" />;
    default:
      return <FileText className="w-5 h-5 text-slate-500" />;
  }
};

export default function ClientDelivery({ data }: ClientDeliveryProps) {
  const navigate = useNavigate();
  
  // Use provided data or fall back to mockData for testing
  const deliveryData = data || mockData;
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
              <h1 className="text-lg font-semibold text-slate-900">Project Delivery</h1>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              {deliveryData.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Your files are ready
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            {deliveryData.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download All ({deliveryData.files.reduce((total, file) => total + parseFloat(file.size.replace(' MB', '')), 0).toFixed(1)} MB)
            </Button>
            <Button variant="outline" size="lg">
              <Eye className="w-4 h-4 mr-2" />
              Preview Files
            </Button>
          </div>
        </div>

        {/* File Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deliveryData.files.map((file, index) => (
              <Card key={file.id || index} className="overflow-hidden hover:shadow-md transition-shadow">
                {file.preview && file.thumbnail ? (
                  <div className="aspect-video relative group">
                    <ImageWithFallback
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                    {file.type === 'video' && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Video className="w-6 h-6 text-slate-800 ml-0.5" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                        {getFileIcon(file.type)}
                      </div>
                      <p className="text-sm text-slate-500 font-medium">
                        {file.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-slate-900 truncate" title={file.name}>
                        {file.name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getFileIcon(file.type)}
                        <span className="text-sm text-slate-500">{file.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {file.preview && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      className={`bg-primary hover:bg-primary/90 text-white ${file.preview ? 'flex-1' : 'w-full'}`}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Details */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Project Name:</span>
                      <span className="text-slate-900 font-medium">{deliveryData.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Client:</span>
                      <span className="text-slate-900 font-medium">{deliveryData.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Delivery Date:</span>
                      <span className="text-slate-900 font-medium">{deliveryData.deliveryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Files:</span>
                      <span className="text-slate-900 font-medium">
                        {deliveryData.files.length} files ({deliveryData.files.reduce((total, file) => total + parseFloat(file.size.replace(' MB', '')), 0).toFixed(1)} MB)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    If you have any questions about these files or need assistance, 
                    don't hesitate to reach out.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      📧 {deliveryData.contactInfo.email}
                    </Button>
                    {deliveryData.contactInfo.phone && (
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        📱 {deliveryData.contactInfo.phone}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Sent with{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Lytsite
            </span>
            {" "}• Secure file delivery made beautiful
          </p>
        </div>
      </footer>
    </div>
  );
}