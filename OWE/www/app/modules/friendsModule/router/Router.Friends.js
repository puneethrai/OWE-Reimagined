/*global TR, define*/
define(['jquery', 'backbone', '../collection/Collection.Friends', '../view/Views.Friends'], function ($, Backbone, FriendCollection, ViewFriends) {
    var FriendRouter = Backbone.Router.extend({
        initialize: function initialize() {
            var self = this;
            self.FriendCollection = new FriendCollection();
            window.app.friends.context.listen(window.app.Events.Migration.FriendsData, function (data) {
                var index = 0,
                    tempData;
                for (index = 0; index < data.length; index++) {
                    tempData = data[index];
                    tempData.oldID = tempData.id;
                    tempData.migrated = true;
                    delete tempData.id;
                    self.FriendCollection.create(tempData);
                }
            });
            window.app.context.listen(window.app.Events.Migration.Clear, function () {
                var index;
                for (index = self.FriendCollection.models.length - 1; index >= 0; index--) {
                    self.FriendCollection.at(index).destroy();
                }
            });
            window.app.context.listen(window.app.Events.Migration.Migrated, function () {
                if (!self.FriendCollection.models.length) {
                    self.FriendCollection.fetch();
                }
            });
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