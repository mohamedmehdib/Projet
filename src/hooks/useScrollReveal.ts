"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight scroll-reveal hook using IntersectionObserver.
 * Adds the `.is-visible` class when the container element enters the viewport.
 *
 * @param threshold - Visibility threshold (0–1). Default 0.15.
 * @param rootMargin - Observer root margin. Default "0px 0px -40px 0px".
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  rootMargin = "0px 0px -40px 0px"
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | null = null;

    const setupObserver = () => {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer?.unobserve(el);
          }
        },
        { threshold, rootMargin }
      );
      observer.observe(el);
    };

    setupObserver();
    return () => observer?.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Hook variant that observes multiple children of a container.
 * Each child with `.scroll-reveal` gets `.is-visible` when it enters viewport.
 */
export function useScrollRevealChildren<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.1,
  rootMargin = "0px 0px -30px 0px"
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return ref;
}

/**
 * Ultra-Smooth Bidirectional Repeating Bubble Scroll Reveal Hook (moussaed.tn logic).
 * - Animates from bottom when scrolling down with spring scale(0.95) -> scale(1).
 * - Animates from top when scrolling up.
 * - Repeats EVERY time elements scroll into/out of view.
 * - Uses GPU-accelerated CSS transitions with organic cubic-bezier.
 * - Automatic sibling staggering for grid items.
 */
export function useBubbleReveal() {
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let scrollDirection: "down" | "up" = "down";

    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastScrollY;
      if (Math.abs(diff) >= 2) {
        scrollDirection = diff > 0 ? "down" : "up";
        lastScrollY = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const setupObserver = () => {
      const elements = document.querySelectorAll<HTMLElement>(".scroll-scrub");
      if (!elements.length) return;

      const parentCountMap = new Map<HTMLElement, number>();

      elements.forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";

        const parent = el.parentElement;
        if (parent) {
          const currentCount = parentCountMap.get(parent) || 0;
          const delayMs = currentCount * 70;
          el.dataset.staggerDelay = `${delayMs}ms`;
          el.style.transitionDelay = `${delayMs}ms`;
          parentCountMap.set(parent, currentCount + 1);
        }
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target as HTMLElement;
            const rect = entry.boundingClientRect;
            const vh = window.innerHeight;

            if (entry.isIntersecting) {
              // Entering viewport!
              el.removeAttribute("data-bubble-reset");

              if (scrollDirection === "up" || rect.bottom <= vh * 0.45) {
                el.setAttribute("data-bubble-from", "top");
              } else {
                el.setAttribute("data-bubble-from", "bottom");
              }

              el.setAttribute("data-bubble", "visible");
              el.classList.add("is-visible");
              el.classList.add("in-view");

              // Clear inline transitionDelay once revealed so future transitions aren't delayed
              setTimeout(() => {
                el.style.transitionDelay = "";
              }, 600);
            } else {
              // Exiting viewport! Resets every time it scrolls out so it re-animates every time!
              const isAbove = rect.bottom <= 0;
              const isBelow = rect.top >= vh;

              if (isAbove || isBelow) {
                el.setAttribute("data-bubble-reset", "true");
                el.removeAttribute("data-bubble");
                el.classList.remove("is-visible");
                el.classList.remove("in-view");

                if (isAbove) {
                  el.setAttribute("data-bubble-from", "top");
                } else {
                  el.setAttribute("data-bubble-from", "bottom");
                }

                requestAnimationFrame(() => {
                  el.removeAttribute("data-bubble-reset");
                  if (el.dataset.staggerDelay) {
                    el.style.transitionDelay = el.dataset.staggerDelay;
                  }
                });
              }
            }
          });
        },
        {
          threshold: 0,
          rootMargin: "60px 0px 60px 0px",
        }
      );

      elements.forEach((el) => observer?.observe(el));
    };

    if (typeof document !== "undefined" && !document.documentElement.classList.contains("page-ready")) {
      const handlePageLoaded = () => {
        setupObserver();
        window.removeEventListener("pageLoaded", handlePageLoaded);
      };
      window.addEventListener("pageLoaded", handlePageLoaded);
      const timer = setTimeout(handlePageLoaded, 1000);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("pageLoaded", handlePageLoaded);
        clearTimeout(timer);
        observer?.disconnect();
      };
    } else {
      setupObserver();
      return () => {
        window.removeEventListener("scroll", onScroll);
        observer?.disconnect();
      };
    }
  }, []);
}

// Backward compatibility export
export const useScrollLinkedReveal = useBubbleReveal;
