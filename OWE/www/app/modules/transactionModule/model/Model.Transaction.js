/*globals define*/
define(['backbone'], function (Backbone) {
    var TransactionModel = Backbone.Model.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            return this;
        },
        TYPE: {
            DEBT: "-",
            CREDIT: "+"
        },
        ERROR: {
            "-1": "Not valid amount",
            "-2": "Not valid transaction type"
        },
        defaults: function defaults() {
            return {
                amount: 0,
                userid: 0,
                type: this.TYPE.DEBT
            };
        },
        validate: function (attrs, options) {
            /*jslint unparam:true*/
            if (typeof attrs.amount !== "number" || isNaN(attrs.amount) || attrs.amount === 0) {
                return -1;
            }
            if (attrs.type !== this.TYPE.DEBT && attrs.type !== this.TYPE.CREDIT) {
                return -2;
            }
        },
        save: function save() {
            var self = this,
                defer = $.Deferred();
            if (this.isValid()) {
                DataLayer.addTransaction(this.toJSON()).done(function (transaction) {
                    self.set("id", transaction.id || transaction);
                }).fail(function () {
                    self.destroy();
                });
            } else {
                defer.reject();
            }
            return defer.promise();

        },
        destroy: function () {
            var self = this;
            if (!this.isNew()) {
                DataLayer.removeTransaction(this.get("id")).done(function (transaction) {
                    /*jslint unparam:true*/
                    self.trigger("destroy", self);
                });
            } else {
                self.trigger("destroy", self);
            }
        }
    });
    return TransactionModel;
});