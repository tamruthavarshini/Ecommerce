// let slideIndex = 0;

// function showSlide(index) {
//     const slides = document.querySelector('.slides');
//     const dots = document.querySelectorAll('.dot');
//     if (index >= dots.length) index = 0;
//     if (index < 0) index = dots.length - 1;
//     slideIndex = index;
//     slides.style.transform = `translateX(-${index * 100}%)`;
//     dots.forEach(dot => dot.classList.remove('active'));
//     dots[slideIndex].classList.add('active');
// }

// function currentSlide(index) {
//     showSlide(index);
// }

// function autoSlide() {
//     slideIndex++;
//     showSlide(slideIndex);
//     setTimeout(autoSlide, 3000);
// }

// document.addEventListener('DOMContentLoaded', () => {
//     showSlide(slideIndex);
//     autoSlide();
// });
let slideIndex = 0;

function showSlide(index) {
    const slides = document.querySelector('.slides');
    const dots = document.querySelectorAll('.dot');
    if (index >= dots.length) index = 0;
    if (index < 0) index = dots.length - 1;
    slideIndex = index;
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[slideIndex].classList.add('active');
}

function currentSlide(index) {
    showSlide(index);
}

function autoSlide() {
    slideIndex++;
    showSlide(slideIndex);
    setTimeout(autoSlide, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(slideIndex);
    autoSlide();
});
