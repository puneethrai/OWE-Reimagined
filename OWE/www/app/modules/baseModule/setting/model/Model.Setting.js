/*globals define*/
define(['backbone'], function (Backbone) {
    var SettingModel = Backbone.Model.extend({
        sync: Backbone.localforage.sync('Setting'),
        defaults: function defaults() {
            return {
                notification: true,
                backgroundImage: ""
            };
        }
    });
    return new SettingModel({
        id: 'Setting'
    });
});