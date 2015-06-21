/*globals define*/
define(['backbone', 'jquery'], function (Backbone, $) {
    var SettingModel = Backbone.Model.extend({
        sync: Backbone.localforage.sync('Setting'),
        defaults: function defaults() {
            return {
                notification: true,
                backgroundImage: ""
            };
        },
        initialize: function () {
            this.on('change:backgroundImage', this.onBackgroundImage);
        },
        onBackgroundImage: function (model, value) {
            /*jslint unparam:true*/
            if (value) {
                $('body').css('background-image', 'url(' + value + ')');
            }
        }
    });
    return new SettingModel({
        id: 'Setting'
    });
});