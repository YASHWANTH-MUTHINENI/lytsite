import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Download, ArrowLeft, X, ChevronLeft, ChevronRight, QrCode, Share2, Heart } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";



const mockPhotos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3MjQxMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding couple portrait",
    featured: true,
    category: "Portraits"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1677677402907-05f2883e3f66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBvdXRkb29yfGVufDF8fHx8MTc1NzE3ODU0Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding ceremony outdoor",
    featured: false,
    category: "Ceremony"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1549620936-aa6278062ba5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwcGFydHl8ZW58MXx8fHwxNzU3MjQxMjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding reception party",
    featured: false,
    category: "Reception"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1664312696723-173130983e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGJvdXF1ZXR8ZW58MXx8fHwxNzU3MTk2OTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding flowers bouquet",
    featured: false,
    category: "Details"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1631225866082-8150132a7473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBkZXRhaWx8ZW58MXx8fHwxNzU3MjQxMjYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding rings detail",
    featured: false,
    category: "Details"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1584158531319-96912adae663?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnR8ZW58MXx8fHwxNzU3MTYyNzg4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding cake elegant",
    featured: false,
    category: "Reception"
  },
  // Duplicate some photos to create a larger gallery
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1651924492297-4b4bd30fcab3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBnYWxsZXJ5fGVufDF8fHx8MTc1NzI0MTE2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding photography",
    featured: false,
    category: "Portraits"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1730476513367-16fe58a8a653?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY291cGxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3MjQxMjUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    alt: "Wedding couple",
    featured: false,
    category: "Portraits"
  }
];

export default function PhotoGallery() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (imageId: number) => {
    const index = mockPhotos.findIndex(photo => photo.id === imageId);
    setCurrentImageIndex(index);
    setSelectedImage(imageId);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentImageIndex - 1 + mockPhotos.length) % mockPhotos.length
      : (currentImageIndex + 1) % mockPhotos.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(mockPhotos[newIndex].id);
  };

  const featuredPhoto = mockPhotos.find(photo => photo.featured);

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
              <h1 className="text-lg font-semibold text-slate-900">Photo Gallery</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                142 Photos
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
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Emma & James Wedding
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Captured by Olivia Chen Photography • September 7, 2025 • Napa Valley
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Download className="w-4 h-4 mr-2" />
              Download All Photos
            </Button>
            <Button variant="outline" size="lg">
              <Heart className="w-4 h-4 mr-2" />
              Add to Favorites
            </Button>
          </div>
        </div>

        {/* Featured Photo */}
        {featuredPhoto && (
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Featured</h2>
            <Card className="overflow-hidden">
              <div 
                className="aspect-video cursor-pointer group relative"
                onClick={() => openLightbox(featuredPhoto.id)}
              >
                <ImageWithFallback
                  src={featuredPhoto.src}
                  alt={featuredPhoto.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 text-slate-800">Featured</Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Photo Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-slate-900">All Photos</h2>
            <div className="flex space-x-2">
              {['All', 'Portraits', 'Ceremony', 'Reception', 'Details'].map((category) => (
                <Button 
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'} 
                  size="sm"
                  className={category === 'All' ? 'bg-primary hover:bg-primary/90 text-white' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Masonry Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4">
            {mockPhotos.filter(photo => !photo.featured).map((photo, index) => (
              <div 
                key={photo.id} 
                className="break-inside-avoid mb-4 cursor-pointer group"
                onClick={() => openLightbox(photo.id)}
              >
                <div className="relative rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Share This Gallery</h3>
                  <p className="text-slate-600 mb-6">
                    Share this beautiful collection with friends and family. 
                    They can view and download photos directly.
                  </p>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      📱 Copy Link
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      📧 Email Gallery
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      💬 Share on Social
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg border-2 border-slate-200">
                    <div className="w-32 h-32 bg-slate-100 flex items-center justify-center rounded">
                      <QrCode className="w-16 h-16 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-3">
                    Scan to view gallery on mobile
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-6xl w-full h-full max-h-[90vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {selectedImage && (
              <>
                <ImageWithFallback
                  src={mockPhotos[currentImageIndex].src}
                  alt={mockPhotos[currentImageIndex].alt}
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Navigation */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage('prev')}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigateImage('next')}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
                
                {/* Close */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                {/* Info */}
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <p className="text-white text-sm">
                    {currentImageIndex + 1} of {mockPhotos.length}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="mt-20 py-8 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-500">
            Powered by{" "}
            <span 
              className="text-primary font-medium cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Lytsite
            </span>
            {" "}• Beautiful galleries made simple
          </p>
        </div>
      </footer>
    </div>
  );
}