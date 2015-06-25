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
            view.onResizeView(_height, _width);
            if (div === this.DIV.LEFT) {
                $(this.DIV.RIGHT).addClass('hidden-xs');
                $(this.DIV.LEFT).removeClass('hidden-xs');
            } else if (div === this.DIV.RIGHT) {
                $(this.DIV.LEFT).addClass('hidden-xs');
                $(this.DIV.RIGHT).removeClass('hidden-xs');
            }
            view.postRendering();
            view.animateNav();
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