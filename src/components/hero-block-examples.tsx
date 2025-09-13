import React, { useState } from "react";
import { EnhancedThemeProvider } from "../contexts/EnhancedThemeContext";
import HeroBlock from "./blocks/HeroBlock";
import EnhancedThemeSwitcher from "./ui/EnhancedThemeSwitcher";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Universal 3-Input Hero Block Examples
const examples = [
  {
    id: "portfolio",
    category: "Portfolio Share",
    title: "UX Case Study – Travel App",
    subLine: "Prepared for Acme Agency", 
    tagLine: "From Yashwanth Varma",
    heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop"
  },
  {
    id: "event",
    category: "Event Flyer", 
    title: "Tech Meetup 2025",
    subLine: "Hyderabad | Sept 15",
    tagLine: "Organized by CloudDev Community",
    heroImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop"
  },
  {
    id: "client",
    category: "Client Handoff",
    title: "Landing Page Draft v2", 
    subLine: "For Sarah @Brandly",
    tagLine: "Ready for review & feedback",
    heroImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop"
  },
  {
    id: "presentation",
    category: "Business Presentation",
    title: "Q4 Results & Strategy",
    subLine: "Board Meeting | December 2024", 
    tagLine: "Confidential • Executive Summary",
    heroImage: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop"
  },
  {
    id: "personal",
    category: "Personal Share",
    title: "Wedding Photos 2024",
    subLine: "Sarah & Mike | June 15th",
    tagLine: "Private gallery for family & friends",
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=800&fit=crop"
  },
  {
    id: "project",
    category: "Project Delivery",
    title: "Website Redesign Complete",
    subLine: "Version 3.0 | Final Delivery",
    tagLine: "Client: TechStart Inc. | Project #2024-15",
    heroImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop"
  },
  {
    id: "education",
    category: "Educational Content",
    title: "JavaScript Masterclass",
    subLine: "Course Materials | Week 5-8",
    tagLine: "Advanced concepts & practical projects",
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=800&fit=crop"
  },
  {
    id: "creative",
    category: "Creative Work",
    title: "Brand Identity Package", 
    subLine: "For GreenTech Startup",
    tagLine: "Logo, Guidelines & Asset Library",
    heroImage: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&h=800&fit=crop"
  }
];

export default function HeroBlockExamples() {
  const [currentExample, setCurrentExample] = useState(0);

  const nextExample = () => {
    setCurrentExample((prev) => (prev + 1) % examples.length);
  };

  const prevExample = () => {
    setCurrentExample((prev) => (prev - 1 + examples.length) % examples.length);
  };

  const current = examples[currentExample];

  return (
    <EnhancedThemeProvider defaultThemeKey="professional-light">
      <div className="min-h-screen">
        {/* Theme Switcher */}
        <div className="fixed top-4 right-4 z-50">
          <EnhancedThemeSwitcher variant="minimal" showLabel={false} />
        </div>

        {/* Navigation Controls */}
        <div className="fixed top-4 left-4 z-50 flex items-center space-x-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevExample}
              className="w-10 h-10 p-0 rounded-xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-white/90">
                {current.category}
              </div>
              <div className="text-xs text-white/60">
                {currentExample + 1} of {examples.length}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextExample}
              className="w-10 h-10 p-0 rounded-xl"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Hero Block Example */}
        <HeroBlock
          title={current.title}
          subLine={current.subLine}
          tagLine={current.tagLine}
        />

        {/* Example Information */}
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Universal 3-Input Hero Block
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed">
              The same flexible hero block adapts to any use case with just three universal inputs:
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  🔑 Input 1: Title/Headline
                </h3>
                <p className="text-blue-700 text-sm">
                  Free text - what it is
                </p>
                <div className="mt-3 p-3 rounded-lg bg-white border border-blue-200">
                  <code className="text-sm">{current.title}</code>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-green-50 border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">
                  🏷️ Input 2: Sub-line/Context
                </h3>
                <p className="text-green-700 text-sm">
                  Could be "From", "To", "For Event", "Version", etc.
                </p>
                <div className="mt-3 p-3 rounded-lg bg-white border border-green-200">
                  <code className="text-sm">{current.subLine}</code>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">
                  💬 Input 3: Tagline/Note
                </h3>
                <p className="text-purple-700 text-sm">
                  Personal note, callout, or custom field
                </p>
                <div className="mt-3 p-3 rounded-lg bg-white border border-purple-200">
                  <code className="text-sm">{current.tagLine}</code>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 mb-4">
                Use the navigation arrows in the top-left to see different examples
              </p>
              <div className="flex justify-center space-x-2">
                {examples.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentExample(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentExample ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EnhancedThemeProvider>
  );
}
