/*globals define*/
define(['jquery'], function ($) {
    var views = {},
        _height = 0,
        _width = 0;
    return {
        DIV: {
            RIGHT: "#Right",
            LEFT: "#Left",
            MODAL: "#Modal"
        },
        render: function (div, view) {
            if (views[div]) {
                views[div].close(true);
            }
            view.render();
            views[div] = view;
            $(div).html(view.$el);
            if (div === this.DIV.LEFT) {
                this.showLeft();
            } else if (div === this.DIV.RIGHT) {
                this.showRight();
            }
            view.onResizeView(_height, _width);
            view.postRendering();
            view.animateNav();
        },
        showLeft: function () {
            $(this.DIV.RIGHT).addClass('hidden-xs');
            $(this.DIV.LEFT).removeClass('hidden-xs');
        },
        showRight: function () {
            $(this.DIV.LEFT).addClass('hidden-xs');
            $(this.DIV.RIGHT).removeClass('hidden-xs');
        },
        onWindowResize: function (height, width) {
            var div;
            _height = height;
            _width = width;
            for (div in views) {
                if (views.hasOwnProperty(div)) {
                    views[div].onResizeView(height, width);
                }
            }
        }
    };
});