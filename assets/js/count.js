window.initCounters = function initCounters() {
    const counters = document.querySelectorAll(".counter-value:not([data-counter-init='true'])");

    if (!counters.length) {
        return;
    }

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (counter) => {
        const target = Number(counter.dataset.count || 0);
        const suffix = counter.dataset.suffix || "";
        const decimals = Number(counter.dataset.decimals || 0);
        const duration = Number(counter.dataset.duration || 2200);
        const startValue = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutCubic(progress);

            const currentValue = startValue + (target - startValue) * eased;

            counter.textContent = `${currentValue.toFixed(decimals)}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = `${target.toFixed(decimals)}${suffix}`;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver(
        (entries, observerInstance) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                animateCounter(entry.target);
                observerInstance.unobserve(entry.target);
            });
        },
        {
            threshold: 0.3,
        }
    );

    counters.forEach((counter) => {
        counter.dataset.counterInit = "true";
        observer.observe(counter);
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initCounters);
} else {
    window.initCounters();
}

window.addEventListener("yoola:sections-loaded", window.initCounters);
