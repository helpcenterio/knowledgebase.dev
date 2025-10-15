try {
    window.$ = window.jQuery = require('jquery');

    window.Popper = require('popper.js').default
    require('bootstrap');
} catch (e) {}

$(document).ready(function() {
    $('.faq-item > a').on('click', function(e) {
        e.preventDefault();

        $(this).parents('.faq-item').toggleClass('is-open');
    });
});