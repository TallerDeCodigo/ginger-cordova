$(document).ready(function() {
    $(window).resize(function() {
        google.maps.event.trigger(map, 'resize');
    });
    setTimeout(function() {
        google.maps.event.trigger(map, 'resize');
    }, 1500);
});