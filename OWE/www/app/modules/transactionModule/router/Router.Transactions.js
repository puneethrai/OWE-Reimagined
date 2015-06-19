/*global define*/
/*jslint browser:true*/
define(['jquery', 'backbone', '../collection/Collection.Transactions', '../view/Views.Transactions','../view/Views.Transaction'], function ($, Backbone, TransactionCollection, ViewTransactions, TransactionView) {
    var TransactionRouter = Backbone.Router.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            var self = this;
            self.TransactionCollection = new TransactionCollection();
            window.app.transactions.context.listen(window.app.Events.Migration.TransactionsData, function (data) {
                var index = 0,
                    tempData,
                    userModel;
                var FC = window.app.friends && window.app.friends.router.FriendCollection;
                for (index = 0; index < data.length; index++) {
                    tempData = data[index];
                    userModel = FC.findWhere({
                        oldID: tempData.userid
                    });
                    delete tempData.id;
                    tempData.userid = (userModel && userModel.id) || null;
                    self.TransactionCollection.create(tempData);
                }
            });
            window.app.context.listen(window.app.Events.Migration.Clear, function () {
                var index;
                for (index = self.TransactionCollection.models.length - 1; index >= 0; index--) {
                    self.TransactionCollection.at(index).destroy();
                }
            });
            window.app.context.listen(window.app.Events.Migration.Migrated, function () {
                if (!self.TransactionCollection.models.length) {
                    self.TransactionCollection.fetch();
                }
            });
        },
        routes: {
            'transaction(/:id)': "onTransaction"
        },
        _onTransaction: function (argument) {
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
        },
        onTransaction: function (id) {
            var FC = window.app.friends.router.FriendCollection,
                friendModel = FC.findWhere({id: id}) || FC.findWhere({special: id}) || FC.add({});
            this.TV = new TransactionView({
                model: friendModel,
                collection: FC,
                parentDiv: 'Right'
            }).render();
        }
    });
    return TransactionRouter;
});