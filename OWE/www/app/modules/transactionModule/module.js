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
                context: context,
                router: new TransactionRouter()
            };
            window.app.transactions.context.listen(window.app.Events.TransactionsData, function (data) {
                window.app.transactions.router.TransactionCollection(data);
            });
        }
    };

});