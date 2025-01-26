let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll('.slider-item');
    const totalSlides = slides.length;

    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - currentIndex) * 100}%)`;
    });
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slider-item');
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${i * 100}%)`;
    });
    showSlide(currentIndex);
    setInterval(nextSlide, 3000);
});
