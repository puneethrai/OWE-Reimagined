/*globals define*/
/*jslint browser:true*/
define(['Boiler', 'templates', './settings', './router/Router.Transactions'], function (Boiler, templates, settings, TransactionRouter) {
    return {
        initialize: function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext);
            context.addSettings(settings);
            templates.load(settings);
            window.app.transactions = {
                context: context
            };
            window.app.transactions.router = new TransactionRouter();
        }
    };

});