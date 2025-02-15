document.addEventListener('DOMContentLoaded', async function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert("Please log in to view your orders.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/order/myorders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const orders = await response.json();
        console.log(orders);
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders.');
    }
});

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';

    if (orders.length === 0) {
        ordersList.innerHTML = '<p>No orders found.</p>';
        return;
    }

    orders.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const formattedDate = `${orderDate.getDate()}/${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
        const price = (order.product.cost * order.quantity).toFixed(2);
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        const productImage = document.createElement('img');
        const imageUrl = `http://localhost:8080/api/images/products/${order.product.image1}.png`;
        productImage.src = imageUrl; // Assuming image1 is the main product image
        productImage.alt = order.product.brand;
        productImage.classList.add('product-image');

        const orderDetails = document.createElement('div');
        orderDetails.classList.add('order-details');

        orderDetails.innerHTML = `
            
            <p><strong>Product Name:</strong> ${order.product.brand}: ${order.product.description}</p>
            <p><strong>Size:</strong> ${order.variant}</p>
            <p><strong>Quantity:</strong> ${order.quantity}</p>
            <p><strong>Price:</strong> ₹${price}</p>
            <p><strong>Placed Date:</strong> ${formattedDate}</p>
            <p><strong>Order ID:</strong> ${order.status}</p>
        `;

        orderCard.appendChild(productImage);
        orderCard.appendChild(orderDetails);
        const orderLink = document.createElement('a');
        orderLink.classList.add('order-link');
        orderLink.href = `productDetails.html?product=${order.product.productId}&category=${order.product.category.id}`;
        orderLink.appendChild(orderCard);
        ordersList.appendChild(orderLink);
    });
}

function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
    }
    return false;
}