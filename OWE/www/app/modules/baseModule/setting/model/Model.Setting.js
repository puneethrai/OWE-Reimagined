/*globals define*/
/*jslint browser:true*/
define(['backbone', 'jquery'], function (Backbone, $) {
    var SettingModel = Backbone.Model.extend({
        sync: Backbone.localforage.sync('Setting'),
        defaults: function defaults() {
            return {
                notification: true,
                backgroundImage: "",
                appRated: false,
                versionrated: (window.app && window.app.context.getSettings().appVersion) || "2.0.0",
                dontRate: false
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
        },
        canAskRating: function () {
            return Boolean(window.cordova.platformId !== "browser" && (!this.get('dontRate') ||  window.app.context.getSettings().appVersion !== this.get('versionrated')) && this.isAppNotRated());
        },
        isAppNotRated: function () {
            return Boolean(!this.get('appRated') || window.app.context.getSettings().appVersion !== this.get('versionrated'));
        },
        rateApp: function () {
            window.app.rateApp();
            this.save({
                appRated: true,
                dontRate: false,
                versionrated: window.app.context.getSettings().appVersion
            });
        },
        dontRate: function () {
            this.save({
                appRated: false,
                dontRate: true
            });
        }
    });
    return new SettingModel({
        id: 'Setting'
    });
});