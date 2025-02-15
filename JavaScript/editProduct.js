document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    if (productId) {
        fetchProductDetails(productId);
    }

    // Enable/Disable Save button based on form validation
    const editProductForm = document.getElementById("editProductForm");
    const saveButton = document.getElementById("saveButton");

    editProductForm.addEventListener("input", function () {
        validateForm();
    });

    editProductForm.addEventListener("submit", function (event) {
        console.log("Form submitted",productId);
        event.preventDefault();
        saveProductChanges(productId);
    });
});

// Fetch Product Details
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/product/${productId}`);
        if (!response.ok) throw new Error("Failed to fetch product details");

        const product = await response.json();
        populateProductForm(product);
    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}

// Populate Form Fields with Product Data
function populateProductForm(product) {
    document.getElementById("productName").value = product.brand;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.cost;
    document.getElementById("productDiscount").value = product.discount;
    document.getElementById("productCategory").value = product.category.id;

    // Display Images Horizontally
    const productImages = document.getElementById("productImages");
    productImages.innerHTML = ""; // Clear previous images
    const images = [product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean);
    
    images.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.alt = "Product Image";
        imgElement.classList.add("product-image");
        productImages.appendChild(imgElement);
    });

    validateForm(); // Check form validation after filling
}

// Validate Form & Enable/Disable Save Button
function validateForm() {
    const inputs = document.querySelectorAll("#editProductForm input, #editProductForm textarea");
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });

    document.getElementById("errorMessage").style.display = isValid ? "none" : "block";
    document.getElementById("errorMessage").innerText = isValid ? "" : "All fields must be filled!";
    document.getElementById("saveButton").disabled = !isValid;
}

// Save Updated Product Data
async function saveProductChanges(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    const product = {
        productId: productId,
        brand: document.getElementById("productName").value,
        description: document.getElementById("productDescription").value,
        cost: document.getElementById("productPrice").value,
        discount: document.getElementById("productDiscount").value,
        category: { id: document.getElementById("productCategory").value }
    };
console.log("Product:", product);
    try {
        const response = await fetch(`http://localhost:8080/api/merchant/updateproduct`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error("Failed to update product");

        alert("Product updated successfully");
        window.location.href = "../Pages/MerchantProductsList.html";
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Failed to update product");
    }
}
