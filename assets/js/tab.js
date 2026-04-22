window.initWorksTabs = function initWorksTabs() {
    const worksTabsSection = document.querySelector("[data-works-tabs]");

    if (!worksTabsSection || worksTabsSection.dataset.tabsInit === "true") {
        return;
    }

    worksTabsSection.dataset.tabsInit = "true";

    const tabButtons = Array.from(worksTabsSection.querySelectorAll("[data-works-tab-button]"));
    const tabPanels = Array.from(worksTabsSection.querySelectorAll("[data-works-panel]"));
    const panelsStage = tabPanels[0]?.parentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const transitionDuration = 320;

    let activeTab = null;
    let isAnimating = false;
    let queuedTab = null;
    let animationTimer = null;

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

    if (panelsStage) {
        panelsStage.classList.add("works-tabs__stage");
    }

    const setButtonState = (tabName) => {
        tabButtons.forEach((button) => {
            const isActive = button.dataset.tab === tabName;

            button.setAttribute("aria-selected", String(isActive));
            button.tabIndex = isActive ? 0 : -1;
            button.classList.toggle("hover:text-[#101828]", !isActive);

            activeButtonClasses.forEach((className) => {
                button.classList.toggle(className, isActive);
            });

            inactiveButtonClasses.forEach((className) => {
                button.classList.toggle(className, !isActive);
            });
        });
    };

    const showPanelInstant = (tabName) => {
        tabPanels.forEach((panel) => {
            const isActive = panel.dataset.worksPanel === tabName;

            panel.classList.toggle("hidden", !isActive);
            panel.classList.remove("is-entering", "is-leaving", "is-overlay");
            panel.setAttribute("aria-hidden", String(!isActive));
        });

        if (panelsStage) {
            panelsStage.style.height = "";
        }

        activeTab = tabName;
    };

    const finishPanelTransition = (nextPanel, previousPanel, nextTab) => {
        previousPanel.classList.add("hidden");
        previousPanel.classList.remove("is-leaving");
        previousPanel.setAttribute("aria-hidden", "true");

        nextPanel.classList.remove("is-overlay", "is-entering");
        nextPanel.setAttribute("aria-hidden", "false");

        activeTab = nextTab;
        isAnimating = false;

        if (panelsStage) {
            panelsStage.style.height = `${nextPanel.offsetHeight}px`;

            window.requestAnimationFrame(() => {
                panelsStage.style.height = "";
            });
        }

        if (queuedTab && queuedTab !== activeTab) {
            const pendingTab = queuedTab;
            queuedTab = null;
            requestTabChange(pendingTab);
            return;
        }

        queuedTab = null;
    };

    const animatePanelChange = (nextTab) => {
        const currentPanel = tabPanels.find((panel) => panel.dataset.worksPanel === activeTab);
        const nextPanel = tabPanels.find((panel) => panel.dataset.worksPanel === nextTab);

        if (!currentPanel || !nextPanel || currentPanel === nextPanel || !panelsStage || prefersReducedMotion.matches) {
            setButtonState(nextTab);
            showPanelInstant(nextTab);
            return;
        }

        isAnimating = true;
        window.clearTimeout(animationTimer);

        setButtonState(nextTab);

        nextPanel.classList.remove("hidden", "is-leaving");
        nextPanel.classList.add("is-overlay", "is-entering");
        nextPanel.setAttribute("aria-hidden", "false");

        currentPanel.classList.remove("is-entering");

        const currentHeight = currentPanel.offsetHeight;
        const nextHeight = nextPanel.offsetHeight;

        panelsStage.style.height = `${currentHeight}px`;

        window.requestAnimationFrame(() => {
            currentPanel.classList.add("is-leaving");
            nextPanel.classList.remove("is-entering");
            panelsStage.style.height = `${nextHeight}px`;
        });

        animationTimer = window.setTimeout(() => {
            finishPanelTransition(nextPanel, currentPanel, nextTab);
        }, transitionDuration + 40);
    };

    const requestTabChange = (tabName) => {
        if (!tabName || tabName === activeTab) {
            return;
        }

        if (isAnimating) {
            queuedTab = tabName;
            return;
        }

        animatePanelChange(tabName);
    };

    const initialButton =
        tabButtons.find((button) => button.getAttribute("aria-selected") === "true") ?? tabButtons[0];

    if (initialButton) {
        setButtonState(initialButton.dataset.tab);
        showPanelInstant(initialButton.dataset.tab);
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            requestTabChange(button.dataset.tab);
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
            requestTabChange(nextButton.dataset.tab);
        });
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initWorksTabs);
} else {
    window.initWorksTabs();
}

window.addEventListener("yoola:sections-loaded", window.initWorksTabs);
