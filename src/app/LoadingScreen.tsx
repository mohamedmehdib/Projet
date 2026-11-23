"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LoadingScreenProps {
  assets?: string[];
}

export default function LoadingScreen({ assets }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // 1. Lock scrolling while loading screen is active
    document.body.style.overflow = "hidden";

    let isCancelled = false;
    let animationFrameId: number;

    const complete = () => {
      if (isCancelled) return;
      setProgress(100);
      document.documentElement.classList.add("page-ready");
      window.dispatchEvent(new CustomEvent("pageLoaded"));
      document.body.style.overflow = "";
      setIsFading(true);
      setTimeout(() => {
        setIsMounted(false);
      }, 450);
    };

    // Smoothly progress to 100% over ~750ms
    const startTime = performance.now();
    const duration = 750;

    const step = (now: number) => {
      if (isCancelled) return;
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      const current = Math.round(eased * 100);
      setProgress(current);

      if (ratio < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setTimeout(complete, 150);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    // Hard fallback safety: never block more than 1.5 seconds
    const safetyTimer = setTimeout(() => {
      if (isCancelled) return;
      complete();
    }, 1500);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimer);
      document.body.style.overflow = "";
    };
  }, []); // Run once on mount

  if (!isMounted) return null;

  return (
    <div
      aria-label="Chargement de UniPlan"
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary text-secondary overflow-hidden select-none transition-all duration-500 ease-out ${
        isFading
          ? "opacity-0 scale-[1.02] pointer-events-none"
          : "opacity-100 scale-100 pointer-events-auto"
      }`}
    >
      {/* Ambient aura behind logo */}
      <div className="pointer-events-none absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-accent/20 blur-3xl animate-pulse-glow" />

      {/* Centered Brand Card */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        {/* Logo */}
        <div className="relative mb-4 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 flex items-center justify-center p-3 shadow-lg">
            <Image
              src="/logo.svg"
              alt="UniPlan"
              width={48}
              height={48}
              priority
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center mb-4">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-secondary">
            Uni<span className="text-accent">Plan</span>
          </span>
          <span className="text-[11px] uppercase tracking-widest text-secondary/60 font-medium">
            Pilotage Universitaire &amp; Emplois du Temps
          </span>
        </div>

        {/* Micro Progress Bar */}
        <div className="w-36 sm:w-48 h-1 rounded-full bg-secondary/15 overflow-hidden relative">
          <div
            className="h-full bg-accent rounded-full transition-all duration-75 ease-out shadow-xs shadow-accent/40"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
