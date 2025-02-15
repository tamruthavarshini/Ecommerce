

document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page")) || 0;
    const size = parseInt(params.get("size")) || 10;

    fetchMerchantProducts(page, size);
});

async function fetchMerchantProducts(page, size) {
    console.log("Fetching merchant products for page:", page, "size:", size);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    try {
        const response = await fetch(`http://localhost:8080/api/merchant/products?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch merchant products");
        }

        const data = await response.json();
        console.log("Merchant products response:", data);

        if (Array.isArray(data.content)) {
            displayMerchantProducts(data.content);
            createPaginationControls(page, data.totalPages);
        } else {
            console.error("Expected an array but got:", data);
        }
    } catch (error) {
        console.error("Error fetching merchant products:", error);
    }
}

function displayMerchantProducts(products) {
    const productsWrapper = document.getElementById("products-wrapper");
    productsWrapper.innerHTML = ""; // Clear previous results

    products.forEach(product => {
        const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        // Product Link (Wraps only non-button elements)
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

        // Append elements to product link
        productLink.appendChild(productImage);
        productLink.appendChild(productBrand);
        productLink.appendChild(productDescription);
        productLink.appendChild(productPrice);

        // Edit Button (Placed inside productCard but outside productLink)
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Stop link click event
            event.preventDefault(); // Prevent navigation
            window.location.href = `../Pages/editProduct.html?product=${encodeURIComponent(product.productId)}`;
        });

        // Delete Button (Placed inside productCard but outside productLink)
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Stop link click event
            event.preventDefault(); // Prevent navigation
            if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(product.productId);
            }
        });

        // Button container (Inside productCard but outside productLink)
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");
        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        // Append elements to product card
        productCard.appendChild(productLink); // Wraps only product details
        productCard.appendChild(buttonContainer); // Buttons are now separate

        // Append to products wrapper
        productsWrapper.appendChild(productCard);
    });
}


function createPaginationControls(page, totalPages) {
    const paginationWrapper = document.getElementById("pagination-controls");
    paginationWrapper.innerHTML = ""; // Clear previous pagination buttons

    if (totalPages > 1) {
        if (page > 0) {
            const prevButton = document.createElement("a");
            prevButton.href = `../Pages/merchantProductsList.html?page=${page - 1}&size=10`;
            prevButton.textContent = "Previous";
            prevButton.classList.add("pagination-button");
            paginationWrapper.appendChild(prevButton);
        }

        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement("a");
            pageButton.href = `../Pages/merchantProductsList.html?page=${i}&size=10`;
            pageButton.textContent = i + 1;
            pageButton.classList.add("pagination-button");
            if (i === page) {
                pageButton.classList.add("active");
            }
            paginationWrapper.appendChild(pageButton);
        }

        if (page < totalPages - 1) {
            const nextButton = document.createElement("a");
            nextButton.href = `../Pages/merchantProductsList.html?page=${page + 1}&size=10`;
            nextButton.textContent = "Next";
            nextButton.classList.add("pagination-button");
            paginationWrapper.appendChild(nextButton);
        }
    }
}

async function saveProductChanges(product) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    try {
        const response = await fetch(`http://localhost:8080/api/merchant/updateproduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Failed to update product");
        }

        alert("Product updated successfully");
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
    }
}

async function deleteProduct(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    try {
        const response = await fetch(`http://localhost:8080/api/merchant/deleteproduct?productId=${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete product");
        }

        alert("Product deleted successfully");
        fetchMerchantProducts(0, 10); // Refresh the product list
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
    }
}
