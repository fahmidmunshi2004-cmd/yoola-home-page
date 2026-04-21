(function () {
    let hasHiddenPreloader = false;
    let hasMountedPreloader = false;
    let sectionsReady = false;
    let pageReady = document.readyState === "complete";
    let fallbackTimer = null;

    function getPreloader() {
        return document.getElementById("site-preloader");
    }

    function mountPreloader() {
        if (hasMountedPreloader || hasHiddenPreloader) {
            return;
        }

        const preloader = getPreloader();

        if (!preloader) {
            return;
        }

        hasMountedPreloader = true;
        document.body.classList.add("preloader-is-active");

        window.requestAnimationFrame(() => {
            preloader.classList.add("is-ready");
        });
    }

    function hidePreloader() {
        if (hasHiddenPreloader) {
            return;
        }

        const preloader = getPreloader();

        if (!preloader) {
            return;
        }

        hasHiddenPreloader = true;
        window.clearTimeout(fallbackTimer);
        preloader.classList.add("is-hidden");
        document.body.classList.remove("preloader-is-active");

        const removePreloader = () => {
            preloader.remove();
        };

        preloader.addEventListener("transitionend", removePreloader, { once: true });
        window.setTimeout(removePreloader, 700);
    }

    function maybeHidePreloader() {
        if (!sectionsReady || !pageReady) {
            return;
        }

        hidePreloader();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountPreloader, { once: true });
    } else {
        mountPreloader();
    }

    window.addEventListener("yoola:preloader-mounted", mountPreloader);

    window.addEventListener("yoola:sections-loaded", () => {
        sectionsReady = true;
        maybeHidePreloader();
    });

    window.addEventListener("load", () => {
        pageReady = true;
        maybeHidePreloader();
    });

    window.addEventListener("error", hidePreloader);
    window.addEventListener("unhandledrejection", hidePreloader);

    fallbackTimer = window.setTimeout(hidePreloader, 4000);
})();
