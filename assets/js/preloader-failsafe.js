(function () {
    const preloaderTimeoutMs = 5000;
    let hasActivatedFailsafe = false;
    let observerDisconnectTimer = null;

    const activatePreloaderFailsafe = (preloader) => {
        if (!preloader || hasActivatedFailsafe || !document.body) {
            return;
        }

        hasActivatedFailsafe = true;
        document.body.classList.add("preloader-is-active");

        window.requestAnimationFrame(() => {
            preloader.classList.add("is-ready");
        });

        window.setTimeout(() => {
            const currentPreloader = document.getElementById("site-preloader");

            if (!currentPreloader) {
                document.body.classList.remove("preloader-is-active");
                return;
            }

            currentPreloader.classList.add("is-hidden");
            document.body.classList.remove("preloader-is-active");
            window.setTimeout(() => currentPreloader.remove(), 700);
        }, preloaderTimeoutMs);
    };

    const existingPreloader = document.getElementById("site-preloader");

    if (existingPreloader) {
        activatePreloaderFailsafe(existingPreloader);
        return;
    }

    const observer = new MutationObserver(() => {
        const injectedPreloader = document.getElementById("site-preloader");

        if (!injectedPreloader) {
            return;
        }

        observer.disconnect();

        if (observerDisconnectTimer) {
            window.clearTimeout(observerDisconnectTimer);
        }

        activatePreloaderFailsafe(injectedPreloader);
    });

    if (!document.body) {
        return;
    }

    observer.observe(document.body, { childList: true, subtree: true });
    observerDisconnectTimer = window.setTimeout(() => observer.disconnect(), preloaderTimeoutMs);
})();
