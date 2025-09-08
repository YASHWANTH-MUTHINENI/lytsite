import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  FileText, 
  Eye, 
  Download, 
  Heart, 
  Share2,
  ArrowRight,
  Zap
} from "lucide-react";

interface DemoPreviewCardProps {
  onNavigate: (page: string) => void;
}

export default function DemoPreviewCard({ onNavigate }: DemoPreviewCardProps) {
  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            See the Magic in Action
          </h2>
          <p className="text-xl text-slate-600">
            Upload any file and get a professional sharing page instantly. No design skills needed.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-2 border-slate-100 hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-0">
              {/* Demo Preview Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-50 text-red-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">Q4 Business Review 2024</h3>
                      <p className="text-sm text-slate-600">PDF Document • 2.4 MB</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                      <Eye className="w-3 h-3 mr-1" />
                      127 views
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Demo Preview Content */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* File Preview */}
                  <div>
                    <div className="aspect-[4/3] bg-slate-100 rounded-lg overflow-hidden mb-4 relative group">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
                        alt="Document preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-medium">
                          Click to view full document
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4].map((page) => (
                        <div key={page} className="w-12 h-9 bg-slate-200 rounded border"></div>
                      ))}
                      <div className="w-12 h-9 bg-slate-100 rounded border flex items-center justify-center text-xs text-slate-500">
                        +20
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">File Actions</h4>
                      <div className="space-y-2">
                        <Button className="w-full justify-start" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download (23 times)
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Link
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 border-red-200" size="sm">
                          <Heart className="w-4 h-4 mr-2" />
                          Like (8)
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                        Auto-Generated
                      </h4>
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>✓ Professional layout</p>
                        <p>✓ Download tracking</p>
                        <p>✓ Mobile optimized</p>
                        <p>✓ Shareable link</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="text-center">
                    <h4 className="font-semibold text-slate-900 mb-2">From File to Professional Site</h4>
                    <p className="text-slate-600 mb-4">
                      This entire page was generated from a simple PDF upload with just 2 inputs: title and description.
                    </p>
                    <Button 
                      onClick={() => onNavigate('universal-file-template')}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      View Full Demo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}