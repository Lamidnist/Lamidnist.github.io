(function () {
    var on = addEventListener, $ = function (q) {
        return document.querySelector(q)
    }, $$ = function (q) {
        return document.querySelectorAll(q)
    }, $body = document.body, $inner = $('.inner'), client = (function () {
        var o = {browser: 'other', browserVersion: 0, os: 'other', osVersion: 0, mobile: false, canUse: null},
            ua = navigator.userAgent, a, i;
        return o;}())
    var scrollEvents = {
        items: [], add: function (o) {
            this.items.push({
                element: o.element,
                triggerElement: (('triggerElement' in o && o.triggerElement) ? o.triggerElement : o.element),
                enter: ('enter' in o ? o.enter : null),
                leave: ('leave' in o ? o.leave : null),
                mode: ('mode' in o ? o.mode : 1),
                offset: ('offset' in o ? o.offset : 0),
                state: false,
            });
        }, handler: function () {
            var height, top, bottom, scrollPad;
            if (client.os == 'ios') {
                height = document.documentElement.clientHeight;
                top = document.body.scrollTop + window.scrollY;
                bottom = top + height;
                scrollPad = 125;
            } else {
                height = document.documentElement.clientHeight;
                top = document.documentElement.scrollTop;
                bottom = top + height;
                scrollPad = 0;
            }
            scrollEvents.items.forEach(function (item) {
                var bcr, elementTop, elementBottom, state, a, b;
                if (!item.enter && !item.leave) return true;
                if (item.triggerElement.offsetParent === null) return true;
                bcr = item.triggerElement.getBoundingClientRect();
                elementTop = top + Math.floor(bcr.top);
                elementBottom = elementTop + bcr.height;
                switch (item.mode) {
                    case 1:
                    default:
                        state = (bottom > (elementTop - item.offset) && top < (elementBottom + item.offset));
                        break;
                    case 2:
                        a = (top + (height * 0.5));
                        state = (a > (elementTop - item.offset) && a < (elementBottom + item.offset));
                        break;
                    case 3:
                        a = top + (height * 0.25);
                        if (a - (height * 0.375) <= 0) a = 0;
                        b = top + (height * 0.75);
                        if (b + (height * 0.375) >= document.body.scrollHeight - scrollPad) b = document.body.scrollHeight + scrollPad;
                        state = (b > (elementTop - item.offset) && a < (elementBottom + item.offset));
                        break;
                }
                if (state != item.state) {
                    item.state = state;
                    if (item.state) {
                        if (item.enter) {
                            (item.enter).apply(item.element);
                            if (!item.leave) item.enter = null;
                        }
                    } else {
                        if (item.leave) {
                            (item.leave).apply(item.element);
                            if (!item.enter) item.leave = null;
                        }
                    }
                }
            });
        }, init: function () {
            on('load', this.handler);
            on('resize', this.handler);
            on('scroll', this.handler);
            (this.handler)();
        }
    };
    scrollEvents.init();
    var onvisible = {
        effects: {
            'fade-in': {
                transition: function (speed, delay) {
                    return 'opacity ' + speed + 's ease' + (delay ? ' ' + delay + 's' : '');
                }, rewind: function (intensity) {
                    this.style.opacity = 0;
                }, play: function () {
                    this.style.opacity = 1;
                },
            },
        }, add: function (selector, settings) {
            var style = settings.style in this.effects ? settings.style : 'fade',
                speed = parseInt('speed' in settings ? settings.speed : 1000) / 1000,
                intensity = ((parseInt('intensity' in settings ? settings.intensity : 5) / 10) * 1.75) + 0.25,
                delay = parseInt('delay' in settings ? settings.delay : 0) / 1000,
                offset = parseInt('offset' in settings ? settings.offset : 0),
                mode = parseInt('mode' in settings ? settings.mode : 3),
                replay = 'replay' in settings ? settings.replay : false,
                stagger = 'stagger' in settings ? (parseInt(settings.stagger) / 1000) : false,
                effect = this.effects[style];

            $$(selector).forEach(function (e) {
                var children = (stagger !== false) ? e.querySelectorAll(':scope > li, :scope ul > li') : null,
                    enter = function (staggerDelay = 0) {
                        var _this = this, transitionOrig;
                        if (!effect.custom) {
                            transitionOrig = this.style.transition;
                            this.style.setProperty('backface-visibility', 'hidden');
                            this.style.transition = effect.transition(speed, delay + staggerDelay);
                        } else effect.transition.apply(this, [speed, delay + staggerDelay]);
                        effect.play.apply(this);
                        if (!effect.custom) setTimeout(function () {
                            _this.style.removeProperty('backface-visibility');
                            _this.style.transition = transitionOrig;
                        }, (speed + delay + staggerDelay) * 1000 * 2);
                    };
                if (children) children.forEach(function (e) {
                    effect.rewind.apply(e, [intensity, true]);
                }); else effect.rewind.apply(e, [intensity]);
                triggerElement = e;

                scrollEvents.add({
                    element: e,
                    triggerElement: triggerElement,
                    offset: offset,
                    mode: mode,
                    enter: children ? function () {
                        var staggerDelay = 0;
                        children.forEach(function (e) {
                            enter.apply(e, [staggerDelay]);
                            staggerDelay += stagger;
                        });
                    } : enter,
                    leave: (replay ? (children ? function () {
                        children.forEach(function (e) {
                            leave.apply(e);
                        });
                    } : leave) : null),
                });
            });
        },
    };
    onvisible.add('#container01', {style: 'fade-in', speed: 1875, intensity: 5, delay: 1000, replay: false});
})();