"use client";

import { useEffect } from "react";

export function HomeMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main [data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const section = entry.target as HTMLElement;
        if (!entry.isIntersecting || section.dataset.reveal !== "pending") continue;
        section.dataset.reveal = "visible";
        observer.unobserve(entry.target);
      }
    }, { rootMargin: "0px 0px -32px 0px", threshold: 0 });
    for (const section of sections) {
      // Only enhance content below the viewport; hero/restored scroll stays visible.
      if (section.getBoundingClientRect().top >= window.innerHeight) {
        section.dataset.reveal = "pending";
        observer.observe(section);
      }
    }
    function focusIn(event: FocusEvent) {
      const section = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-reveal]") : null;
      if (section) {
        // Clear the animation permanently so leaving focus cannot restart it.
        section.dataset.reveal = "";
        observer.unobserve(section);
      }
    }
    function revealAll() {
      observer.disconnect();
      for (const section of sections) section.dataset.reveal = "";
    }
    document.addEventListener("focusin", focusIn);
    preference.addEventListener("change", revealAll);
    return () => {
      revealAll();
      document.removeEventListener("focusin", focusIn);
      preference.removeEventListener("change", revealAll);
    };
  }, []);
  return null;
}
