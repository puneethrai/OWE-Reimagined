/*global define,templates*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates) {
    var FriendTransactions = Backbone.View.extend({
        className: "FriendTransactions animated pulse",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'FriendTransactions');
            this.collection.on({
                add: this.onNewTransaction,
                remove: this.onRemoveTransaction
            }, this);
            this.total = 0;
        },
        events: {
            'tap': 'onTransactionView'
        },
        render: function () {
            var self = this;
            this.collection.each(function (model) {
                self._calculate(model);
            });
            self.renderView();
            return self;
        },
        renderView: function () {
            var self = this;
            self.$el.html(this.template({
                type: this.type,
                amount: this.total,
                name: this.model.get('name')
            }));
        },
        _calculate: function (model, removed) {
            if (model.get('type') === model.TYPE.DEBT) {
                this.total = removed ? this.total + model.get('amount') : this.total - model.get('amount');
            } else {
                this.total = removed ? this.total - model.get('amount') : this.total + model.get('amount');
            }
            this.type = this.total < 0 ? 'debt' : 'credit';
        },
        onNewTransaction: function (model) {
            this._calculate(model);
            this.renderView();
        },
        onRemoveTransaction: function (model) {
            this._calculate(model, true);
            this.renderView();
            if (!this.collection.length) {
                this.options.onEmpty();
            }
        },
        onTransactionView: function () {
            Backbone.history.navigate('transaction/' + (this.model.id || this.model.get('special')));
            window.app.transactions.router.onTransaction(this.model.id || this.model.get('special'));
        }
    });
    return FriendTransactions;
});
