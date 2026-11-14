import { useEffect } from "react";

/** Progressive enhancement: content is visible if motion/observers are unavailable. */
export function usePublicMotion(route: string) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      "#main-content.public-site",
    );
    if (!root || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let targets: HTMLElement[] = [];
    const clear = () => {
      observer?.disconnect();
      root.classList.remove("ea-motion-ready");
      targets.forEach((element) => {
        element.removeAttribute("data-reveal");
        element.classList.remove("ea-in-view", "ea-keyboard-visible");
        element.style.removeProperty("--reveal-delay");
      });
    };
    const setup = () => {
      clear();
      if (preference.matches) return;
      targets = Array.from(
        root.querySelectorAll<HTMLElement>(
          ".ea-cinematic-copy, .ea-cinematic-details > p, .ea-approved-copy, .ea-moment-photo, .ea-moment-copy, .ea-page-heading, .ea-editorial-tile, .ea-story-copy, .ea-story-photo, .ea-sport-copy, .ea-belief-tile, .ea-sport-photo, .ea-outside-note, .ea-section-heading, .ea-photo-path, .ea-results-grid > div, .ea-together-photo, .ea-together-copy, .ea-working-steps li, .ea-energy-heading, .ea-energy-photo, .ea-voices-grid > div, .ea-insight-card, .ea-editorial-link, .ea-program, .ea-process > div, .ea-page-hero-grid > *, .ea-cta-inner > *",
        ),
      );
      targets.forEach((element) => {
        element.dataset.reveal = "";
        const siblings = Array.from(element.parentElement?.children ?? []);
        element.style.setProperty(
          "--reveal-delay",
          `${Math.min(siblings.indexOf(element), 3) * 85}ms`,
        );
        // Never hide content that is already on screen, including deep-link landings.
        if (element.getBoundingClientRect().top < window.innerHeight)
          element.classList.add("ea-in-view");
      });
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting, target }) => {
            if (isIntersecting) {
              target.classList.add("ea-in-view");
              observer?.unobserve(target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
      );
      targets.forEach((element) => observer?.observe(element));
      root.classList.add("ea-motion-ready");
    };
    // Keyboard navigation must not land on an invisible control.
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.matches(":focus-visible")) return;
      let element = event.target.closest<HTMLElement>("[data-reveal]");
      while (element) {
        element.classList.add("ea-in-view", "ea-keyboard-visible");
        element =
          element.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
      }
    };
    setup();
    root.addEventListener("focusin", revealFocused);
    preference.addEventListener("change", setup);
    return () => {
      clear();
      root.removeEventListener("focusin", revealFocused);
      preference.removeEventListener("change", setup);
    };
  }, [route]);
}
