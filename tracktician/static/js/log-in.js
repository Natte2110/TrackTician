/**
 * @file Manages user logins from the flask backend responses.
 * @author Nathan Parsley <natteparsley@gmail.com>
 * @copyright Nathan Parsley 2024
 */
$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        $.ajax({
            url: '/log-in',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val()
            }),
            success: function (data) {
                if (data.success) {
                    // Login successful, redirect or do something else
                    console.log('Login successful');
                    location.replace('/');
                } else {
                    // Login failed, display error message
                    console.error('Login failed:', data.message);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});
