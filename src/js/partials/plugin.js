;(function (factory) {
        factory(jQuery);
})(function ($) {

    var Slider = (function (element, settings) {

        var instanceUid = 0;

        function _Slider(element, settings) {
            this.defaults = {
                slideDuration: '3000', //autoplayspeed
                speed: 500,
                arrowRight: '.arrow-right',
                arrowLeft: '.arrow-left',
                //my options
                infinite: true,
                index: 0,
                slidesVisible: 1,
                slidesToScroll: 1,
                arrows: true,
                swipeAble: true,
                pagination: true,
                autoplay: true

            };

            this.settings = $.extend({}, this, this.defaults, settings);

            this.initials = {
                currSlide: this.settings.index,
                $currSlide: null,
                totalSlides: false,
                csstransitions: false
            };

            $.extend(this, this.initials);

            this.$el = $(element);

            this.changeSlide = $.proxy(this.changeSlide, this);

            this.init();

            this.instanceUid = instanceUid++;
            console.log(instanceUid)
        }

        return _Slider;

    })();

    Slider.prototype.init = function () {
        this.csstransitionsTest();
        this.build();
        this.events();
        this.activate();
        this.startTimer();
    };


    Slider.prototype.changeSlide = function (e) {
        if (this.throttle) return;
        this.throttle = true;
        this.clearTimer();
        var direction = this._direction(e);
        var animate = this._next(e, direction);
        if (!animate) return;
        var $nextSlide = this.$el.find('.slide').eq(this.currSlide).addClass(direction + ' active');
        console.log(this.$el);
        this._cssAnimation($nextSlide, direction);

    };

    Slider.prototype._next = function (e, direction) {
        var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);

        switch (true) {
            case( typeof index !== 'undefined'):
                if (this.currSlide == index) {
                    this.startTimer();
                    return false;
                }
                this.currSlide = index;
                break;
            case(direction == 'right' && this.currSlide < (this.totalSlides - 1)):
                this.currSlide += this.settings.slidesToScroll;   //dff
                break;
            case(direction == 'right'):
                if (this.settings.infinite == false) {
                    this.startTimer();
                    return false;
                }
                this.currSlide = 0;
                break;
            case(direction == 'left' && this.currSlide === 0):
                if (this.settings.infinite == false) {
                    this.startTimer();
                    return false;
                }
                this.currSlide = (this.totalSlides - 1);
                break;
            case(direction == 'left'):

                this.currSlide -= this.settings.slidesToScroll;
                break;
        }
        return true;
    };

    Slider.prototype._direction = function (e) {
        var direction;
        if (typeof e !== 'undefined') {
            direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
        } else {
            direction = 'right';
        }
        return direction;
    };

    Slider.prototype._cssAnimation = function ($nextSlide, direction) {
        setTimeout(function () {
            this.$el.addClass('transition');
            this.addCSSDuration();
            this.$currSlide.addClass('shift-' + direction);
        }.bind(this), 100);

        setTimeout(function () {
            this.$el.removeClass('transition');
            this.removeCSSDuration();
            this.$currSlide.removeClass('active shift-left shift-right');
            this.$currSlide = $nextSlide.removeClass(direction);
            this._updateIndicators();
            this.startTimer();
        }.bind(this), 100 + this.settings.speed);
    };

    Slider.prototype._updateIndicators = function () {
        this.$el.find('.indicators li').removeClass('active').eq(this.currSlide).addClass('active');
    };

    Slider.prototype.csstransitionsTest = function () {
        var elem = document.createElement('modernizr');
        var props = ["transition", "WebkitTransition", "MozTransition", "OTransition", "msTransition"];
        for (var i in props) {
            var prop = props[i];
            var result = elem.style[prop] !== undefined ? prop : false;
            if (result) {
                this.csstransitions = result;
                break;
            }
        }
    };


    Slider.prototype.addCSSDuration = function () {
        var _ = this;
        this.$el.find('.slide').each(function () {
            this.style[_.csstransitions + 'Duration'] = _.settings.speed + 'ms';
        });
    }

    Slider.prototype.removeCSSDuration = function () {
        var _ = this;
        this.$el.find('.slide').each(function () {
            this.style[_.csstransitions + 'Duration'] = '';
        });
    }

    Slider.prototype.build = function () {
        if (this.settings.arrows == false) {
            this.$el.find(this.settings.arrowLeft).addClass('display-none')
            this.$el.find(this.settings.arrowRight).addClass('display-none')
        }

        var $indicators = this.$el.append('<ul class="indicators" >').find('.indicators');
        this.totalSlides = this.$el.find('.slide').length;
        for (var i = 0; i < this.totalSlides; i++) $indicators.append('<li data-index=' + i + '>');
        if (this.settings.pagination == false) {
            this.$el.find('.indicators').addClass('display-none')
        }
    };

    Slider.prototype.activate = function () {
        this.$currSlide = this.$el.find('.slide').eq(this.settings.index).addClass('active');
        this.$el.find('.indicators li').eq(this.settings.index).addClass('active');
    };


    Slider.prototype.events = function () {
        this.$el
            .on('click', this.settings.arrowRight, {direction: 'right'}, this.changeSlide)
            .on('click', this.settings.arrowLeft, {direction: 'left'}, this.changeSlide)
            .on('click', '.indicators li', this.changeSlide)
            .on('swipeleft', '.slide', {direction: 'right'}, this.changeSlide)
            .on('swiperight', '.slide', {direction: 'left'}, this.changeSlide);

    };


    Slider.prototype.clearTimer = function () {
        if (this.settings.autoplay == true) {
            if (this.timer) clearInterval(this.timer);
        }
    };


    Slider.prototype.initTimer = function () {
        if (this.settings.autoplay == true) {
            this.timer = setInterval(this.changeSlide, this.settings.slideDuration);
        }
    };


    Slider.prototype.startTimer = function () {
        if (this.settings.autoplay == true) {
            this.initTimer();
        }
            this.throttle = false;
    };


    $.fn.Slider = function (options) {

        return this.each(function (index, el) {

            el.Slider = new Slider(el, options);

        });

    };


});

// Custom options for the carousel
var args = {
    arrowRight: '.arrow-right',
    arrowLeft: '.arrow-left',
    speed: 1000,
    slideDuration: 4000
};

$('.carousel').Slider(args);
args = {
    speed: 1000,
    slideDuration: 4000,
    arrows: false,
    autoplay:false
};
$('.carousel-listing').Slider(args);


