document.addEventListener("DOMContentLoaded", () => {
    loadWishlistItems();
});

async function loadWishlistItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    try {
        const response = await fetch("http://localhost:8080/api/wishlist/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch wishlist data");
        }

        const data = await response.json();
        console.log("Wishlist data:", data);

        const wishlistContainer = document.getElementById("wishlist-container");
        wishlistContainer.innerHTML = ""; // Clear previous content

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                
                if (!item.productId) return; // Skip invalid entries

                const product = item.productId;
                const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
                const wishlistItem = document.createElement("div");
                wishlistItem.classList.add("wishlist-item");

                wishlistItem.innerHTML = `
                    <img src="${product.image1}" alt="${product.description}" class="wishlist-image">
                    <div class="wishlist-details">
                        <h3>${product.brand}</h3>
                        <p>${product.description}</p>
                        <p class="price">₹${discountedPrice} 
                            <span class="original-price">₹${product.cost}</span> 
                            <span class="discount">(${product.discount}% off)</span>
                        </p>
                    </div>
                    <div class="wishlist-button-container">
                        <button class="btn btn-primary add-to-cart-btn" 
                                onclick="toggleCart('${product.productId}', 1, 'S', event)">
                            Add to Cart
                        </button>
                    </div>`;

                // Prevent click event on "Add to Cart" from triggering navigation
                wishlistItem.addEventListener("click", (event) => {
                    if (!event.target.classList.contains("add-to-cart-btn")) {
                        window.location.href = `productDetails.html?product=${product.productId}&category=${product.category.id}`;
                    }
                });

                wishlistContainer.appendChild(wishlistItem);
            });
        } else {
            wishlistContainer.innerHTML = "<p>No items in your wishlist.</p>";
        }
    } catch (error) {
        console.error("Error loading wishlist:", error);
    }
}

async function toggleCart(productId, cartText, selectedVariant) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert("Please log in to manage your cart.");
        return;
    }

    
        const quantity = 1; 

        fetch('http://localhost:8080/api/cartitems/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ productId, quantity, variant: selectedVariant })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Cart response:", data);
            alert("Product added to cart!");
            cartText.textContent = "Go to cart";
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart.");
        });
    
}

