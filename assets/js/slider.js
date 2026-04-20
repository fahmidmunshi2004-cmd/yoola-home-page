window.initStoriesSlider = function initStoriesSlider() {
    if (typeof Swiper === "undefined") {
        return;
    }

    const storiesSlider = document.querySelector(".realStoriesSwiper");

    if (!storiesSlider || storiesSlider.classList.contains("swiper-initialized")) {
        return;
    }

    new Swiper(storiesSlider, {
        loop: true,
        grabCursor: true,
        speed: 700,
        autoplay: {
            delay: 3800,
            disableOnInteraction: false,
        },
        spaceBetween: 18,
        slidesPerView: 1.08,
        breakpoints: {
            640: {
                slidesPerView: 1.45,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 2.25,
                spaceBetween: 22,
            },
            1280: {
                slidesPerView: 3.35,
                spaceBetween: 24,
            },
        },
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initStoriesSlider);
} else {
    window.initStoriesSlider();
}

window.addEventListener("yoola:sections-loaded", window.initStoriesSlider);
