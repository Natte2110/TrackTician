$(document).ready(function () {
    $('#session-table').DataTable();
    $('#session-table').on('click', '.simulate-race-button', function() {
        let sessionID = $(this).attr('id');
        
        console.log('Clicked button id:', sessionID);
        $.ajax({
            url: '/simulate-race',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sessionID: sessionID,
            }),
            success: function (data) {
                if (data.success) {
                    // Redirect to the dashboard page
                    window.location.href = '/?sessionID=' + data.sessionID;
                } else {
                    console.log(data);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
        
        
    });
});