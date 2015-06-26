/*globals define*/
define(['backbone', '../model/Model.Friend'], function (Backbone, FriendModel) {

    var FriendCollection = Backbone.Collection.extend({
        sync: Backbone.localforage.sync('Friends'),
        model: FriendModel
    });
    return FriendCollection;
});