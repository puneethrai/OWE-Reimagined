/*globals define*/
define(['backbone'], function (Backbone) {
    Backbone.View.prototype.close = function (remove) {
        if (this.beforeClose) {
            this.beforeClose(remove);
        }
        if (remove) {
            this.remove();
            if (this.model) {
                this.model.off(null, null, this);
            }
            if (this.collection) {
                this.collection.off(null, null, this);
            }
            this.closed = true;
        }
    };
    Backbone.View.prototype.onResizeView = function (height, width) {
        this._height = height;
        this._width = width;
    };
    Backbone.View.prototype.postRendering = function () {
        return true;
    };
    Backbone.View.prototype.onRenderSetting = function () {
        window.app.baseModule.renderSettingView();
    };
});