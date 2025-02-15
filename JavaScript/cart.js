document.addEventListener("DOMContentLoaded", () => {
    loadCartItems();
});

async function loadCartItems() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const token = user.accessToken;
    try {
        const response = await fetch("http://localhost:8080/api/cartitems/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch cart data");
        }

        const data = await response.json();

        const cartContainer = document.getElementById("cart-container");
        const cartTotalContainer = document.getElementById("cart-total-container");
        cartContainer.innerHTML = ""; // Clear previous content
        cartTotalContainer.innerHTML = ""; // Clear previous total

        let totalCartCost = 0; // Total product cost
        const deliveryCharges = 50; // Fixed delivery charge

        if (Array.isArray(data) && data.length > 0) {
            data.forEach(item => {
                if (!item.product) return; // Skip invalid entries
                const product = item.product;
                const selectedVariant = item.variant || (product.variants.length > 0 ? product.variants[0] : "Default");

                const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
                totalCartCost += item.quantity * discountedPrice; // Add to total cost

                const imageUrl = `http://localhost:8080/api/images/products/${product.image1}.png`;
                const cartItem = document.createElement("div");
                cartItem.classList.add("cart-item");
                cartItem.innerHTML = `
                    <a href="productDetails.html?product=${product.productId}&category=${product.category.id}" class="cart-item-link">
                        <img src="${imageUrl}" alt="${product.description}" class="cart-image">
                    </a>
                    <div class="cart-details">
                        <h3>
                            <a href="productDetails.html?product=${product.productId}&category=${product.category.id}" class="cart-item-link">
                                ${product.brand}
                            </a>
                        </h3>
                        <p>
                            <a href="productDetails.html?product=${product.productId}&category=${product.category.id}" class="cart-item-link">
                                ${product.description}
                            </a>
                        </p>
                        <p class="price">₹${discountedPrice} 
                            <span class="original-price">₹${product.cost}</span> 
                            <span class="discount">(${product.discount}% off)</span>
                        </p>

                        <label for="variant-${product.productId}">Variant:</label>
                        <select id="variant-${product.productId}" class="variant-dropdown" 
                            onchange="updateCartItemVariant('${product.productId}', this.value, ${item.quantity})">
                            ${generateVariantOptions(product.variants, item.variant)}
                        </select>

                        <label for="quantity-${product.productId}">Quantity:</label>
                        <select id="quantity-${product.productId}" class="quantity-dropdown" 
                            onchange="updateCartItemQuantity('${product.productId}', this.value, '${item.variant}')">
                            ${generateQuantityOptions(item.quantity)}
                        </select>
                    </div>
                    <div class="cart-button-container">
                        <button class="btn btn-danger" onclick="removeFromCart('${product.productId}')">Remove</button>
                    </div>
                `;

                cartContainer.appendChild(cartItem);
            });

            updateCartTotal(totalCartCost, deliveryCharges);

            // **Checkout Button Below the Cost**
            const checkoutButton = document.createElement("button");
            checkoutButton.textContent = "Proceed to Checkout";
            checkoutButton.classList.add("btn", "btn-success", "checkout-btn");
            checkoutButton.onclick = proceedToCheckout;

            // Append checkout button below cart total
            cartTotalContainer.appendChild(checkoutButton);
        } else {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            updateCartTotal(0, deliveryCharges); // Show default total
        }
    } catch (error) {
        console.error("Error loading cart:", error);
    }
}
function updateCartTotal(totalCost, deliveryCharges) {
    const cartTotalContainer = document.getElementById("cart-total-container");

    if (!cartTotalContainer) {
        console.error("Cart total container not found");
        return;
    }

    const finalAmount = totalCost + deliveryCharges;
    
    // Store the final amount in local storage
    localStorage.setItem('totalCost', finalAmount);

    cartTotalContainer.innerHTML = `
        <div class="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: <span class="cost">₹${totalCost}</span></p>
            <p>Delivery Charges: <span class="cost">₹${deliveryCharges}</span></p>
            <h4>Total: <span class="cost">₹${finalAmount}</span></h4>
            
        </div>
    `;
}


// Checkout function
function proceedToCheckout() {
    const totalCost = document.querySelector(".cart-summary .cost:last-child").textContent.replace('₹', '');
    localStorage.setItem('totalCost', totalCost);

    // Redirect to the checkout page
    window.location.href = "checkout.html";
}




function generateVariantOptions(variants, selectedVariant) {
    if (typeof variants === "string") {
        variants = variants.split(",").map(v => v.trim()); // Convert to an array and trim spaces
    } else if (!Array.isArray(variants)) {
        console.warn("Variants is not an array or string, setting to empty array:", variants);
        variants = [];
    }

    return variants.map(variant => 
        `<option value="${variant}" ${variant === selectedVariant ? "selected" : ""}>${variant}</option>`
    ).join('');
}


function generateQuantityOptions(selectedQuantity) {
    let options = "";
    for (let i = 1; i <= 10; i++) {
        options += `<option value="${i}" ${i === selectedQuantity ? "selected" : ""}>${i}</option>`;
    }
    return options;
}
async function updateCartItemQuantity(productId, newQuantity, selectedVariant) {
    console.log("Updating cart item quantity:", productId, newQuantity, selectedVariant);
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    const requestBody = {
        productId: parseInt(productId, 10),  
        quantity: parseInt(newQuantity, 10), 
        variant: selectedVariant || "Default"
    };

    console.log("Sending request:", requestBody); 

    try {
        const response = await fetch("http://localhost:8080/api/cartitems/updateQuantity", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify(requestBody)
        });

        const responseData = await response.json();
        console.log("Response Data:", responseData);
        
        if (!response.ok) {
            throw new Error(`Failed to update cart item quantity: ${responseData.message}`);
        }
        console.log("Cart quantity updated successfully");

        loadCartItems(); 
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
    }
}

async function updateCartItemVariant(productId, newVariant, selectedQuantity) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        console.warn("User not authenticated");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/cartitems/updateVariant", {
            method: "PUT",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`,
            },
            body: JSON.stringify({ 
                productId, 
                variant: newVariant, 
                quantity: selectedQuantity || 1 
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update cart item variant");
        }
        console.log("Cart variant updated successfully");

        loadCartItems();
    } catch (error) {
        console.error("Error updating cart item variant:", error);
    }
}
window.updateCartItemQuantity = updateCartItemQuantity;
window.updateCartItemVariant = updateCartItemVariant;


async function removeFromCart(productId) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cartitems/delete/${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.accessToken}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to remove item from cart`);
        }

        loadCartItems(); // Refresh cart after deletion
    } catch (error) {
        console.error("Error removing cart item:", error);
    }
}
