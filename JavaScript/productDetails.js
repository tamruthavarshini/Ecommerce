document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");
    const categoryId = params.get("category");

    if (productId) {
        console.log("productId Selected:", productId);
// document.getElementById("text-center").textContent = `Products for ${productId}`;
// document.getElementById("text-center").textContent = `Products for ${productId}`;
// document.getElementById("text-center").textContent = `Products for ${productId}`;
// document.getElementById("text-center").textContent = `Products for ${productId}`;
// document.getElementById("text-center").textContent = `Products for ${productId}`;
    }

    if (categoryId) {
        console.log("categoryId Selected:", categoryId);
    }

    if (productId) {
        fetchProductDetails(productId, categoryId);
        fetchSimilarProducts(categoryId, productId);
    }

    // Store the current URL as the last browsed URL
    localStorage.setItem('lastBrowsedUrl', window.location.href);

});

function fetchProductDetails(productId, categoryId) {
    console.log("Fetching products for productId:", productId);
    fetch(`http://localhost:8080/api/products/${categoryId}/${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log("API response:", data);
            if (data && typeof data === 'object') {
                displayProductDetails(data, categoryId);
            } else {
                console.error("Expected an object but got:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}
function fetchSimilarProducts(categoryId, productId) {
    console.log("Fetching similar products for categoryId:", categoryId);
    fetch(`http://localhost:8080/api/products/similar/${categoryId}/${productId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Similar products response:", data);
            if (Array.isArray(data)) {
                displaySimilarProducts(data);
            } else {
                console.error("Expected an array but got:", data);
            }
        })
        .catch(error => {
            console.error("Error fetching similar products:", error);
        });
}


function displayProductDetails(product, categoryId) {
    const productsWrapper = document.getElementById("product-wrapper");
    const productsList = document.createElement("div");
    productsList.classList.add("product");
    productsWrapper.appendChild(productsList);

    const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
    const allImages = [product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean);
    let selectedImage = allImages[0];

    const thumbnailsContainer = document.createElement("div");
    thumbnailsContainer.classList.add("product-thumbnails");

    const selectedImageContainer = document.createElement("div");
    selectedImageContainer.classList.add("product-image-selected");

    function setSelectedImage(img) {
        selectedImage = img;
        selectedImageElement.src = `${selectedImage}`;
        updateThumbnails();
    }

    function updateThumbnails() {
        thumbnailsContainer.querySelectorAll("img").forEach(thumbnail => {
            thumbnail.classList.toggle("selected-thumbnail", thumbnail.src.includes(selectedImage));
        });
    }

    allImages.forEach((img, index) => {
        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = `${img}`;
        thumbnailImage.alt = product.brand;
        thumbnailImage.classList.add("thumbnail-image");
        if (img === selectedImage) {
            thumbnailImage.classList.add("selected-thumbnail");
        }
        thumbnailImage.addEventListener("click", () => setSelectedImage(img));
        thumbnailsContainer.appendChild(thumbnailImage);
    });

    const selectedImageElement = document.createElement("img");
    selectedImageElement.src = `${selectedImage}`;
    selectedImageElement.alt = product.brand;
    selectedImageElement.classList.add("selected-image");
    selectedImageContainer.appendChild(selectedImageElement);

    productsList.appendChild(thumbnailsContainer);
    productsList.appendChild(selectedImageContainer);

    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

    const productBrand = document.createElement("h2");
    productBrand.classList.add("product-brand");
    productBrand.textContent = product.brand;

    const productDescription = document.createElement("p");
    productDescription.classList.add("product-description");
    productDescription.textContent = product.description;

    const line=document.createElement("hr");
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

    const taxIncluded = document.createElement("p");
    taxIncluded.classList.add("tax-included");
    taxIncluded.textContent = "Inclusive of all taxes";

    productDetails.appendChild(productBrand);
    productDetails.appendChild(productDescription);
    productDetails.appendChild(line);
    productDetails.appendChild(productPrice);
    productDetails.appendChild(taxIncluded);

    const variantList = product.variants.split(',').map(variant => variant.trim());
    let selectedVariant = null;
    if (variantList.length > 0) {
        const productVariants = document.createElement("div");
        productVariants.classList.add("product-variants");

        const sizeText = document.createElement("h3");
        sizeText.classList.add("size-text");
        sizeText.textContent = "Select Size:";

        const variantCircles = document.createElement("div");
        variantCircles.classList.add("variant-circles");

        variantList.forEach((variant, index) => {
            const variantCircle = document.createElement("div");
            variantCircle.classList.add("variant-circle");
            variantCircle.textContent = variant;
            variantCircle.addEventListener("click", () => {
                selectedVariant = variant;
                document.querySelectorAll(".variant-circle").forEach(circle => {
                    circle.classList.remove("selected-variant");
                });
                variantCircle.classList.add("selected-variant");
                checkVariantInCart(product.productId, selectedVariant,cartText);
            });
            variantCircles.appendChild(variantCircle);
        });

        productVariants.appendChild(sizeText);
        productVariants.appendChild(variantCircles);
        productDetails.appendChild(productVariants);
    }



    const wishlistOption = document.createElement("a");
    wishlistOption.classList.add("wishlist-option");
    wishlistOption.href = "#";
    const favoriteIcon = document.createElement("span");
    favoriteIcon.textContent = "♥";
    const wishlistText = document.createElement("span");
    wishlistText.textContent = "Add to favorites";
    wishlistOption.appendChild(favoriteIcon);
    wishlistOption.appendChild(wishlistText);

    checkWishlistStatus(product.productId, wishlistText);

    wishlistOption.addEventListener("click", function (event) {
        event.preventDefault();
        toggleWishlist(product.productId, wishlistText);
    });

    const cartOption = document.createElement("a");
    cartOption.classList.add("cart-option");
    cartOption.href = `../Pages/cart.html`;
    const cartIcon = document.createElement("span");
    cartIcon.textContent = "🛒";
    const cartText = document.createElement("span");
    cartText.textContent = "Add to cart";
    cartOption.appendChild(cartIcon);
    cartOption.appendChild(cartText);

    checkCartStatus(product.productId, cartText,selectedVariant);

    cartOption.addEventListener("click", function(event) {
        event.preventDefault();
        toggleCart(product.productId, cartText, selectedVariant);
    });

    productDetails.appendChild(wishlistOption);
    productDetails.appendChild(cartOption);
    productsList.appendChild(productDetails);
}

function displaySimilarProducts(products) {
    const similarProductsWrapper = document.getElementById("similar-products-wrapper");
    similarProductsWrapper.innerHTML = ''; // Clear previous content

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("similar-product-card");

        const productLink = document.createElement("a");
        productLink.href = `../Pages/productDetails.html?product=${encodeURIComponent(product.productId)}&category=${encodeURIComponent(product.category.id)}`;
        productLink.classList.add("product-link");

        const productImage = document.createElement("img");
        productImage.src = product.image1;
        productImage.alt = product.productId;
        productImage.classList.add("similar-product-image");

        const productBrand = document.createElement("p");
        productBrand.classList.add("similar-product-name");
        productBrand.textContent = product.brand;

        const productDescription = document.createElement("p");
        productDescription.classList.add("similar-product-description");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.classList.add("similar-product-cost");
        const discountedPrice = (product.cost - (product.cost * product.discount) / 100).toFixed(0);
        productPrice.textContent = `Rs.${discountedPrice}`;

        productLink.appendChild(productImage);
        productLink.appendChild(productBrand);
        productLink.appendChild(productDescription);
        productLink.appendChild(productPrice);

        productCard.appendChild(productLink);
        similarProductsWrapper.appendChild(productCard);
    });
}




async function toggleWishlist(productId, wishlistBtn) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.accessToken) {
        window.location.href = 'login.html';
        return;
    }

    const isAdding = wishlistBtn.dataset.wishlist === "false";
    const url = isAdding
        ? 'http://localhost:8080/api/wishlist/add'
        : `http://localhost:8080/api/wishlist/delete/${productId}`;
    const method = isAdding ? 'POST' : 'DELETE';
    const body = isAdding ? JSON.stringify({ productId }) : null;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.accessToken}`
            },
            body
        });

        if (!response.ok) throw new Error("Failed to update wishlist.");

        wishlistBtn.dataset.wishlist = isAdding ? "true" : "false";
        wishlistBtn.textContent = isAdding ? "Added to Favorites" : "Add to Favorites";
    } catch (error) {
        console.error("Wishlist error:", error);
        alert("Failed to update wishlist.");
    }
}

async function checkWishlistStatus(productId, wishlistBtn) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/wishlist/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch wishlist data");

        const data = await response.json();
        console.log("Wishlist data received:", data);

        const isProductInWishlist = Array.isArray(data) &&
            data.some(item => item?.productId?.productId?.toString() === productId.toString());

        wishlistBtn.dataset.wishlist = isProductInWishlist ? "true" : "false";
        wishlistBtn.textContent = isProductInWishlist ? "Added to Favorites" : "Add to Favorites";
    } catch (error) {
        console.error("Error checking wishlist:", error);
    }
}

async function toggleCart(productId, cartText, selectedVariant) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.accessToken) {
        //alert("Please log in to manage your cart.");
        window.location.href = 'login.html'; // Redirect to login page
        return;
    }

    if (cartText.textContent === "Add to cart") {
        if (!selectedVariant) {
            alert("Please select a variant.");
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
            //alert("Product added to cart!");
            cartText.textContent = "Go to cart";
        })
        .catch(error => {
            console.error("Error adding to cart:", error);
            alert("Failed to add product to cart.");
        });
    } else {
        window.location.href = 'cart.html';
    }
}

async function checkCartStatus(productId, cartText, selectedVariant) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/cartitems/get", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch cart data");

        const data = await response.json();
        console.log("Cart data received:", data);

        const isProductInCart = Array.isArray(data) &&
            data.some(item => {
                console.log("Checking item:", item); // Debugging log
                const itemProductId = item?.product?.productId || item?.productId; // Adjust for API response structure
                return itemProductId?.toString() === productId.toString();
            });
        cartText.textContent = isProductInCart ? "Go to cart" : "Add to cart";
    } catch (error) {
        console.error("Error checking cart status:", error);
    }
}
async function checkVariantInCart(productId, selectedVariant, cartText) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.accessToken) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cartitems/check?productId=${productId}&variant=${selectedVariant}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Failed to check cart data");

        const data = await response.json();
        console.log("Cart check response:", data);

        if (data.Message === "Yes") {
            cartText.textContent = "Go to cart";
        } else {
            cartText.textContent = "Add to cart";
        }
    } catch (error) {
        console.error("Error checking variant in cart:", error);
    }
}