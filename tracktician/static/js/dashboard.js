$(document).ready(function () {
    $('.toggle').click(function () {
        let card = $(this).parent().parent();

        if (card.height() === 32) {
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

let handler = document.querySelector('.handler');
let wrapper = handler.closest('.dashboard-wrapper');
let boxA = wrapper.querySelector('.info-container');
let isHandlerDragging = false;

document.addEventListener('mousedown', function (e) {
    if (e.target === handler) {
        isHandlerDragging = true;
    }
});

document.addEventListener('mousemove', function (e) {
    if (!isHandlerDragging) {
        return false;
    }

    let containerOffsetLeft = wrapper.offsetLeft;

    let pointerRelativeXpos = e.clientX - containerOffsetLeft;

    let boxAminWidth = 200;

    boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
    boxA.style.flexGrow = 0;
});

document.addEventListener('mouseup', function (e) {
    isHandlerDragging = false;
});