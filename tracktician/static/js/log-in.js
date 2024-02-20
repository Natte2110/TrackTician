document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    fetch('/log-in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Login successful, redirect or do something else
                console.log('Login successful');
                location.replace('/')
            } else {
                // Login failed, display error message
                console.error('Login failed:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});