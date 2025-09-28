import { useEffect, useRef } from 'react';

// Hook personalizat pentru GSAP
export const useGSAP = (callback, dependencies = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (window.gsap && elementRef.current) {
      callback(elementRef.current);
    }
  }, dependencies);

  return elementRef;
};

// Hook pentru ScrollTrigger
export const useScrollTrigger = (callback, dependencies = []) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (window.gsap && window.ScrollTrigger && elementRef.current) {
      // Register ScrollTrigger plugin
      window.gsap.registerPlugin(window.ScrollTrigger);
      callback(elementRef.current);
    }
  }, dependencies);

  return elementRef;
};

// Hook pentru animații de text
export const useTextAnimation = (text, options = {}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    if (window.gsap && window.TextPlugin && elementRef.current) {
      window.gsap.registerPlugin(window.TextPlugin);
      
      const defaultOptions = {
        duration: 2,
        ease: "power2.out",
        ...options
      };

      window.gsap.to(elementRef.current, {
        text: text,
        ...defaultOptions
      });
    }
  }, [text, options]);

  return elementRef;
};

// Funcții utilitare GSAP
export const gsapUtils = {
  // Animație de fade in
  fadeIn: (element, duration = 1, delay = 0) => {
    if (window.gsap) {
      window.gsap.fromTo(element, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration, delay, ease: "power2.out" }
      );
    }
  },

  // Animație de slide in
  slideIn: (element, direction = "left", duration = 1, delay = 0) => {
    if (window.gsap) {
      const x = direction === "left" ? -100 : direction === "right" ? 100 : 0;
      const y = direction === "up" ? -100 : direction === "down" ? 100 : 0;
      
      window.gsap.fromTo(element,
        { x, y, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration, delay, ease: "power2.out" }
      );
    }
  },

  // Animație de scale
  scaleIn: (element, duration = 1, delay = 0) => {
    if (window.gsap) {
      window.gsap.fromTo(element,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration, delay, ease: "back.out(1.7)" }
      );
    }
  },

  // Animație de hover
  hoverEffect: (element, scale = 1.05, duration = 0.3) => {
    if (window.gsap) {
      element.addEventListener('mouseenter', () => {
        window.gsap.to(element, { scale, duration, ease: "power2.out" });
      });
      
      element.addEventListener('mouseleave', () => {
        window.gsap.to(element, { scale: 1, duration, ease: "power2.out" });
      });
    }
  },

  // Animație de stagger pentru liste
  staggerIn: (elements, duration = 0.5, stagger = 0.1) => {
    if (window.gsap) {
      window.gsap.fromTo(elements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration, stagger, ease: "power2.out" }
      );
    }
  }
};

