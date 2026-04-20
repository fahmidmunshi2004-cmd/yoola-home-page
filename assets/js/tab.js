window.initWorksTabs = function initWorksTabs() {
    const worksTabsSection = document.querySelector("[data-works-tabs]");

    if (!worksTabsSection || worksTabsSection.dataset.tabsInit === "true") {
        return;
    }

    worksTabsSection.dataset.tabsInit = "true";

    const tabButtons = Array.from(worksTabsSection.querySelectorAll("[data-works-tab-button]"));
    const tabPanels = Array.from(worksTabsSection.querySelectorAll("[data-works-panel]"));

    const activeButtonClasses = [
        "border-[#FBBF24]",
        "bg-[#FFF1C7]",
        "text-[#F59E0B]",
        "shadow-[0_10px_24px_rgba(251,191,36,0.18)]",
    ];

    const inactiveButtonClasses = [
        "border-transparent",
        "text-[#475467]",
    ];

    const setActiveTab = (tabName) => {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tab === tabName;

            button.setAttribute("aria-selected", String(isActive));
            button.classList.toggle("hover:text-[#101828]", !isActive);

            activeButtonClasses.forEach((className) => {
                button.classList.toggle(className, isActive);
            });

            inactiveButtonClasses.forEach((className) => {
                button.classList.toggle(className, !isActive);
            });
        });

        tabPanels.forEach((panel) => {
            panel.classList.toggle("hidden", panel.dataset.worksPanel !== tabName);
        });
    };

    tabButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            setActiveTab(button.dataset.tab);
        });

        button.addEventListener("keydown", (event) => {
            const currentIndex = tabButtons.indexOf(button);
            let nextIndex = null;

            if (event.key === "ArrowRight") {
                nextIndex = (currentIndex + 1) % tabButtons.length;
            }

            if (event.key === "ArrowLeft") {
                nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
            }

            if (event.key === "Home") {
                nextIndex = 0;
            }

            if (event.key === "End") {
                nextIndex = tabButtons.length - 1;
            }

            if (nextIndex === null) {
                return;
            }

            event.preventDefault();
            const nextButton = tabButtons[nextIndex];
            nextButton.focus();
            setActiveTab(nextButton.dataset.tab);
        });

        if (index === 0) {
            setActiveTab(button.dataset.tab);
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initWorksTabs);
} else {
    window.initWorksTabs();
}

window.addEventListener("yoola:sections-loaded", window.initWorksTabs);
