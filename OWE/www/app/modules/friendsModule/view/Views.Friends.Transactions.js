/*global define,templates*/
/*jslint browser:true*/
define(['backbone', 'templates', './Views.Friend.Transactions', 'jquery', 'jqueryTap'], function (Backbone, templates, FriendTransactions) {
    var FriendsTransactions = Backbone.View.extend({
        className: "FriendsTransactions col-xs-12",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'FriendsTransactions');
            options.transactions.on({
                add: this.onNewTransaction,
                remove: this.onRemoveTransaction
            }, this);
            this.friendTransactions = {};
        },
        events: {
            'tap .dummyNewTransaction': 'onNewTransactionView',
            'tap .dummyShowSetting': 'onRenderSetting'
        },
        render: function () {
            var self = this;
            self.$el.html(this.template());
            self.options.transactions.each(function (model) {
                self.onNewTransaction(model);
            });
            return self;
        },
        postRendering: function () {
            var self = this;
            self.onResizeView(this._height, this._width);
            if (!Object.keys(self.friendTransactions).length) {
                self._addTooltip();
            }
        },
        _addTooltip: function () {
            this.$el.find('.dummyNewTransaction').tooltip({title: 'Add new transaction here'}).tooltip('show');
            this._tooltipped = true;
        },
        _removeTooltip: function () {
            if (this._tooltipped) {
                this.$el.find('.dummyNewTransaction').tooltip('destroy');
                this._tooltipped = false;
            }
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
                this._removeTooltip();
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
        },
        onNewTransactionView: function () {
            this._removeTooltip();
            Backbone.history.navigate('transaction');
            window.app.transactions.router.onTransaction();
        },
        onResizeView: function (height) {
            this.$el.find('.dummyFriendsTransactions').css({
                'max-height' : height - Number(this.$el.find('nav').height()) - 40 - Number(this.$el.find('.dummyTitle').height())
            });
            Backbone.View.prototype.onResizeView.apply(this, arguments);
        }
    });
    return FriendsTransactions;
});