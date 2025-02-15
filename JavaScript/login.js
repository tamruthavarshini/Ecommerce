// document.addEventListener('DOMContentLoaded', function() {
//     console.log('Login script loaded');

//     // Check if user is already logged in
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) {
//         updateHeader(user.username);
//     }

//     // document.getElementById('loginForm').addEventListener('submit', function(event) {
//     //     event.preventDefault();
        
//     //     console.log('Form submitted');

//     //     const username = document.getElementById('username').value;
//     //     const password = document.getElementById('password').value;

//     //     const loginData = {
//     //         username,
//     //         password
//     //     };

//     //     console.log('Login Data:', loginData);

//     //     fetch('http://localhost:8080/api/auth/authenticate', {
//     //         method: 'POST',
//     //         headers: {
//     //             'Content-Type': 'application/json'
//     //         },
//     //         body: JSON.stringify(loginData)
//     //     })
//     //     .then(response => {
//     //         console.log('Raw Response:', response);
//     //         return response.json().then(data => ({ status: response.status, body: data }));
//     //     })
//     //     .then(({ status, body }) => {
//     //         console.log('Response Status:', status);
//     //         console.log('Response Body:', body);
//     //         if (status === 400) {
//     //             displayError(body.Message || 'Invalid username or password');
//     //         } else if (status === 200) {
//     //             console.log('Login Successful:', body.Message);
//     //             localStorage.setItem('user', JSON.stringify(body));
//     //             updateHeader(body.username);
//     //             document.getElementById('loginForm').style.display = 'none';
//     //             const lastBrowsedUrl = localStorage.getItem('lastBrowsedUrl') || 'index.html';
//     //             window.location.href = lastBrowsedUrl;
//     //         } else {
//     //             displayError('An unexpected error occurred');
//     //         }
//     //     })
//     //     .catch(error => {
//     //         console.error('Error:', error);
//     //         displayError('An unexpected error occurred');
//     //     });
//     // });
//     document.getElementById('loginForm').addEventListener('submit', function (event) {
//         event.preventDefault();
    
//         console.log('Form submitted');
    
//         const username = document.getElementById('username').value;
//         const password = document.getElementById('password').value;
    
//         const loginData = { username, password };
    
//         console.log('Login Data:', loginData);
    
//         fetch('http://localhost:8080/api/auth/authenticate', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(loginData)
//         })
//         .then(response => response.json().then(data => ({ status: response.status, body: data })))
//         .then(({ status, body }) => {
//             console.log('Response Status:', status);
//             console.log('Response Body:', body);
    
//             if (status === 400) {
//                 displayError(body.Message || 'Invalid username or password');
//             } else if (status === 200) {
//                 console.log('Login Successful:', body.Message);
    
//                 // Extract token and parse expiration
//                 const token = body.accessToken;
//                 if (token) {
//                     const decodedToken = parseJwt(token);
//                     const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    
//                     // Store token with expiration
//                     localStorage.setItem('authToken', JSON.stringify({ token, expiryTime }));
    
//                     // Store user details separately
//                     const userDetails = {
//                         username: body.username,
//                         email: body.email,
//                         name: body.name,
//                         phone: body.phone,
//                         address: body.address,
//                         role: body.role
//                     };
//                     localStorage.setItem('userDetails', JSON.stringify(userDetails));
    
//                     // Update UI and Redirect
//                     updateHeader(body.username);
//                     document.getElementById('loginForm').style.display = 'none';
//                     const lastBrowsedUrl = localStorage.getItem('lastBrowsedUrl') || 'index.html';
//                     window.location.href = lastBrowsedUrl;
//                 } else {
//                     displayError('Token not received');
//                 }
//             } else {
//                 displayError('An unexpected error occurred');
//             }
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             displayError('An unexpected error occurred');
//         });
//     });
    
//     // Function to parse JWT
//     function parseJwt(token) {
//         try {
//             return JSON.parse(atob(token.split(".")[1]));
//         } catch (e) {
//             return null;
//         }
//     }
    
//     // Function to get a valid token
//     function getValidToken() {
//         const storedData = localStorage.getItem('user').auth;
//         if (!storedData) return null;
    
//         const { token, expiryTime } = JSON.parse(storedData);
//         if (Date.now() > expiryTime) {
//             localStorage.removeItem('user');
//             //localStorage.removeItem('userDetails'); // Clear user details if token expires
//             return null; // Token expired
//         }
//         return token;
//     }
    
//     // Automatically remove expired tokens
//     setInterval(() => getValidToken(), 60000); // Check every 1 min
    
//     function displayError(message) {
//         let errorElement = document.getElementById('error-message');
//         if (!errorElement) {
//             errorElement = document.createElement('div');
//             errorElement.id = 'error-message';
//             errorElement.style.color = 'red';
//             document.querySelector('.login-box').appendChild(errorElement);
//         }
//         errorElement.textContent = message;
//     }

//     function updateHeader(username) {
//         const headerRight = document.querySelector('.header-right');
//         const loginLink = headerRight.querySelector('a[href="login.html"]');

//         if (loginLink) {
//             loginLink.innerHTML = `<i class="bi bi-person"></i> ${username}`;
//             loginLink.id = 'user-link';
//             loginLink.href = '#';
//             loginLink.addEventListener('click', function() {
//                 showUserDetails();
//             });
//         }
//     }

//     function showUserDetails() {
//         window.location.href = 'profile.html';
//     }

//     function logout() {
//         localStorage.removeItem('user');
//         window.location.href = 'index.html';
//     }
// });
document.addEventListener('DOMContentLoaded', function () {
    console.log('Login script loaded');

    // Check if the user is already logged in
    const user = getValidUser();
    if (user) {
        updateHeader(user.username);
    }

    // Handle login form submission
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log('Form submitted');

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const loginData = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/auth/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();
            console.log('Response:', data);

            if (response.status === 400) {
                displayError(data.Message || 'Invalid username or password');
                return;
            } 

            if (response.status === 200 && data.accessToken) {
                console.log('Login Successful:', data.Message);

                // Extract token expiry time
                const decodedToken = parseJwt(data.accessToken);
                const expiryTime = decodedToken ? decodedToken.exp * 1000 : Date.now() + 3600000; // Default 1 hour if missing

                // Store only `user` in localStorage with expiry time
                const user = {
                    username: data.username,
                    email: data.email,
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    role: data.role,
                    accessToken: data.accessToken,
                    expiryTime: expiryTime
                };
                localStorage.setItem('user', JSON.stringify(user));

                // Update UI and Redirect
                updateHeader(user.username);
                document.getElementById('loginForm').style.display = 'none';
                const lastBrowsedUrl = localStorage.getItem('lastBrowsedUrl') || 'index.html';
                window.location.href = lastBrowsedUrl;
            } else {
                displayError('An unexpected error occurred');
            }
        } catch (error) {
            console.error('Error:', error);
            displayError('An unexpected error occurred');
        }
    });

    // Function to parse JWT and extract payload
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return null;
        }
    }

    // Function to get a valid user from localStorage
    function getValidUser() {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return null;

        const user = JSON.parse(storedUser);
        if (Date.now() > user.expiryTime) {
            localStorage.removeItem('user'); // Clear expired user
            return null;
        }
        return user;
    }

    // Automatically remove expired users every 1 minute
    setInterval(() => getValidUser(), 60000);

    function displayError(message) {
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.style.color = 'red';
            document.querySelector('.login-box').appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function updateHeader(username) {
        const headerRight = document.querySelector('.header-right');
        const loginLink = headerRight.querySelector('a[href="login.html"]');

        if (loginLink) {
            loginLink.innerHTML = `<i class="bi bi-person"></i> ${username}`;
            loginLink.id = 'user-link';
            loginLink.href = '#';
            loginLink.addEventListener('click', showUserDetails);
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
