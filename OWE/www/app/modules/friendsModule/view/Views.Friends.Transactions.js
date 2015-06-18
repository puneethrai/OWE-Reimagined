/*global define,templates*/
define(['backbone', 'templates', './Views.Friend.Transactions', 'jquery', 'jqueryTap'], function (Backbone, templates, FriendTransactions, $) {
    var FriendsTransactions = Backbone.View.extend({
        className: "FriendsTransactions",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'FriendsTransactions');
            options.transactions.on({
                add: this.onNewTransaction,
                remove: this.onRemoveTransaction
            }, this);
            this.friendTransactions = {};
        },
        render: function () {
            var self = this;
            self.$el.html(this.template());
            self.options.transactions.each(function (model) {
                self.onNewTransaction(model);
            });
            $("#" + this.options.parentDiv).html(this.$el);
            return self;
        },
        _getFriendTransactions: function (model) {
            var self = this;
            if (!this.friendTransactions[model.cid]) {
                this.friendTransactions[model.cid] = new FriendTransactions({
                    model: model,
                    collection: new Backbone.Collection(),
                    rendered: false,
                    onEmpty: function () {
                        self.friendTransactions[model.cid].remove();
                        delete self.friendTransactions[model.cid];
                    }
                }).render();
            }
            return this.friendTransactions[model.cid];
        },
        _renderView: function (view) {
            if (!view.options.rendered) {
                this.$el.find('.dummyFriendsTransactions').append(view.el);
                view.options.rendered = true;
            }
        },
        _getFrientModelFromTransaction: function (transaction) {
            return this.collection.findWhere({id: transaction.get('userid')}) || this.collection.findWhere({special: 'noname'});
        },
        onNewTransaction: function (model) {
            var friendModel = this._getFrientModelFromTransaction(model),
                view = this._getFriendTransactions(friendModel);
            view.collection.add(model);
            this._renderView(view);
        },
        onRemoveTransaction: function (model) {
            var friendModel = this._getFrientModelFromTransaction(model),
                view = this._getFriendTransactions(friendModel);
            view.collection.remove(model);
            if (view.collection.length) {
                this._renderView(view);
            }

        }
    });
    return FriendsTransactions;
});