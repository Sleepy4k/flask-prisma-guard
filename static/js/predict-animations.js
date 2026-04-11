document.addEventListener("DOMContentLoaded", () => {
    const motion = window.PrismaGuardMotion;
    if (!motion) {
        return;
    }

    const { gsap } = motion;

    motion.setInitial(
        [
            ".prediction-shell .card",
            ".step-indicator-item",
            ".prediction-note",
        ],
        {
            autoAlpha: 0,
            y: 20,
        }
    );

    motion.clearPaintLock();

    gsap.timeline({
        defaults: {
            ease: "power3.out",
        },
    })
        .to(".prediction-shell .card", {
            autoAlpha: 1,
            y: 0,
            duration: 0.78,
            clearProps: "opacity,transform,visibility",
        })
        .to(
            ".step-indicator-item",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.06,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.45"
        )
        .to(
            ".prediction-note",
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.46,
                clearProps: "opacity,transform,visibility",
            },
            "-=0.36"
        );

    const animateActiveQuestions = () => {
        const activeBlocks = gsap.utils.toArray(".form-step.active .question-block");
        if (!activeBlocks.length) {
            return;
        }

        gsap.fromTo(
            activeBlocks,
            {
                autoAlpha: 0,
                y: 12,
            },
            {
                autoAlpha: 1,
                y: 0,
                duration: 0.36,
                ease: "power2.out",
                stagger: 0.03,
                overwrite: true,
                clearProps: "opacity,transform,visibility",
            }
        );
    };

    animateActiveQuestions();

    ["nextBtn", "prevBtn"].forEach((id) => {
        const button = document.getElementById(id);
        if (!button) {
            return;
        }

        button.addEventListener("click", () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(animateActiveQuestions);
            });
        });
    });
});
