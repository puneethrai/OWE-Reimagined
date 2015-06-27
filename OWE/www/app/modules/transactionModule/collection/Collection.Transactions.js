/*globals define, LiveTiles*/
define(['backbone', '../model/Model.Transaction', "localforage", "localforagebackbone"], function (Backbone, TransactionModel) {
    var TransactionCollection = Backbone.Collection.extend({
        total: 0,
        sync: Backbone.localforage.sync('Transactions'),
        model: TransactionModel,
        initialize: function () {
            this.on({
                add: this.onNewTransaction,
                "change:deleted": this.onRemoveTransaction,
                remove: this.onRemoved
            });
            this.notifyTitle();
        },
        onNewTransaction: function (model) {
            this._calculate(model, false);
            this.notifyTitle();
        },
        onRemoveTransaction: function (model, value) {
            this._calculate(model, Boolean(value));
            this.notifyTitle();
        },
        onRemoved: function () {
            if (!this.length) {
                window.app.transactions.context.notify(window.app.Events.RateApp);
                this.notifyTitle();
            }
        },
        _calculate: function (model, removed) {
            var value = model.get('amount');
            if (model.get('type') === model.TYPE.DEBT) {
                this.total = removed ? this.total + value : this.total - value;
            } else {
                this.total = removed ? this.total - value : this.total + value;
            }
        },
        notifyTitle: function () {
            LiveTiles.updateAppTile(null, null, {
                title: 'Transactions',
                image: 'www/image/' + (this.total < 0 ? 'appbar.owe.them.png' : 'appbar.owe.they.png'),
                count: this.length,
                backTitle: 'Transactions',
                backContent: (this.total < 0 ? 'You' : 'They') + ' owe ' + (this.total < 0 ? 'them ' : 'you ') + Math.abs(this.total) + ' units',
                backImage: 'Images/' + (this.total < 0 ? 'appbar.owe.them.png' : 'appbar.owe.they.png')
            });
        }
    });
    return TransactionCollection;
});