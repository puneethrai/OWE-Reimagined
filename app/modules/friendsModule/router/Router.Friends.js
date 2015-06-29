/*global TR, define*/
/*jslint browser:true*/
define(['backbone', '../collection/Collection.Friends', '../view/Views.Friends.Transactions', 'viewHandler'], function (Backbone, FriendCollection, FriendsTransaction, viewHandler) {
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
                    self.FriendCollection.fetch({
                        success: function () {
                            if (!self.FriendCollection.findWhere({special: 'noname'})) {
                                self.FriendCollection.create({special: 'noname', name: 'No Name'});
                            }
                            window.app.transactions.router.onTransaction();
                            self.onRenderMainScreen();
                        }
                    });
                }
                self.FriendCollection.add({special: 'noname', name: 'No Name'});
            });
        },
        routes: {
            '': "onRenderMainScreen"
        },
        onRenderMainScreen: function () {
            var TR = window.app.transactions && window.app.transactions.router;
            if (!this.FT) {
                this.FT = new FriendsTransaction({
                    collection: this.FriendCollection,
                    transactions: TR.TransactionCollection
                });
                viewHandler.render(viewHandler.DIV.LEFT, this.FT);
            } else {
                viewHandler.showLeft();
            }
        }
    });
    return FriendRouter;
});