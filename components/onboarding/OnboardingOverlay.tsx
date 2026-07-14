"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/common/Logo";
import { Star, MoreVertical, Sparkles, ArrowRight, ChevronUp, X } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Bookmark Second Brain",
    subtitle: "Quick access, always.",
    description: "Press ⌘+D (Mac) or Ctrl+D (Windows) to bookmark this page so you can get back here instantly.",
    icon: Star,
    arrowDirection: "up" as const,
  },
  {
    id: 2,
    title: "Install as an App",
    subtitle: "A native experience.",
    description: "Click the ⋮ menu in your browser's top-right corner, then select \"Install Second Brain\" or \"Create Shortcut\" for an app-like experience.",
    icon: MoreVertical,
    arrowDirection: "up-right" as const,
  },
  {
    id: 3,
    title: "More Features Coming",
    subtitle: "This is just the beginning.",
    description: "We're actively building new features — bookmark us so you never miss an update. Welcome aboard!",
    icon: Sparkles,
    arrowDirection: null,
  },
];

export function OnboardingOverlay({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  function handleNext() {
    if (isLast) {
      onComplete();
    } else {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleSkip() {
    onComplete();
  }

  // Slide animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/95 backdrop-blur-xl"
    >
      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-gray-500 hover:text-gray-300 transition-colors text-sm flex items-center gap-1.5 z-10"
      >
        Skip <X size={14} />
      </button>

      {/* Animated arrow pointing to browser UI */}
      <AnimatePresence mode="wait">
        {step.arrowDirection === "up" && (
          <motion.div
            key="arrow-up"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 right-[45%]"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronUp size={32} className="text-blue-400" />
              <ChevronUp size={32} className="text-blue-400/50 -mt-5" />
            </motion.div>
          </motion.div>
        )}
        {step.arrowDirection === "up-right" && (
          <motion.div
            key="arrow-up-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-8 right-12"
          >
            <motion.div
              animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center"
            >
              <ChevronUp size={32} className="text-blue-400 rotate-[30deg]" />
              <ChevronUp size={32} className="text-blue-400/50 -mt-5 rotate-[30deg]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content card */}
      <div className="relative w-full max-w-md mx-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-center text-center px-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: "backOut" }}
              className="relative mb-8"
            >
              {/* Glow */}
              <div className="absolute inset-0 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 bg-gray-900 border border-gray-700/50 rounded-2xl flex items-center justify-center">
                {isLast ? (
                  <div className="relative">
                    <Logo className="w-8 h-8 text-white" />
                    {/* Sparkle particles */}
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 1, 0],
                          x: [0, (i % 2 === 0 ? 1 : -1) * (16 + i * 6)],
                          y: [0, (i < 2 ? -1 : 1) * (16 + i * 4)],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          delay: i * 0.4,
                          ease: "easeOut",
                        }}
                        className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                      />
                    ))}
                  </div>
                ) : (
                  <Icon size={28} className="text-white" strokeWidth={1.5} />
                )}
              </div>
            </motion.div>

            {/* Step indicator */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[11px] font-bold uppercase tracking-[0.25em] text-blue-400 mb-3"
            >
              Step {step.id} of {steps.length}
            </motion.p>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="text-2xl sm:text-3xl font-bold text-white mb-2"
            >
              {step.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="text-sm text-gray-400 mb-6"
            >
              {step.subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[15px] leading-relaxed text-gray-300 max-w-sm"
            >
              {step.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-5 mt-12"
        >
          {/* Progress dots */}
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-blue-500"
                    : i < currentStep
                    ? "w-1.5 bg-blue-500/50"
                    : "w-1.5 bg-gray-700"
                }`}
              />
            ))}
          </div>

          {/* Next / Get Started button */}
          <button
            onClick={handleNext}
            className="group flex items-center gap-2.5 px-8 py-3.5 bg-white text-gray-900 font-semibold text-sm rounded-xl hover:bg-gray-100 transition-colors"
          >
            {isLast ? "Get Started" : "Next"}
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
