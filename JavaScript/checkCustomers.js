document.addEventListener('DOMContentLoaded', async function() {
    const params = new URLSearchParams(window.location.search);
    const customerId = params.get('customer');

    if (!customerId) {
        alert("Customer ID not found in URL.");
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.accessToken) {
        alert("Please log in to view customer details.");
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/merchant/customerdetails?userId=${customerId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch customer details');
        }

        const customer = await response.json();
        displayCustomerDetails(customer);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Failed to load customer details.');
    }
});

function displayCustomerDetails(customer) {
    console.log(customer);
    const customerDetails = document.getElementById('customerDetails');
    customerDetails.innerHTML = `
        <p><strong>Name:</strong> ${customer.name}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        <p><strong>Phone:</strong> ${customer.phoneNumber}</p>
        <p><strong>Address:</strong> ${customer.address}</p>
    `;
}

function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
    }
    return false;
}