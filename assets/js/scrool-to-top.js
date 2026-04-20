// ============== backToTop ============== //
let windowHeight = 0;
let documentHeight = 0;

function updateDimensions() {
    windowHeight = window.innerHeight;
    documentHeight = document.documentElement.scrollHeight - windowHeight;
}

updateDimensions();
window.addEventListener('resize', updateDimensions);

const box = document.querySelector(".scrollToTop");

if (box) {
    const water = box.querySelector(".water");

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const percent = Math.min(Math.floor((scrollPosition / documentHeight) * 100), 100);

        if (water) {
            water.style.transform = `translate(0, ${100 - percent}%)`;
        }

        if (scrollPosition >= 200) {
            box.style.display = "block";
            box.style.opacity = "1";
        } else {
            box.style.opacity = "0";
            box.style.display = "none";
        }
    });

    // Scroll to top
    box.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}