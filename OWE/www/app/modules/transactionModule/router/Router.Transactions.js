/*global define*/
/*jslint browser:true*/
define(['underscore', 'backbone', '../collection/Collection.Transactions', '../view/Views.Transaction', 'viewHandler'], function (_, Backbone, TransactionCollection, TransactionView, viewHandler) {
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
            _.bindAll(this, 'onCompleted');
        },
        routes: {
            'transaction(/:id)': "onTransaction"
        },
        onTransaction: function (id) {
            var FC = window.app.friends.router.FriendCollection,
                friendModel = null;
            FC.every(function (model) {
                if ((model.id && model.id === id) || (model.get('special') && model.get('special') === id)) {
                    friendModel = model;
                    return false;
                }
                return true;
            });
            friendModel = friendModel || new FC.model();
            this.TV = new TransactionView({
                model: friendModel,
                collection: FC,
                transactions: this.TransactionCollection,
                onCompleted: this.onCompleted
            });
            viewHandler.render(viewHandler.DIV.RIGHT, this.TV);
        },
        onCompleted: function () {
            Backbone.history.navigate('', {replace: true});
            this.onTransaction();
            window.app.friends.router.onRenderMainScreen();
        }
    });
    return TransactionRouter;
});