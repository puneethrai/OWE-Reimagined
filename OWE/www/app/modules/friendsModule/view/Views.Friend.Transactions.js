/*global define,templates*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates) {
    var FriendTransactions = Backbone.View.extend({
        className: "transaction col-xs-12 col-sm-6 col-md-4",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'FriendTransactions');
            this.collection.on({
                add: this.onNewTransaction,
                remove: this.onRemoveTransaction
            }, this);
            this.total = 0;
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
            console.log(this.total, model.get('amount'))
            if (model.get('type') === model.TYPE.DEBT) {
                this.total = removed ? this.total + model.get('amount') : this.total - model.get('amount');
            } else {
                this.total = removed ? this.total - model.get('amount') : this.total + model.get('amount');
            }
            console.log(this.total)
            this.type = this.total < 0 ? '-' : '+';
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
        }
    });
    return FriendTransactions;
});
