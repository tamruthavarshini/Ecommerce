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
    fetchRandomProducts();
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
                    const page=0;const size=10;
                    const categoryLink = document.createElement("a");
                    categoryLink.href = `../Pages/products.html?category=${encodeURIComponent(category.id)}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`; // Pass category as query param
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
function fetchRandomProducts() {
    fetch("http://localhost:8080/api/products/random")
        .then(response => response.json())
        .then(products => {
            console.log(products); 
            const productsWrapper = document.getElementById("products-wrapper");
            productsWrapper.innerHTML = ''; // Clear previous content

            products.forEach(product => {
                const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");

                const productLink = document.createElement("a");
                productLink.href = `../Pages/productDetails.html?product=${encodeURIComponent(product.productId)}&category=${encodeURIComponent(product.category.id)}`;
                productLink.classList.add("product-link");

                const productImage = document.createElement("img");
                productImage.src = product.image1;
                productImage.alt = product.productId;
                productImage.classList.add("product-image");

                const productBrand = document.createElement("p");
                productBrand.classList.add("product-name");
                productBrand.textContent = product.brand;

                const productDescription = document.createElement("p");
                productDescription.classList.add("product-description");
                productDescription.textContent = product.description;

                const productPrice = document.createElement("p");
                productPrice.classList.add("product-cost");

                const finalPrice = document.createElement("span");
                finalPrice.classList.add("final-cost");
                finalPrice.textContent = `Rs.${discountedPrice}`;

                const strikePrice = document.createElement("span");
                strikePrice.classList.add("strike-price");
                strikePrice.textContent = `Rs.${product.cost}`;

                const discount = document.createElement("span");
                discount.classList.add("off-percentage");
                discount.textContent = `${product.discount}% off`;

                productPrice.appendChild(finalPrice);
                productPrice.appendChild(strikePrice);
                productPrice.appendChild(discount);

                productCard.appendChild(productImage);
                productCard.appendChild(productBrand);
                productCard.appendChild(productDescription);
                productCard.appendChild(productPrice);

                productLink.appendChild(productCard);
                productsWrapper.appendChild(productLink);
            });
        })
        .catch(error => {
            console.error("Error fetching random products:", error);
        });
}
