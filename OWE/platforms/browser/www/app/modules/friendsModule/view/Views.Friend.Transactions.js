/*global define,templates*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates) {
    var FriendTransactions = Backbone.View.extend({
        className: "FriendTransactions animated pulse",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'FriendTransactions');
            this.collection.on({
                add: this.onNewTransaction,
                "change:deleted": this.onRemoveTransaction
            }, this);
            this.total = 0;
        },
        events: {
            'tap': 'onTransactionView'
        },
        render: function () {
            var self = this;
            self._calculate(self.collection);
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
        _calculate: function (collection) {
            var total = 0;
            collection.each(function (model) {
                if (!model.get('deleted')) {
                    if (model.get('type') === model.TYPE.DEBT) {
                        total -= model.get('amount');
                    } else {
                        total += model.get('amount');
                    }
                }
            });
            this.total = total;
            this.type = this.total < 0 ? 'debt' : 'credit';
            return this.total;
        },
        onNewTransaction: function () {
            this._calculate(this.collection);
            this.renderView();
        },
        onRemoveTransaction: function () {
            this._calculate(this.collection);
            this.renderView();
            if (!this.collection.findWhere({deleted: true})) {
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
