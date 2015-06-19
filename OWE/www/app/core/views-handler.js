/*globals define*/
define(['jquery'], function ($) {
    var views = {},
        _height = 0,
        _width = 0;
    return {
        render: function (div, view) {
            if (views[div]) {
                views[div].close(true);
            }
            views[div] = view;
            view.render();
            $(div).html(view.$el);
            view.onResizeView(_height, _width);
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