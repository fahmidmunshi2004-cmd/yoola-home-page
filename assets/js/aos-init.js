(function () {
    let hasInitializedAOS = false;

    const initAOS = () => {
        if (!window.AOS) {
            return;
        }

        if (!hasInitializedAOS) {
            window.AOS.init({
                offset: 72,
                delay: 0,
                duration: 700,
                easing: "ease-out-cubic",
                once: true,
                mirror: false,
                anchorPlacement: "top-bottom",
                disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
            });

            hasInitializedAOS = true;
            return;
        }

        window.AOS.refreshHard();
    };

    const scheduleAOSRefresh = () => {
        window.requestAnimationFrame(initAOS);
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scheduleAOSRefresh, { once: true });
    } else {
        scheduleAOSRefresh();
    }

    window.addEventListener("load", scheduleAOSRefresh);
    window.addEventListener("yoola:sections-loaded", scheduleAOSRefresh);
})();
