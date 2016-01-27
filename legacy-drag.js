(function(window) {
    'use strict';

    var has_touch = ('ontouchstart' in document.documentElement || window.navigator.msPointerEnabled);
    var event_types = {
        down: (has_touch ? 'touchstart' : 'mousedown'),
        move: (has_touch ? 'touchmove' : 'mousemove'),
        up: (has_touch ? 'touchend' : 'mouseup'),
        out: (has_touch ? 'touchcancel' : 'mouseout')
    };

    var dispatch = function(elem, event_name, native_source_event) {
        var event = document.createEvent('CustomEvent');
        if (event && event.initCustomEvent) {
            event.initCustomEvent('legacy-drag:' + event_name, true, true, {});
        } else {
            event = document.createEvent('Event');
            event.initEvent('legacy-drag:' + event_name, true, true);
        }

        event._stopPropagation = event.stopPropagation;
        event.stopPropagation = function() {
            event._stopPropagation();
            native_source_event.stopPropagation();
        };

        event._stopImmediatePropagation = event.stopImmediatePropagation;
        event.stopImmediatePropagation = function() {
            event._stopImmediatePropagation();
            native_source_event.stopImmediatePropagation();
        };

        return elem.dispatchEvent(event);
    };

    var handler_hash = {};

    var down_handler = function(elem) {
        return function(e) {
            handler_hash[elem].dragging = true;
            dispatch(elem, 'start', e);
        }
    };

    var move_handler = function(elem) {
        return function(e) {
            if (handler_hash[elem].dragging) {
                dispatch(elem, 'dragging', e);
            }
        }
    };

    var up_handler = function(elem) {
        return function(e) {
            handler_hash[elem].dragging = false;
            dispatch(elem, 'end', e);
        };
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
        handler_hash[elem] = {
            down: down_handler(elem),
            move: move_handler(elem),
            up: up_handler(elem),
            dragging: false
        };
        add_event(elem, event_types.down, handler_hash[elem].down);
        add_event(elem, event_types.move, handler_hash[elem].move);
        add_event(elem, event_types.up, handler_hash[elem].up);
    };

    var remove_legacy_drag = function(elem) {
        if (typeof handler_hash[elem] !== "undefined") {
            remove_event(elem, event_types.down, handler_hash[elem].down);
            remove_event(elem, event_types.move, handler_hash[elem].move);
            remove_event(elem, event_types.up, handler_hash[elem].up);
            delete  handler_hash[elem];
        }
    };

    if (typeof window.add_legacy_drag === 'undefined') {
        window.add_legacy_drag = add_legacy_drag;
    }

    if (typeof window.remove_legacy_drag === 'undefined') {
        window.remove_legacy_drag = remove_legacy_drag;
    }
}) (window);