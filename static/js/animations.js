(function () {
    function clearPaintLock() {
        if (window.__pgGsapPaintTimer) {
            window.clearTimeout(window.__pgGsapPaintTimer);
            window.__pgGsapPaintTimer = null;
        }

        document.documentElement.classList.remove("gsap-pending");
    }

    const hasCore = Boolean(window.gsap && window.ScrollTrigger && window.ScrollToPlugin);
    if (!hasCore) {
        clearPaintLock();
        return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const ScrollToPlugin = window.ScrollToPlugin;
    const ScrollSmoother = window.ScrollSmoother;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    if (ScrollSmoother) {
        gsap.registerPlugin(ScrollSmoother);
    }

    ScrollTrigger.config({
        ignoreMobileResize: true,
    });

    let smootherInstance = null;

    function toArray(targets) {
        return gsap.utils.toArray(targets).filter(Boolean);
    }

    function setInitial(targets, vars) {
        const elements = toArray(targets);
        if (!elements.length) {
            return [];
        }

        gsap.set(elements, vars);
        return elements;
    }

    function revealOnScroll(targets, options = {}) {
        const elements = toArray(targets);
        if (!elements.length) {
            return;
        }

        const {
            y = 22,
            duration = 0.75,
            ease = "power3.out",
            start = "top 84%",
            staggerStep = 0.08,
        } = options;

        elements.forEach((element, index) => {
            gsap.fromTo(
                element,
                { autoAlpha: 0, y },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration,
                    ease,
                    delay: Math.min(index * staggerStep, staggerStep * 4),
                    clearProps: "opacity,transform,visibility",
                    scrollTrigger: {
                        trigger: element,
                        start,
                        once: true,
                    },
                }
            );
        });
    }

    window.PrismaGuardMotion = {
        gsap,
        ScrollTrigger,
        smoother: () => smootherInstance,
        clearPaintLock,
        setInitial,
        revealOnScroll,
    };

    document.addEventListener("DOMContentLoaded", () => {
        gsap.from(".main-navbar .container", {
            y: -16,
            autoAlpha: 0,
            duration: 0.56,
            ease: "power2.out",
            clearProps: "opacity,transform,visibility",
        });

        if (!prefersReducedMotion && ScrollSmoother && window.innerWidth >= 992) {
            const wrapper = document.getElementById("smooth-wrapper");
            const content = document.getElementById("smooth-content");

            if (wrapper && content) {
                smootherInstance = ScrollSmoother.create({
                    wrapper: "#smooth-wrapper",
                    content: "#smooth-content",
                    smooth: 1,
                    smoothTouch: 0.08,
                    effects: true,
                    normalizeScroll: true,
                    ignoreMobileResize: true,
                });
            }
        }

        const scrollToTopBtn = document.getElementById("scrollToTopBtn");
        if (scrollToTopBtn) {
            ScrollTrigger.create({
                trigger: document.body,
                start: "top -280",
                end: "max",
                onUpdate: (self) => {
                    scrollToTopBtn.classList.toggle("is-visible", self.scroll() > 280);
                },
            });

            scrollToTopBtn.addEventListener("click", () => {
                gsap.to(window, {
                    duration: 0.9,
                    ease: "power2.out",
                    scrollTo: {
                        y: 0,
                        autoKill: true,
                    },
                });
            });
        }

        window.addEventListener(
            "load",
            () => {
                clearPaintLock();
            },
            { once: true }
        );
    });
})();
