$(document).ready(function () {
    $('.toggle').click(function () {
        let card = $(this).parent().parent();

        if (card.height() === 32) {
            console.log("up");
            card.css('height', '50%');
            $(this).children().removeClass('fa-chevron-down');
            $(this).children().addClass('fa-chevron-up');
        } else {
            card.css('height', '2rem');
            $(this).children().removeClass('fa-chevron-up');
            $(this).children().addClass('fa-chevron-down');
        }

        const changeSibling = (siblingCard) => {
            let remToPixel = parseFloat(getComputedStyle(document.documentElement).fontSize); // Convert 1rem to pixels
            let remainingHeight = $('.dashboard-wrapper').height() - (2 * remToPixel); // 
            if (siblingCard.height() === remainingHeight) {
                siblingCard.css('height', '50%');
            } else {
                siblingCard.css('height', remainingHeight + 'px');
            }
        };

        if (card.hasClass('map-card')) {
            changeSibling(card.siblings('.car-card'));
        } else if (card.hasClass('car-card')) {
            changeSibling(card.siblings('.map-card'));
        }

    });
});