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





document.addEventListener("DOMContentLoaded", function() {
    
    fetchCategories();
});
function fetchCategories() {
    fetch("http://localhost:8080/api/categories")
        .then(response => response.json())
        .then(categories => {
            console.log(categories); 
            const categoriesWrapper = document.getElementById("categories-wrapper");
            categories.forEach((category, index) => {
                setTimeout(() => {
                    console.log('Creating card for:', category.name);
            
                    const categoryCard = document.createElement("div");
                    categoryCard.classList.add("category-card");
                    
                    const categoryLink = document.createElement("a");
                    categoryLink.href = `../Pages/products.html?category=${encodeURIComponent(category.id)}`; // Pass category as query param
                    categoryLink.classList.add("category-link");
                    categoryLink.addEventListener("click", function(event) {
                        console.log("Clicked:", category.name);
                    });
                    

                    const categoryImage = document.createElement("img");
                    categoryImage.src = `${category.image}`;
                    categoryImage.alt = category.name;
                    categoryImage.classList.add("category-image");
            
                    const categoryName = document.createElement("p");
                    categoryName.classList.add("category-name");
                    categoryName.textContent = category.name;
            
                    categoryLink.appendChild(categoryImage);
                    categoryLink.appendChild(categoryName);

                    categoryCard.appendChild(categoryLink);
            
                    categoriesWrapper.appendChild(categoryCard);
                }, index * 100); 
            });
            
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
}
