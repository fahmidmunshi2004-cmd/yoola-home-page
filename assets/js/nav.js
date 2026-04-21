window.initNavigation = function initNavigation() {
    const header = document.querySelector("[data-site-header]");

    if (!header || header.dataset.navInit === "true") {
        return;
    }

    header.dataset.navInit = "true";

    const navLinks = Array.from(header.querySelectorAll("[data-nav-link]"));
    const scrollLinks = Array.from(header.querySelectorAll("[data-scroll-link], [data-nav-link]"));
    const mobileNavToggle = header.querySelector("[data-mobile-nav-toggle]");
    const mobileNav = header.querySelector("[data-mobile-nav]");
    const mobileNavOverlay = header.querySelector("[data-mobile-nav-overlay]");
    const mobileNavCloseButtons = Array.from(header.querySelectorAll("[data-mobile-nav-close]"));
    const hasMobileNav = Boolean(mobileNavToggle && mobileNav && mobileNavOverlay);
    let isMobileNavOpen = false;
    let previousBodyOverflow = "";

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

    const setMobileNavState = (shouldOpen) => {
        if (!hasMobileNav || isMobileNavOpen === shouldOpen) {
            return;
        }

        isMobileNavOpen = shouldOpen;

        mobileNavToggle.setAttribute("aria-expanded", String(shouldOpen));
        mobileNav.setAttribute("data-open", String(shouldOpen));
        mobileNavOverlay.setAttribute("data-open", String(shouldOpen));
        mobileNav.setAttribute("aria-hidden", String(!shouldOpen));

        if (shouldOpen) {
            previousBodyOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = previousBodyOverflow;
        }
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

            if (hasMobileNav && mobileNav.contains(link)) {
                setMobileNavState(false);
            }
        });
    });

    if (hasMobileNav) {
        mobileNavToggle.addEventListener("click", () => {
            setMobileNavState(!isMobileNavOpen);
        });

        mobileNavOverlay.addEventListener("click", () => {
            setMobileNavState(false);
        });

        mobileNavCloseButtons.forEach((button) => {
            button.addEventListener("click", () => {
                setMobileNavState(false);
            });
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMobileNavState(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth >= 1024) {
                setMobileNavState(false);
            }
        });
    }

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
