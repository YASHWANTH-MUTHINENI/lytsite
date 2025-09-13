import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Download
} from "lucide-react";



const productImages = [
  "https://images.unsplash.com/photo-1664262283644-bfbc54a88c90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwc2hvd2Nhc2UlMjBkaXNwbGF5fGVufDF8fHx8MTc1NzI0NDg3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1621111848501-8d3634f82336?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHdvcmtzcGFjZSUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NzE2NDc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1730794545099-14902983739d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzU3MTI4MjgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
];

const features = [
  {
    title: "Premium Materials",
    description: "Crafted from high-quality, sustainable materials that last.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    title: "Modern Design",
    description: "Sleek, contemporary aesthetics that fit any environment.",
    icon: <Star className="w-5 h-5" />
  },
  {
    title: "Easy Setup",
    description: "Quick and simple assembly with included instructions.",
    icon: <RotateCcw className="w-5 h-5" />
  },
  {
    title: "Free Shipping",
    description: "Complimentary delivery on all orders over $99.",
    icon: <Truck className="w-5 h-5" />
  }
];

const reviews = [
  {
    name: "Sarah Johnson",
    rating: 5,
    comment: "Absolutely love this product! The quality exceeded my expectations and it looks perfect in my office.",
    verified: true
  },
  {
    name: "Michael Chen",
    rating: 5,
    comment: "Great design and build quality. Assembly was straightforward and the materials feel premium.",
    verified: true
  },
  {
    name: "Emma Rodriguez",
    rating: 4,
    comment: "Beautiful product with excellent attention to detail. Shipping was fast and packaging was secure.",
    verified: true
  }
];

const specifications = [
  { label: "Dimensions", value: "24\" × 18\" × 6\"" },
  { label: "Weight", value: "12 lbs" },
  { label: "Material", value: "Aluminum & Wood" },
  { label: "Color Options", value: "Black, White, Natural" },
  { label: "Warranty", value: "2 Years" },
  { label: "Assembly Time", value: "15 minutes" }
];

export default function ProductTemplate() {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("Black");

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

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
              <h1 className="text-lg font-semibold text-slate-900">Product</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                In Stock
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
          {/* Product Overview */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4 group">
                <ImageWithFallback
                  src={productImages[currentImageIndex]}
                  alt="Premium Design Collection"
                  className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex space-x-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      currentImageIndex === index ? 'border-primary' : 'border-slate-200'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-4">
                <Badge variant="outline" className="mb-2">Premium Collection</Badge>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Modern Design Workspace</h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-slate-600">(127 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="text-3xl font-bold text-slate-900">$299</span>
                  <span className="text-xl text-slate-500 line-through">$399</span>
                  <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">25% OFF</Badge>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Transform your workspace with this beautifully crafted design piece. 
                  Made from premium materials and designed for modern professionals who 
                  value both form and function.
                </p>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Color</h3>
                <div className="flex space-x-3">
                  {['Black', 'White', 'Natural'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedColor === color 
                          ? 'border-primary bg-primary text-white' 
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-8">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart - $299
                </Button>
                <div className="flex space-x-4">
                  <Button variant="outline" size="lg" className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save for Later
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View in AR
                  </Button>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <Truck className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-slate-900">Free Shipping</div>
                  <div className="text-xs text-slate-600">Orders over $99</div>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-slate-900">30-Day Returns</div>
                  <div className="text-xs text-slate-600">No questions asked</div>
                </div>
                <div className="text-center">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium text-slate-900">2-Year Warranty</div>
                  <div className="text-xs text-slate-600">Quality guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Why You'll Love It</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h3>
                <div className="space-y-4">
                  {specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-b-0">
                      <span className="text-slate-600">{spec.label}</span>
                      <span className="font-medium text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    1x Modern Design Workspace Unit
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Assembly Hardware & Tools
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Quick Setup Guide
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    2-Year Warranty Card
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                    Care & Maintenance Instructions
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Reviews */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Customer Reviews</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-lg font-semibold text-slate-900">4.8 out of 5</span>
                <span className="text-slate-600">(127 reviews)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">Verified</Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-4">"{review.comment}"</p>
                    <div className="font-medium text-slate-900">{review.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Space?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who've upgraded their workspace with our premium design collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-slate-50">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart - $299
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Download className="w-4 h-4 mr-2" />
                Download Catalog
              </Button>
            </div>
          </div>
        </div>
      </div>

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
            {" "}• Beautiful product showcases made simple
          </p>
        </div>
      </footer>
    </div>
  );
}