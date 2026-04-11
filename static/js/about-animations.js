document.addEventListener("DOMContentLoaded", () => {
    const motion = window.PrismaGuardMotion;
    if (!motion) {
        return;
    }

    const { gsap } = motion;

    motion.setInitial(
        [
            ".about-intro",
            ".enterprise-card",
            ".stat-box",
            ".enterprise-disclaimer",
        ],
        {
            autoAlpha: 0,
            y: 22,
        }
    );

    motion.clearPaintLock();

    const introTimeline = gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    });

    introTimeline
        .to(".about-intro", {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            clearProps: "opacity,transform,visibility",
        })
        .to(
            ".enterprise-card",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.68,
                stagger: 0.1,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.44"
        );

    motion.revealOnScroll(".stat-box", {
        start: "top 90%",
        y: 14,
        duration: 0.62,
    });

    motion.revealOnScroll(".pipeline-list li", {
        start: "top 90%",
        y: 14,
        duration: 0.58,
        staggerStep: 0.05,
    });

    motion.revealOnScroll(".enterprise-disclaimer", {
        start: "top 88%",
        y: 18,
        duration: 0.72,
    });
});
