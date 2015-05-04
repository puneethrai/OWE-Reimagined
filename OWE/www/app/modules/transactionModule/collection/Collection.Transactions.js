/*globals define*/
define(['backbone', '../model/Model.Transaction'], function (Backbone, TransactionModel) {
    var TransactionCollection = Backbone.Collection.extend({
        model: function (attrs, options) {
            return new TransactionModel(attrs, options);
        },
        fetch: function (options) {
            var self = this;
            options = options || {};
            var success = options.success || function () {
                    return true;
                },
                error = options.error || function () {
                    return true;
                };
            DataLayer.getAllTransaction().done(function (transactions) {
                self.add(transactions, {
                    validate: true
                });
                success(self.models);
            }).fail(function (message) {
                error(message);
            });
        }
    });
    return TransactionCollection;
});