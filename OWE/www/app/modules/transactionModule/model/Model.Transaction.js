/*globals define*/
define(['backbone'], function (Backbone) {
    var TransactionModel = Backbone.Model.extend({
        initialize: function initialize(argument) {
            /*jslint unparam:true*/
            return this;
        },
        sync: Backbone.localforage.sync('Transaction'),
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
        }
    });
    return TransactionModel;
});