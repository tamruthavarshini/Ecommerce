document.addEventListener('DOMContentLoaded', function() {
    console.log('Header script loaded');

    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateHeader(user.username);
    }

    function updateHeader(username) {
        const headerRight = document.querySelector('.header-right');
        const loginLink = headerRight.querySelector('a[href="login.html"]');

        if (loginLink) {
            loginLink.innerHTML = `<i class="bi bi-person"></i> ${username}`;
            loginLink.id = 'user-link';
            loginLink.href = '#';
            loginLink.addEventListener('click', function() {
                showUserDetails();
            });
        }
    }

    function showUserDetails() {
        window.location.href = 'profile.html';
    }

    function logout() {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    }
});
function handleSearch() {
    const searchInput = document.getElementById("searchInput").value.trim();
    if (searchInput) {
        window.location.href = `search.html?query=${encodeURIComponent(searchInput)}`;
        return false; // Prevents form submission
    }
    return false; // Prevents redirection if input is empty
}