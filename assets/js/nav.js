window.initNavigation = function initNavigation() {
    const header = document.querySelector("[data-site-header]");

    if (!header || header.dataset.navInit === "true") {
        return;
    }

    header.dataset.navInit = "true";

    const navLinks = Array.from(header.querySelectorAll("[data-nav-link]"));
    const scrollLinks = Array.from(header.querySelectorAll("[data-scroll-link], [data-nav-link]"));

    const getTarget = (link) => {
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) {
            return null;
        }

        return document.querySelector(href);
    };

    const setActiveLink = (targetId) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${targetId}`;
            link.classList.toggle("active", isActive);
        });
    };

    const updateHeaderShadow = () => {
        header.classList.toggle("is-scrolled", window.scrollY > 200);
    };

    const smoothScrollTo = (target) => {
        const targetTop = target.getBoundingClientRect().top + window.scrollY - 24;

        window.scrollTo({
            top: Math.max(targetTop, 0),
            behavior: "smooth",
        });
    };

    scrollLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const target = getTarget(link);

            if (!target) {
                return;
            }

            event.preventDefault();
            smoothScrollTo(target);

            if (link.hasAttribute("data-nav-link")) {
                setActiveLink(target.id);
            }
        });
    });

    const targetEntries = navLinks
        .map((link) => {
            const target = getTarget(link);

            if (!target) {
                return null;
            }

            return {
                link,
                target,
            };
        })
        .filter(Boolean);

    if (!targetEntries.length) {
        return;
    }

    const updateActiveFromScroll = () => {
        const marker = window.scrollY + Math.max(window.innerHeight * 0.28, 220);
        let currentId = targetEntries[0].target.id;

        targetEntries.forEach((entry) => {
            if (entry.target.offsetTop <= marker) {
                currentId = entry.target.id;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
            currentId = targetEntries[targetEntries.length - 1].target.id;
        }

        setActiveLink(currentId);
        updateHeaderShadow();
    };

    window.addEventListener("scroll", updateActiveFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveFromScroll);
    requestAnimationFrame(updateActiveFromScroll);
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initNavigation);
} else {
    window.initNavigation();
}

window.addEventListener("yoola:sections-loaded", window.initNavigation);
