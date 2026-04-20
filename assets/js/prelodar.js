(function () {
    let hasHiddenPreloader = false;
    let sectionsReady = false;
    let pageReady = document.readyState === "complete";

    function getPreloader() {
        return document.getElementById("site-preloader");
    }

    function mountPreloader() {
        const preloader = getPreloader();

        if (!preloader) {
            return;
        }

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

    window.addEventListener("yoola:preloader-mounted", mountPreloader);

    window.addEventListener("yoola:sections-loaded", () => {
        sectionsReady = true;
        maybeHidePreloader();
    });

    window.addEventListener("load", () => {
        pageReady = true;
        maybeHidePreloader();
    });
})();
