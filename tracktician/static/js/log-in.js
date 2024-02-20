/**
 * @file Manages user logins from the flask backend responses.
 * @author Nathan Parsley <natteparsley@gmail.com>
 * @copyright Nathan Parsley 2024
 */
$(document).ready(function () {
    $('#login-form').submit(function (event) {
        event.preventDefault();

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
                    location.replace('/');
                } else {
                    $('#login-error').text(data.message)
                    $('#login-error').show()
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});
