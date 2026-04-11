document.addEventListener("DOMContentLoaded", () => {
    const motion = window.PrismaGuardMotion;
    if (!motion) {
        return;
    }

    const { gsap } = motion;

    motion.setInitial(
        [
            ".result-banner",
            ".summary-card",
            ".summary-item",
            ".recommendation-list li",
        ],
        {
            autoAlpha: 0,
            y: 22,
        }
    );

    motion.clearPaintLock();

    gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    })
        .to(".result-banner", {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            clearProps: "opacity,transform,visibility",
        })
        .to(
            ".summary-card",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.66,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.42"
        )
        .to(
            ".summary-item",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.52,
                stagger: 0.05,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.4"
        );

    motion.revealOnScroll(".recommendation-list li", {
        start: "top 90%",
        y: 16,
        duration: 0.58,
        staggerStep: 0.04,
    });
});
