document.addEventListener("DOMContentLoaded", function () {
    const productsWrapper = document.getElementById("products-wrapper");
    if (!productsWrapper) {
        console.error("Error: products-wrapper element not found.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const query = params.get("query");

    if (query) {
        fetchSearchResults(query);
    } else {
        productsWrapper.innerHTML = "<p>No search query provided.</p>";
    }
});

function fetchSearchResults(query) {
    fetch(`http://localhost:8080/api/search/${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
    })
    .then(data => displayResults(data))
    .catch(error => {
        console.error("Error fetching search results:", error);
        const productsWrapper = document.getElementById("products-wrapper");
        if (productsWrapper) {
            productsWrapper.innerHTML = "<p>Error fetching search results. Please try again.</p>";
        }
    });
}

function displayResults(products) {
    const productsWrapper = document.getElementById("products-wrapper");
    if (!productsWrapper) {
        console.error("Error: products-wrapper element not found.");
        return;
    }

    productsWrapper.innerHTML = "";

    if (products.length === 0) {
        productsWrapper.innerHTML = "<p>No products found.</p>";
        return;
    }

    const productsList = document.createElement("div");
    productsList.classList.add("productlist");

    products.forEach(product => {
        const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
        const categoryId = product.category.id || "default"; // Extract category ID dynamically

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productLink = document.createElement("a");
        productLink.href = `../Pages/productDetails.html?product=${encodeURIComponent(product.productId)}&category=${encodeURIComponent(categoryId)}`;
        productLink.classList.add("product-link");

        const productImage = document.createElement("img");
        productImage.src = product.image1 || "placeholder.jpg";
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
        productsList.appendChild(productLink);
    });

    productsWrapper.appendChild(productsList);
}
