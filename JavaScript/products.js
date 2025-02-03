document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get("category");
    fetchProducts(categoryId);
    // if (categoryName) {
    //     console.log("Category Selected:", categoryName);
    //     document.getElementById("category-title").textContent = `Products for ${categoryName}`;
    // }
});

function fetchProducts(categoryId) {
    console.log("Fetching products for category:", categoryId);
    fetch(`http://localhost:8080/api/products/${categoryId}`)
        .then(response => response.json())
        .then(products => {
            console.log(products);  // Log the fetched products
            displayProducts(products);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

function displayProducts(products) {
    const productsWrapper = document.getElementById("products-wrapper");
    const productsList = document.createElement("div");
    productsList.classList.add("productlist");
    products.forEach(product => {
        const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

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

        productsWrapper.appendChild(productCard);
    });
}
