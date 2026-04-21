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
        spaceBetween: 14,
        slidesPerView: 1.03,
        breakpoints: {
            480: {
                slidesPerView: 1.18,
                spaceBetween: 16,
            },
            640: {
                slidesPerView: 1.35,
                spaceBetween: 18,
            },
            768: {
                slidesPerView: 1.8,
                spaceBetween: 20,
            },
            992: {
                slidesPerView: 2.25,
                spaceBetween: 22,
            },
            1280: {
                slidesPerView: 3.2,
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
