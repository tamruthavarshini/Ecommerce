document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup script loaded');

    document.getElementById('signupForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log('Form submitted');

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const gender = document.getElementById('gender').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            displayError('Passwords do not match');
            return;
        }

        const signupData = {
            name,
            phone,
            address,
            email,
            gender,
            username,
            password
        };

        console.log('Signup Data:', signupData);

        fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        })
        .then(response => {
            console.log('Raw Response:', response);
            return response.json().then(data => ({ status: response.status, body: data }));
        })
        .then(({ status, body }) => {
            console.log('Response Status:', status);
            console.log('Response Body:', body);
            if (status === 400) {
                displayError(body.Message || 'Email or Username is already in use');
            } else if (status === 200) {
                console.log('Sign Up Successful:', body.Message);
                displaySuccess('Sign Up Successful! Go to Login');
                document.getElementById('signupForm').style.display = 'none';
            } else {
                displayError('An unexpected error occurred');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('An unexpected error occurred');
        });
    });

    function displayError(message) {
        let errorElement = document.getElementById('error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.style.color = 'red';
            document.querySelector('.signup-box').appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function displaySuccess(message) {
        let successElement = document.getElementById('success-message');
        if (!successElement) {
            successElement = document.createElement('div');
            successElement.id = 'success-message';
            successElement.style.color = 'green';
            document.querySelector('.signup-box').appendChild(successElement);
        }
        successElement.textContent = message;

        // Create "Go to Login" link
        const loginLink = document.createElement('a');
        loginLink.href = 'login.html';
        loginLink.textContent = 'Go to Login';
        loginLink.style.display = 'block';
        loginLink.style.marginTop = '10px';
        loginLink.style.color = 'blue';
        loginLink.style.textDecoration = 'underline';
        successElement.appendChild(loginLink);
    }
});