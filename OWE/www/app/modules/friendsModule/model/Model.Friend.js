/*globals Backbone, DataLayer*/
var FriendModel = Backbone.Model.extend({
    initialize: function initialize(argument) {
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
                self.trigger("destroy", self);
            });
        } else {
            self.trigger("destroy", self);
        }
    }
});