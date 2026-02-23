"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Wand2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ONBOARDING_KEY = "ai-onboarding-completed";

const steps = [
  {
    title: "Welcome to MediaVault AI! ✨",
    description: "Discover how AI can enhance your media collection experience.",
    icon: Sparkles,
    color: "from-indigo-500 to-purple-600",
  },
  {
    title: "AI-Powered Enrichment",
    description: "When adding media, toggle 'Use AI' to automatically generate descriptions, suggest genres, and find similar items.",
    icon: Wand2,
    color: "from-purple-500 to-pink-600",
    highlight: "Look for the ✨ AI toggle when adding new media!",
  },
  {
    title: "Smart Recommendations",
    description: "Get personalized media recommendations based on your collection and preferences.",
    icon: CheckCircle2,
    color: "from-pink-500 to-rose-600",
    highlight: "AI features require an OpenAI API key in your .env file",
  },
];

export function AIOnboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_KEY);
    if (!hasCompleted) {
      // Show onboarding after a short delay
      setTimeout(() => setIsOpen(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(ONBOARDING_KEY, "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Gradient header */}
          <div className={cn(
            "relative h-32 bg-gradient-to-br",
            step.color,
            "flex items-center justify-center"
          )}>
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                <Icon className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{step.title}</h2>
              <p className="text-muted-foreground">{step.description}</p>
            </div>

            {step.highlight && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  {step.highlight}
                </p>
              </div>
            )}

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip tutorial
              </Button>
              <Button onClick={handleNext} className="gap-2">
                {currentStep < steps.length - 1 ? (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Get Started
                    <CheckCircle2 className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
