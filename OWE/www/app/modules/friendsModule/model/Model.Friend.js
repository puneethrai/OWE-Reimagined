/*globals define, DataLayer*/
define(['jquery', 'backbone', 'dataLayer'], function ($, Backbone, DataLayer) {
    var FriendModel = Backbone.Model.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            return this;
        },
        TYPE: {
            DEBT: "+",
            CREDIT: "-"
        },
        ERROR: {
            "-1": "Not valid name"
        },
        defaults: function defaults() {
            return {
                name: "",
            };
        },
        validate: function (attrs, options) {
            /*jslint unparam:true*/
            if (!attrs.name || attrs.name === "") {
                return -1;
            }
        },
        save: function save() {
            var self = this,
                defer = $.Deferred();
            DataLayer.addFriend(this.toJSON()).done(function (friend) {
                self.set("id", friend.id || friend);
                defer.resolve();
            }).fail(function () {
                defer.reject();
                self.destroy();
            });
            return defer.promise();
        },
        destroy: function () {
            var self = this;
            if (!this.isNew()) {
                DataLayer.removeFriend(this.get("id")).done(function (friend) {
                    /*jslint unparam:true*/
                    self.trigger("destroy", self);
                });
            } else {
                self.trigger("destroy", self);
            }
        }
    });
    return FriendModel;
});