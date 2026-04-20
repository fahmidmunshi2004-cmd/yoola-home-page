async function loadPageSections() {
    const includeBlocks = Array.from(document.querySelectorAll("[data-include]"));
    const hasInlinePreloader = Boolean(document.getElementById("site-preloader"));

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
        } catch (error) {
            console.error(error);
        }
    };

    const preloaderBlock = includeBlocks.find((block) => block.dataset.include === "./partials/preloader.html");
    const pageBlocks = includeBlocks.filter((block) => block !== preloaderBlock);

    if (preloaderBlock) {
        await replaceIncludeBlock(preloaderBlock);
        window.dispatchEvent(new Event("yoola:preloader-mounted"));
    }

    await Promise.all(pageBlocks.map(replaceIncludeBlock));

    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("yoola:sections-loaded"));
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPageSections);
} else {
    loadPageSections();
}
