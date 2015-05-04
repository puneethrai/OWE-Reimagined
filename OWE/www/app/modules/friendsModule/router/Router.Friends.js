/*global Backbone, FriendCollection, ViewFriends, TR, $*/
var FriendRouter = Backbone.Router.extend({
    initialize: function initialize() {
        var self = this;
        self.FriendCollection = new FriendCollection();
        self.FriendCollection.fetch();
    },
    routes: {
        friends: "onFriend"
    },
    onFriend: function onFriend() {
        if (window.TR && TR.TV) {
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