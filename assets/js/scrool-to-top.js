// ============== backToTop ============== //
let windowHeight = 0;
let documentHeight = 0;

function updateDimensions() {
    windowHeight = window.innerHeight;
    documentHeight = Math.max(document.documentElement.scrollHeight - windowHeight, 1);
}

function syncScrollToTop(box) {
    if (!box) {
        return;
    }

    const water = box.querySelector(".water");
    const scrollPosition = window.scrollY;
    const percent = Math.min(Math.floor((scrollPosition / documentHeight) * 100), 100);

    if (water) {
        water.style.transform = `translate(0, ${100 - percent}%)`;
    }

    if (scrollPosition >= 200) {
        box.classList.add("active-progress");
        return;
    }

    box.classList.remove("active-progress");
}

function initScrollToTop() {
    const box = document.querySelector(".scrollToTop");

    if (!box) {
        return;
    }

    updateDimensions();
    syncScrollToTop(box);

    if (box.dataset.scrollToTopInit === "true") {
        return;
    }

    box.dataset.scrollToTopInit = "true";

    const handleScroll = () => syncScrollToTop(box);
    const handleResize = () => {
        updateDimensions();
        syncScrollToTop(box);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    box.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

window.initScrollToTop = initScrollToTop;

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScrollToTop);
} else {
    initScrollToTop();
}

window.addEventListener("yoola:sections-loaded", initScrollToTop);
