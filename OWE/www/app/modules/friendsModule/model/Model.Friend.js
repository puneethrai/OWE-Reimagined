/*globals define*/
define(['backbone'], function (Backbone) {
    var FriendModel = Backbone.Model.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            return this;
        },
        sync: Backbone.localforage.sync('Friend'),
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
        }
    });
    return FriendModel;
});