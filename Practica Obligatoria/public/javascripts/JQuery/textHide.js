$(document).ready(function () {
    $('.showOrHide').click(function () {
        $('.hiddable').hasClass('ver') ? esconderPassword($($('.hiddable'))) : verPassword($($('.hiddable')))
    })
    function esconderPassword(e) {
        e.removeClass('ver').addClass('esconder')
        e.attr('type', 'password')
        $('.showOrHide').removeClass('bi-eye-slash-fill').addClass('bi-eye-fill')
    }
    function verPassword(e) {
        e.removeClass('esconder').addClass('ver')
        e.attr('type', 'text')
        $('.showOrHide').removeClass('bi-eye-fill').addClass('bi-eye-slash-fill')
    }
});