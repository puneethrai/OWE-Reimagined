/*global TR, define*/
define(['jquery', 'backbone', '../collection/Collection.Friends', '../view/Views.Friends'], function ($, Backbone, FriendCollection, ViewFriends) {
    var FriendRouter = Backbone.Router.extend({
        initialize: function initialize() {
            var self = this;
            self.FriendCollection = new FriendCollection();
        },
        routes: {
            friends: "onFriend"
        },
        onFriend: function onFriend() {
            var TR = window.app.transactions && window.app.transactions.router;
            if (TR && TR.TV) {
                TR.TV.$el.addClass("hide");
            }
            $("nav a[href=#transaction]").removeClass("active");
            $("nav a[href=#friends]").addClass("active");
            if (!this.FV) {
                this.FV = new ViewFriends({
                    parentDiv: "Dynamic",
                    collection: this.FriendCollection
                }).render();
            } else {
                this.FV.$el.removeClass("hide");
            }
        }
    });
    return FriendRouter;
});