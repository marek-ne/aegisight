import React, { useState, useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';
import { Visualizer } from './components/Visualizer';
import { StageText } from './components/StageText';
import { STORY_CONTENT } from './data';
import { StageId } from './types';
import { ChevronDown } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<StageId>(StageId.Ingestion);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress relative to the container for scrubbing animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const centerLine = viewportHeight / 2;

      let closestStage = StageId.Ingestion;
      let minDistance = Infinity;

      stageRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        // Calculate the center of the element
        const elementCenter = rect.top + rect.height / 2;
        // Distance from viewport center
        const distance = Math.abs(centerLine - elementCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestStage = index;
        }
      });

      setCurrentStage(closestStage);
    };

    // Initial check
    handleScroll();

    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="aegisight-app-container w-full relative text-slate-200 selection:bg-cyan-900 selection:text-white">

      {/* Header / Intro */}
      {/* Header Removed for Integration */}

      {/* Main Scrollytelling Layout */}
      <div ref={containerRef} className="relative w-full max-w-7xl mx-auto md:grid md:grid-cols-2 items-start">

        {/* Left Column: Sticky Visuals */}
        <div className="hidden md:flex sticky top-24 h-[90vh] max-h-screen items-center justify-center p-8 lg:p-12 overflow-visible">
          <div className="w-full aspect-square max-w-[600px]">
            <Visualizer currentStage={currentStage} scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Mobile Visuals (Fixed top, smaller) */}
        <div className="md:hidden sticky top-0 z-40 bg-[#050505]/95 backdrop-blur-md pt-20 pb-4 px-4 border-b border-slate-900">
          <div className="w-full aspect-video">
            <Visualizer currentStage={currentStage} scrollYProgress={scrollYProgress} />
          </div>
        </div>

        {/* Right Column: Scrolling Text */}
        <div className="relative z-30 flex flex-col">
          <div className="h-[20vh] flex items-end px-8 pb-12 md:hidden">
            <p className="text-xs text-slate-500 uppercase tracking-widest animate-bounce flex items-center gap-2">
              Scroll to Explore <ChevronDown size={14} />
            </p>
          </div>

          {STORY_CONTENT.map((block, index) => (
            <StageText
              key={block.id}
              content={block}
              isActive={currentStage === block.id}
              ref={(el) => { stageRefs.current[index] = el; }}
            />
          ))}

          <div className="h-[50vh] flex items-center justify-center text-slate-600">
            <p className="text-sm font-mono">END_OF_SPECIFICATION</p>
          </div>
        </div>
      </div>
    </div>
  );
}