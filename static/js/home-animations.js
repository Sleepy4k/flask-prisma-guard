document.addEventListener("DOMContentLoaded", () => {
    const motion = window.PrismaGuardMotion;
    if (!motion) {
        return;
    }

    const { gsap } = motion;

    motion.setInitial(
        [
            ".hero-panel",
            ".hero-panel .hero-eyebrow",
            ".hero-panel .hero-title",
            ".hero-panel .lead",
            ".hero-actions .btn",
            ".glass-card",
            ".metric-item",
        ],
        {
            autoAlpha: 0,
            y: 24,
        }
    );

    motion.clearPaintLock();

    const heroTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    heroTimeline
        .to(".hero-panel", {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            clearProps: "opacity,transform,visibility",
        })
        .to(
            ".hero-panel .hero-eyebrow, .hero-panel .hero-title, .hero-panel .lead",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.66,
                stagger: 0.08,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.45"
        )
        .to(
            ".hero-actions .btn",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.56,
                stagger: 0.07,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.42"
        )
        .to(
            ".glass-card, .metric-item",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.54,
                stagger: 0.06,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.4"
        );

    motion.revealOnScroll(".step-card", {
        start: "top 86%",
        y: 24,
        duration: 0.72,
    });

    motion.revealOnScroll(".faq-shell", {
        start: "top 88%",
        y: 20,
        duration: 0.7,
    });

    motion.revealOnScroll(".accordion-item", {
        start: "top 90%",
        y: 14,
        duration: 0.58,
        staggerStep: 0.05,
    });
});
