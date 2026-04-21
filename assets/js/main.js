async function loadPageSections() {
    const includeBlocks = Array.from(document.querySelectorAll("[data-include]"));
    const hasInlinePreloader = Boolean(document.getElementById("site-preloader"));
    const failedIncludes = [];

    const renderIncludeAlert = () => {
        if (!failedIncludes.length || document.getElementById("include-load-alert") || !document.body) {
            return;
        }

        const alert = document.createElement("div");
        const failedList = failedIncludes.join(", ");

        alert.id = "include-load-alert";
        alert.setAttribute("role", "status");
        alert.style.cssText = [
            "position:fixed",
            "left:50%",
            "bottom:16px",
            "transform:translateX(-50%)",
            "z-index:140",
            "width:min(calc(100vw - 24px), 560px)",
            "border:1px solid #fcd34d",
            "border-radius:18px",
            "background:#fff8e6",
            "color:#92400e",
            "box-shadow:0 18px 42px rgba(15,23,42,0.14)",
            "padding:14px 16px",
            "font:500 14px/1.5 'Plus Jakarta Sans', sans-serif"
        ].join(";");
        alert.innerHTML = `Some sections could not load. Run the project from a local server like Live Server.<br><span style="display:block;margin-top:6px;font-size:13px;color:#b45309;">Failed: ${failedList}</span>`;
        document.body.appendChild(alert);
    };

    if (!includeBlocks.length) {
        if (hasInlinePreloader) {
            window.dispatchEvent(new Event("yoola:preloader-mounted"));
        }

        window.dispatchEvent(new Event("resize"));
        window.dispatchEvent(new Event("yoola:sections-loaded"));
        return;
    }

    const replaceIncludeBlock = async (block) => {
        const file = block.dataset.include;

        try {
            const response = await fetch(file);

            if (!response.ok) {
                throw new Error(`Failed to load ${file}`);
            }

            const html = await response.text();
            const template = document.createElement("template");
            template.innerHTML = html.trim();
            block.replaceWith(template.content);
            return true;
        } catch (error) {
            failedIncludes.push(file);
            console.error(`Failed to load include: ${file}`, error);
            block.remove();
            return false;
        }
    };

    const preloaderBlock = includeBlocks.find((block) => block.dataset.include === "./partials/preloader.html");
    const pageBlocks = includeBlocks.filter((block) => block !== preloaderBlock);

    if (preloaderBlock) {
        await replaceIncludeBlock(preloaderBlock);
        window.dispatchEvent(new Event("yoola:preloader-mounted"));
    }

    await Promise.all(pageBlocks.map(replaceIncludeBlock));

    renderIncludeAlert();

    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("yoola:sections-loaded"));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPageSections);
} else {
    loadPageSections();
}
