import { useEffect, useRef } from 'react';

export function useScrollReveal(options = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-fadeup');
          entry.target.style.opacity = 1;
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => {
      el.style.opacity = 0; // hide initially
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return ref;
}
