document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        const profileDetails = document.getElementById('profileDetails');
        profileDetails.innerHTML = `
            <p><strong>Username:</strong> ${user.username}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Address:</strong> ${user.address}</p>
        `;
        if (user.role === 'Merchant') {
            document.getElementById('merchantOptions').style.display = 'block';
        }
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById('logoutButton').addEventListener('click', function() {
        localStorage.removeItem('user');
        localStorage.removeItem('lastBrowsedUrl'); // Remove last browsed URL from local storage
        window.location.href = 'index.html'; // Redirect to index page
    });
});

function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
    }
    return false;
}
function navigateToMerchantProductsList() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page") || 0;
    const size = params.get("size") || 10;

    window.location.href = `../Pages/MerchantProductsList.html?page=${page}&size=${size}`;
}