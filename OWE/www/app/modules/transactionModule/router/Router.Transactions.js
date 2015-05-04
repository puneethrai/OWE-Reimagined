/*global Backbone, TransactionCollection, ViewTransactions, FR, $*/
var TransactionRouter = Backbone.Router.extend({
    initialize: function initialize(argument) {
        /*jslint unparam:true*/
        var self = this;
        self.TransactionCollection = new TransactionCollection();
        self.TransactionCollection.fetch();
    },
    routes: {
        transaction: "onTransaction"
    },
    onTransaction: function onTransaction(argument) {
        /*jslint unparam:true*/
        if (FR && FR.FV) {
            FR.FV.$el.addClass("hide");
        }
        $("nav a[href=#transaction]").addClass("active");
        $("nav a[href=#friends]").removeClass("active");
        if (!this.TV) {
            this.TV = new ViewTransactions({
                parentDiv: "Dynamic",
                collection: this.TransactionCollection,
                friendCollection: window.FR.FriendCollection
            }).render();
        } else {
            this.TV.$el.removeClass("hide");
        }
    }
});