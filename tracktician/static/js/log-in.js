/**
 * @file Manages user logins from the flask backend responses.
 * @author Nathan Parsley <natteparsley@gmail.com>
 * @copyright Nathan Parsley 2024
 */
$(document).ready(function () {

    const passwordVisibility = () => {
        if ($("#password").attr("type") === "password") {
            $("#password").attr("type", "text");
            $("#show-password").addClass("d-none");
            $("#hide-password").removeClass("d-none");
        } else {
            $("#password").attr("type", "password");
            $("#hide-password").addClass("d-none");
            $("#show-password").removeClass("d-none");
        }
    };

    $("#show-password").click(function () {
        passwordVisibility();
    });
    $("#hide-password").click(function () {
        passwordVisibility();
    });

    const confirmPasswordVisibility = () => {
        if ($("#confirm-password").attr("type") === "password") {
            $("#confirm-password").attr("type", "text");
            $("#show-confirm-password").addClass("d-none");
            $("#hide-confirm-password").removeClass("d-none");
        } else {
            $("#confirm-password").attr("type", "password");
            $("#hide-confirm-password").addClass("d-none");
            $("#show-confirm-password").removeClass("d-none");
        }
    };
    
    $("#show-confirm-password").click(function () {
        confirmPasswordVisibility();
    });
    $("#hide-confirm-password").click(function () {
        confirmPasswordVisibility();
    });
    
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
                    $('#login-error').text(data.message);
                    $('#login-error').show();
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    });
});
