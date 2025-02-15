// document.addEventListener("DOMContentLoaded", function() {
//     const params = new URLSearchParams(window.location.search);
//     const categoryId = params.get("category");
//     const page = params.get("page");
//     const size = params.get("size");
//     fetchProducts(categoryId,page,size)
//     // if (categoryName) {
//     //     console.log("Category Selected:", categoryName);
//     //     document.getElementById("category-title").textContent = `Products for ${categoryName}`;
//     // }
// });

// function fetchProducts(categoryId, page, size) {
//     console.log("Fetching products for category:", categoryId);
    
//     fetch(`http://localhost:8080/api/products/${categoryId}/${page}/${size}`)
//         .then(response => response.json())
//         .then(data => {  
//             const products = data.content; 
//             console.log(products);  
//             displayProducts(products, categoryId);
//         })
//         .catch(error => {
//             console.error("Error fetching products:", error);
//         });
// }


// function displayProducts(products, categoryId) {
//     const productsWrapper = document.getElementById("products-wrapper");
//     const productsList = document.createElement("div");
//     productsList.classList.add("productlist");
//     products.forEach(product => {
//         const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
//         const productCard = document.createElement("div");
//         productCard.classList.add("product-card");

//         const productLink = document.createElement("a");
//         productLink.href = `../Pages/productDetails.html?product=${encodeURIComponent(product.productId)}&category=${encodeURIComponent(categoryId)}`;
//         productLink.classList.add("product-link");
//         productLink.addEventListener("click", function(event) {
//             console.log("Clicked:", product.brand);
//         });
        
//         const productImage = document.createElement("img");
//         productImage.src = product.image1;
//         productImage.alt = product.productId;
//         productImage.classList.add("product-image");

//         const productBrand = document.createElement("p");
//         productBrand.classList.add("product-name");
//         productBrand.textContent = product.brand;

//         const productDescription = document.createElement("p");
//         productDescription.classList.add("product-description");
//         productDescription.textContent = product.description;

//         const productPrice = document.createElement("p");
//         productPrice.classList.add("product-cost");

//         const finalPrice = document.createElement("span");
//         finalPrice.classList.add("final-cost");
//         finalPrice.textContent = `Rs.${discountedPrice}`;

//         const strikePrice = document.createElement("span");
//         strikePrice.classList.add("strike-price");
//         strikePrice.textContent = `Rs.${product.cost}`;

//         const discount = document.createElement("span");
//         discount.classList.add("off-percentage");
//         discount.textContent = `${product.discount}% off`;

//         productPrice.appendChild(finalPrice);
//         productPrice.appendChild(strikePrice);
//         productPrice.appendChild(discount);

//         productCard.appendChild(productImage);
//         productCard.appendChild(productBrand);
//         productCard.appendChild(productDescription);
//         productCard.appendChild(productPrice);

//         productLink.appendChild(productCard);

//         productsWrapper.appendChild(productLink);
//     });
// }
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("category");
    const page = params.get("page") ? parseInt(params.get("page")) : 0;
    const size = params.get("size") ? parseInt(params.get("size")) : 5; // Default size

    fetchProducts(categoryId, page, size);
});

function fetchProducts(categoryId, page, size) {
    console.log("Fetching products for category:", categoryId, " Page:", page);

    fetch(`http://localhost:8080/api/products/${categoryId}/${page}/${size}`)
        .then(response => response.json())
        .then(data => {
            const products = data.content;  // Paginated product list
            console.log(products);
            displayProducts(products, categoryId);
            createPaginationControls(categoryId, page, size, data.totalPages);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

function displayProducts(products, categoryId) {
    const productsWrapper = document.getElementById("products-wrapper");
    productsWrapper.innerHTML = ""; // Clear previous results

    products.forEach(product => {
        const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productLink = document.createElement("a");
        productLink.href = `../Pages/productDetails.html?product=${encodeURIComponent(product.productId)}&category=${encodeURIComponent(categoryId)}`;
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
}

// 🟢 Pagination Controls Function
function createPaginationControls(categoryId, page, size, totalPages) {
    const paginationWrapper = document.getElementById("pagination-controls");
    paginationWrapper.innerHTML = ""; // Clear previous pagination buttons

    if (totalPages > 1) {
        if (page > 0) {
            const prevButton = document.createElement("a");
            prevButton.href = `../Pages/products.html?category=${encodeURIComponent(categoryId)}&page=${page - 1}&size=${size}`;
            prevButton.textContent = "Previous";
            prevButton.classList.add("pagination-button");
            paginationWrapper.appendChild(prevButton);
        }

        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement("a");
            pageButton.href = `../Pages/products.html?category=${encodeURIComponent(categoryId)}&page=${i}&size=${size}`;
            pageButton.textContent = i + 1;
            pageButton.classList.add("pagination-button");
            if (i === page) {
                pageButton.classList.add("active");
            }
            paginationWrapper.appendChild(pageButton);
        }

        if (page < totalPages - 1) {
            const nextButton = document.createElement("a");
            nextButton.href = `../Pages/products.html?category=${encodeURIComponent(categoryId)}&page=${page + 1}&size=${size}`;
            nextButton.textContent = "Next";
            nextButton.classList.add("pagination-button");
            paginationWrapper.appendChild(nextButton);
        }
    }
}
