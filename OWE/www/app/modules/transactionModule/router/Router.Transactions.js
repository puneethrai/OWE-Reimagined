/*global define*/
define(['jquery', 'backbone', '../collection/Collection.Transactions', '../view/Views.Transactions'], function ($, Backbone, TransactionCollection, ViewTransactions) {
    var TransactionRouter = Backbone.Router.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            var self = this;
            self.TransactionCollection = new TransactionCollection();
        },
        routes: {
            transaction: "onTransaction"
        },
        onTransaction: function onTransaction(argument) {
            /*jslint unparam:true*/
            var FR = window.app.friends && window.app.friends.router;
            if (FR && FR.FV) {
                FR.FV.$el.addClass("hide");
            }
            $("nav a[href=#transaction]").addClass("active");
            $("nav a[href=#friends]").removeClass("active");
            if (!this.TV) {
                this.TV = new ViewTransactions({
                    parentDiv: "Dynamic",
                    collection: this.TransactionCollection,
                    friendCollection: FR.FriendCollection
                }).render();
            } else {
                this.TV.$el.removeClass("hide");
            }
        }
    });
    return TransactionRouter;
});