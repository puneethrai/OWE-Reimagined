/*globals define, LiveTiles*/
define(['backbone', '../model/Model.Transaction'], function (Backbone, TransactionModel) {
    var TransactionCollection = Backbone.Collection.extend({
        total: 0,
        sync: Backbone.localforage.sync('Transactions'),
        model: TransactionModel,
        initialize: function () {
            this.on({
                add: this.onNewTransaction,
                "change:delete": this.onRemoveTransaction
            });
        },
        onNewTransaction: function (model) {
            this._calculate(model, false);
            this.notifyTitle();
        },
        onRemoveTransaction: function (model) {
            this._calculate(model, true);
            this.notifyTitle();

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
                image: 'Images/appbar.next.rest.png',
                count: this.length,
                backTitle: 'Transactions',
                backContent: (this.total < 0 ? 'You' : 'They') + ' owe ' + (this.total < 0 ? 'them ' : 'you ') + Math.abs(this.total) + ' units',
                backImage: 'Images/appbar.close.rest.png'
            });
            // create a secondary tile
            LiveTiles.createSecondaryTile(null, null, {
                title: 'Transactions',
                image: 'Images/appbar.save.rest.png',
                count: this.length,
                backTitle: 'Transactions'
            });
        }
    });
    return TransactionCollection;
});