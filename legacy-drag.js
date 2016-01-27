(function(window) {
    'use strict';

    var has_touch = ('ontouchstart' in doc.documentElement || win.navigator.msPointerEnabled);
    var event_types = {
        down: (has_touch ? 'touchstart' : 'mousedown'),
        move: (has_touch ? 'touchmove' : 'mousemove'),
        up: (has_touch ? 'touchend' : 'mouseup'),
        out: (has_touch ? 'touchcancel' : 'mouseout')
    };

    var dispatch = function(elem, event_name, detail) {
        var event = document.createEvent('CustomEvent');
        if (event && event.initCustomEvent) {
            event.initCustomEvent('legacy-drag:' + event_name, true, true, detail);
        } else {
            event = document.createEvent('Event');
            event.initEvent('legacy-drag:' + event_name, true, true);
            event.detail = detail;
        }
        return elem.dispatchEvent(event);
    };

    var down_handler = function(elem) {
        return function(e) { dispatch(elem, 'start', e); }
    };

    var move_handler = function(elem) {
        return function(e) { dispatch(elem, 'dragging', e); }
    };

    var up_handler = function(elem) {
        return function(e) { dispatch(elem, 'end', e); };
    };

    var add_event = function (elem, event_name, handler) {
        if (elem.addEventListener) {
            return elem.addEventListener(event_name, handler, false);
        } else if (elem.attachEvent) {
            return elem.attachEvent("on" + event_name, handler);
        }
    };

    var remove_event = function (elem, event_name, handler) {
        if (elem.addEventListener) {
            return elem.removeEventListener(event_name, handler, false);
        } else if (elem.attachEvent) {
            return elem.detachEvent("on" + event_name, handler);
        }
    };

    var add_legacy_drag = function(elem) {
        add_event(elem, event_types.down, down_handler(elem));
        add_event(elem, event_types.move, move_handler(elem));
        add_event(elem, event_types.up, up_handler(elem));
    };

    var remove_legacy_drag = function(elem) {
        remove_event(elem, event_types.down, down_handler(elem));
        remove_event(elem, event_types.move, move_handler(elem));
        remove_event(elem, event_types.up, up_handler(elem));
    };

    if (typeof add_legacy_drag === 'undefined') {
        window.add_legacy_drag = add_legacy_drag;
    }

    if (typeof remove_legacy_drag === 'undefined') {
        window.remove_legacy_drag = remove_legacy_drag;
    }
}) (window);