/*globals define*/
define(['backbone', '../model/Model.Transaction'], function (Backbone, TransactionModel) {
    var TransactionCollection = Backbone.Collection.extend({
        sync: Backbone.localforage.sync('Transactions'),
        model: TransactionModel
    });
    return TransactionCollection;
});