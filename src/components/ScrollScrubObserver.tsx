"use client";

import { useEffect } from "react";
import { useBubbleReveal } from "@/hooks/useScrollReveal";

export default function ScrollScrubObserver() {
  useBubbleReveal();

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerEl = document.querySelector("header");
      const navHeight = headerEl ? headerEl.offsetHeight : 70;
      const targetPosition = Math.max(
        0,
        targetElement.getBoundingClientRect().top + window.scrollY - navHeight
      );

      // Scroll immediately with native smooth behavior and offset
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      try {
        history.pushState(null, "", href);
      } catch {
        // fallback
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
}
