/* Portfolio clone — small progressive enhancements. No dependencies. */

/* ---------------------------------------------------------------
   Motion config. Every distance, range, easing and duration used
   by the hero, nav and ticker lives here. Values are in px / seconds
   unless noted.
   --------------------------------------------------------------- */
const MOTION = {
  columns: {
    leftX: 137,             // left column slides right, toward the avatar
    rightX: -131,           // right column slides left, mirrored
    distance: 600,          // scroll distance for the slide to finish
    opacityFrom: 0.5,
    opacityTo: 1,
    opacityDistance: 400,   // scroll distance for opacity to finish
    easePower: 3,           // cubic ease-out: fast first, flat at the end
    minWidth: 960           // below this the columns sit side by side
  },
  avatar: {
    scaleFrom: 1,
    scaleTo: 1.08,
    scaleDistance: 300,
    lift: -20,              // px; slight upward parallax
    liftDistance: 400
  },
  wordmark: {
    speed: 1                // 1 = page speed; 0.7 = slower, more depth
  },
  nav: {
    solidAt: 100,           // px; transparent below, navy at/above
    hideAt: 200,            // px; hide only when scrolling down past this
    hideY: -100             // % translateY while hidden
  },
  mobile: {
    breakpoint: 768,        // px; mirrors the 48rem block in site.css
    heroHeight: 65,         // svh; height of the blue stage
    heroMinHeight: 44,      // rem; composition floor on wide/short screens
    columns: {
      pullVw: 5,            // max inward slide per column, in vw
      minGap: 16,           // px kept between the widest left/right rows
      distance: 400,        // scroll distance for the slide to finish
      opacityFrom: 0.5,
      opacityTo: 1,
      opacityDistance: 300  // scroll distance for opacity to finish
    },
    avatar: {
      scaleTo: 1.06,        // transform-origin is bottom center on mobile
      distance: 300
    },
    wordmark: {
      speed: 0.8            // 1 = page speed; 0.8 = slight depth
    },
    nav: {
      solidAt: 80,          // px; transparent below, navy at/above
      hideAt: 160           // px; hide only when scrolling down past this
    }
  },
  ticker: {
    seconds: 30             // one full loop
  },
  projects: {
    triggerOffset: 15,      // %; start when a card top reaches 85% of the viewport
    heading: {
      distance: 24,         // px
      duration: 600,        // ms
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    },
    card: {
      distance: 60,         // px
      scale: 0.92,
      rotate: 2,            // deg
      duration: 700,        // ms
      fadeDuration: 400,    // ms
      fadeEasing: "ease-out",
      easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      stagger: 90,          // ms between cards entering in the same batch
      maxDelay: 400,        // ms cap
      headingLead: 100,     // ms; heading starts first
      hoverLift: -6,        // px
      hoverScale: 1.02,
      hoverDuration: 180,   // ms
      hoverEasing: "cubic-bezier(0.22, 1, 0.36, 1)"
    },
    text: {
      distance: 12,         // px
      start: 150,           // ms after the card begins
      step: 60,             // ms
      duration: 480,        // ms
      fadeDuration: 320     // ms
    },
    tags: {
      scale: 0.8,
      start: 420,           // ms after the card begins
      step: 40,             // ms
      duration: 420,        // ms
      fadeDuration: 280     // ms
    },
    image: {
      scale: 1.08,
      start: 700,           // ms after the card begins, once it lands
      duration: 900         // ms
    },
    childEasing: "cubic-bezier(0.22, 1, 0.36, 1)"
  }
};

(() => {
  "use strict";

  const root = document.documentElement;
  const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp01 = (value) => Math.min(1, Math.max(0, value));
  const easeOut = (p) => 1 - Math.pow(1 - p, MOTION.columns.easePower);
  const toPx = (value) => `${value.toFixed(2)}px`;

  root.style.setProperty("--ticker-duration", `${MOTION.ticker.seconds}s`);
  root.style.setProperty("--nav-hide-y", `${MOTION.nav.hideY}%`);

  const nav = document.querySelector("[data-nav]");
  const hero = document.querySelector(".hero");
  const leftCol = hero && hero.querySelector(".hero-col--left");
  const rightCol = hero && hero.querySelector(".hero-col--right");
  const avatar = hero && hero.querySelector(".avatar");
  const wordmark = hero && hero.querySelector(".wordmark");

  if (wordmark && MOTION.wordmark.speed !== 1) {
    wordmark.style.willChange = "transform";
  }

  const isReduced = () => reduceQuery.matches;
  const isWide = () => window.innerWidth >= MOTION.columns.minWidth;

  const setStyle = (el, property, value) => {
    if (el && el.style[property] !== value) el.style[property] = value;
  };

  const setData = (el, key, value) => {
    if (el && el.dataset[key] !== value) el.dataset[key] = value;
  };

  let clearedForReducedMotion = false;

  const clearHero = () => {
    setStyle(leftCol, "transform", "");
    setStyle(leftCol, "opacity", "");
    setStyle(rightCol, "transform", "");
    setStyle(rightCol, "opacity", "");
    setStyle(avatar, "transform", "");
    setStyle(wordmark, "transform", "");
    setData(nav, "hidden", "false");
    clearedForReducedMotion = true;
  };

  const renderHero = (y) => {
    if (!hero) return;

    const shiftProgress = easeOut(clamp01(y / MOTION.columns.distance));
    const fadeProgress = clamp01(y / MOTION.columns.opacityDistance);
    const shiftScale = isWide() ? 1 : 0;
    const opacity = String(
      MOTION.columns.opacityFrom +
      (MOTION.columns.opacityTo - MOTION.columns.opacityFrom) * fadeProgress
    );

    setStyle(
      leftCol,
      "transform",
      `translate3d(${toPx(MOTION.columns.leftX * shiftProgress * shiftScale)}, 0, 0)`
    );
    setStyle(leftCol, "opacity", opacity);
    setStyle(
      rightCol,
      "transform",
      `translate3d(${toPx(MOTION.columns.rightX * shiftProgress * shiftScale)}, 0, 0)`
    );
    setStyle(rightCol, "opacity", opacity);

    if (avatar) {
      const scaleProgress = clamp01(y / MOTION.avatar.scaleDistance);
      const liftProgress = clamp01(y / MOTION.avatar.liftDistance);
      const scale = MOTION.avatar.scaleFrom +
        (MOTION.avatar.scaleTo - MOTION.avatar.scaleFrom) * scaleProgress;
      const lift = MOTION.avatar.lift * liftProgress;
      setStyle(avatar, "transform", `translate3d(0, ${toPx(lift)}, 0) scale(${scale.toFixed(4)})`);
    }

    if (wordmark && MOTION.wordmark.speed !== 1) {
      // Slower than the page means a positive offset down the screen.
      const drift = y * (1 - MOTION.wordmark.speed);
      setStyle(wordmark, "transform", `translate3d(0, ${toPx(drift)}, 0)`);
    }

    clearedForReducedMotion = false;
  };

  let anchorY = window.scrollY;
  let scrollingDown = false;
  let queued = false;

  const render = () => {
    const y = window.scrollY;
    const reduced = isReduced();

    if (y > anchorY + 6) {
      anchorY = y;
      scrollingDown = true;
    } else if (y < anchorY - 6) {
      anchorY = y;
      scrollingDown = false;
    }

    if (nav) {
      setData(nav, "raised", String(y >= MOTION.nav.solidAt));

      if (reduced || y <= MOTION.nav.hideAt) {
        setData(nav, "hidden", "false");
      } else if (scrollingDown && !nav.contains(document.activeElement)) {
        setData(nav, "hidden", "true");
      } else if (!scrollingDown) {
        setData(nav, "hidden", "false");
      }
    }

    if (reduced) {
      if (!clearedForReducedMotion) clearHero();
    } else {
      renderHero(y);
    }

    queued = false;
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(render);
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  if (typeof reduceQuery.addEventListener === "function") {
    reduceQuery.addEventListener("change", schedule);
  } else if (typeof reduceQuery.addListener === "function") {
    reduceQuery.addListener(schedule);
  }

  if (nav) {
    nav.addEventListener("focusin", () => {
      nav.dataset.hidden = "false";
    });
  }

  /* ---------- project cards: pop in once, on first approach ---------- */
  const projectsSection = document.querySelector("#projects");
  const popCards = projectsSection
    ? Array.from(projectsSection.querySelectorAll("[data-pop]"))
    : [];
  const popHeading = projectsSection
    ? projectsSection.querySelector("[data-pop-heading]")
    : null;

  const revealProjects = () => {
    root.classList.remove("js-motion");
    if (popHeading) {
      popHeading.classList.add("is-visible");
      popHeading.classList.remove("is-armed");
    }
    popCards.forEach((card) => {
      card.classList.add("is-visible", "is-settled");
      card.classList.remove("is-armed");
    });
  };

  const initProjectPop = () => {
    if (!popCards.length || !root.classList.contains("js-motion")) return;

    const P = MOTION.projects;

    const cssVars = {
      "--pop-heading-y": `${P.heading.distance}px`,
      "--pop-heading-duration": `${P.heading.duration}ms`,
      "--pop-heading-ease": P.heading.easing,
      "--pop-y": `${P.card.distance}px`,
      "--pop-scale": String(P.card.scale),
      "--pop-rotate": `${P.card.rotate}deg`,
      "--pop-duration": `${P.card.duration}ms`,
      "--pop-fade-duration": `${P.card.fadeDuration}ms`,
      "--pop-fade-ease": P.card.fadeEasing,
      "--pop-ease": P.card.easing,
      "--pop-text-y": `${P.text.distance}px`,
      "--pop-text-start": `${P.text.start}ms`,
      "--pop-text-step": `${P.text.step}ms`,
      "--pop-text-duration": `${P.text.duration}ms`,
      "--pop-text-fade-duration": `${P.text.fadeDuration}ms`,
      "--pop-tag-scale": String(P.tags.scale),
      "--pop-tag-start": `${P.tags.start}ms`,
      "--pop-tag-step": `${P.tags.step}ms`,
      "--pop-tag-duration": `${P.tags.duration}ms`,
      "--pop-tag-fade-duration": `${P.tags.fadeDuration}ms`,
      "--pop-image-scale": String(P.image.scale),
      "--pop-image-start": `${P.image.start}ms`,
      "--pop-image-duration": `${P.image.duration}ms`,
      "--pop-hover-lift": `${P.card.hoverLift}px`,
      "--pop-hover-scale": String(P.card.hoverScale),
      "--pop-hover-duration": `${P.card.hoverDuration}ms`,
      "--pop-hover-ease": P.card.hoverEasing,
      "--pop-child-ease": P.childEasing
    };
    Object.entries(cssVars).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });

    popCards.forEach((card) => {
      card.querySelectorAll(".flagship-copy > *").forEach((item, index) => {
        item.style.setProperty("--i", String(index));
      });
      card.querySelectorAll(".flagship-facts > div").forEach((item, index) => {
        item.style.setProperty("--i", String(index));
      });
    });

    if (isReduced() || !("IntersectionObserver" in window)) {
      window.__projectPop = true;
      revealProjects();
      return;
    }

    const timers = new WeakMap();
    let headingTimer = 0;
    let headingStarted = false;
    let headingStartTime = 0;

    const clearCardTimers = (card) => {
      (timers.get(card) || []).forEach((id) => window.clearTimeout(id));
      timers.delete(card);
    };

    const startHeading = () => {
      if (!popHeading || headingStarted) return;
      headingStarted = true;
      headingStartTime = performance.now();
      popHeading.classList.add("is-armed", "is-visible");
      headingTimer = window.setTimeout(() => {
        popHeading.classList.remove("is-armed");
      }, P.heading.duration + 100);
    };

    const headingLead = () => {
      if (!popHeading) return 0;
      if (!headingStarted) {
        startHeading();
        return P.card.headingLead;
      }
      return Math.max(0, P.card.headingLead - (performance.now() - headingStartTime));
    };

    const scheduleSettle = (card, delay) => {
      const textCount = card.querySelectorAll(".flagship-copy > *").length;
      const tagCount = card.querySelectorAll(".flagship-facts > div").length;
      const textEnd = P.text.start +
        Math.max(0, textCount - 1) * P.text.step + P.text.duration;
      const tagEnd = P.tags.start +
        Math.max(0, tagCount - 1) * P.tags.step + P.tags.duration;
      const imageEnd = P.image.start + P.image.duration;
      const innerEnd = Math.max(P.card.duration, textEnd, tagEnd, imageEnd);

      const settleTimer = window.setTimeout(() => {
        card.classList.add("is-settled");
      }, delay + P.card.duration + 40);

      const armTimer = window.setTimeout(() => {
        card.classList.remove("is-armed");
      }, delay + innerEnd + 100);

      timers.set(card, [settleTimer, armTimer]);
    };

    const startCard = (card, delay) => {
      if (card.classList.contains("is-visible")) return;
      card.style.setProperty("--pop-delay", `${delay}ms`);
      card.classList.add("is-armed", "is-visible");
      scheduleSettle(card, delay);
    };

    const observerOptions = {
      root: null,
      rootMargin: `0px 0px -${P.triggerOffset}% 0px`,
      threshold: 0
    };

    const headingObserver = popHeading
      ? new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startHeading();
            headingObserver.disconnect();
          }
        }, observerOptions)
      : null;

    const cardObserver = new IntersectionObserver((entries) => {
      const entering = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) =>
          a.boundingClientRect.top - b.boundingClientRect.top ||
          a.boundingClientRect.left - b.boundingClientRect.left
        );

      if (!entering.length) return;

      const lead = headingLead();

      entering.forEach((entry, index) => {
        const card = entry.target;
        if (card.classList.contains("is-visible")) return;
        cardObserver.unobserve(card);

        const delay = Math.min(index * P.card.stagger, P.card.maxDelay) + lead;
        startCard(card, delay);
      });
    }, observerOptions);

    popCards.forEach((card) => {
      if (card.getBoundingClientRect().bottom < 0) {
        card.classList.add("is-visible", "is-settled");
        card.classList.remove("is-armed");
        return;
      }

      cardObserver.observe(card);

      card.addEventListener("focusin", () => {
        if (card.classList.contains("is-visible")) return;
        cardObserver.unobserve(card);
        startCard(card, headingLead());
      });
    });

    if (popHeading) {
      if (popHeading.getBoundingClientRect().bottom < 0) {
        startHeading();
      } else {
        headingObserver.observe(popHeading);
      }
    }

    if (typeof reduceQuery.addEventListener === "function") {
      reduceQuery.addEventListener("change", () => {
        if (!isReduced()) return;
        cardObserver.disconnect();
        if (headingObserver) headingObserver.disconnect();
        popCards.forEach(clearCardTimers);
        window.clearTimeout(headingTimer);
        revealProjects();
      });
    }

    window.__projectPop = true;
  };

  initProjectPop();

  render();
})();
