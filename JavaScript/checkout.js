document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.address) {
        document.getElementById('address').value = user.address;
    }

    // Retrieve the total cost from local storage
    let totalCost = localStorage.getItem('totalCost');
    if (totalCost) {
        totalCost = parseFloat(totalCost) + 50; // Add 50 to the total cost
        localStorage.setItem('totalCost', totalCost); // Update the total cost in local storage
        document.getElementById('totalCost').textContent = `$${totalCost.toFixed(2)}`;
    }


    document.getElementById('paymentMethod').addEventListener('change', function() {
        const paymentDetails = document.getElementById('paymentDetails');
        paymentDetails.innerHTML = '';
        switch (this.value) {
            case 'creditCard':
            case 'debitCard':
                paymentDetails.innerHTML = `
                    <label for="cardName">Name on Card:</label>
                    <input type="text" id="cardName" name="cardName" required>
                    <label for="cardNumber">Card Number:</label>
                    <input type="text" id="cardNumber" name="cardNumber" required>
                    <label for="expMonth">Exp Month:</label>
                    <input type="text" id="expMonth" name="expMonth" required>
                    <label for="expYear">Exp Year:</label>
                    <input type="text" id="expYear" name="expYear" required>
                    <label for="cvv">CVV:</label>
                    <input type="text" id="cvv" name="cvv" required>
                `;
                break;
            case 'paypal':
                paymentDetails.innerHTML = `
                    <label for="paypalEmail">PayPal Email:</label>
                    <input type="email" id="paypalEmail" name="paypalEmail" required>
                `;
                break;
            case 'netBanking':
                paymentDetails.innerHTML = `
                    <label for="bankName">Bank Name:</label>
                    <input type="text" id="bankName" name="bankName" required>
                    <label for="accountNumber">Account Number:</label>
                    <input type="text" id="accountNumber" name="accountNumber" required>
                    <label for="ifsc">IFSC Code:</label>
                    <input type="text" id="ifsc" name="ifsc" required>
                `;
                break;
            default:
                paymentDetails.innerHTML = '';
        }
        paymentDetails.style.display = this.value ? 'block' : 'none';
    });

    document.getElementById('checkoutForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const address = document.getElementById('address').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        const token = user.accessToken;

        try {
            const response = await fetch('http://localhost:8080/api/order/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ address })


            });

            if (response.ok) {
                // Remove the total cost from local storage
                localStorage.removeItem('totalCost');

                document.querySelector('.checkout-container').innerHTML = `
                    <h2>Order Placed Successfully!</h2>
                    <p>Thank you for your purchase. Your order has been placed successfully.</p>
                    <a href="index.html" class="continue-shopping">Continue Shopping</a>
                `;
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        }
    });
});

function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
    }
    return false;
}