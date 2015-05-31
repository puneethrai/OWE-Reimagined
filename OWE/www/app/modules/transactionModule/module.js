/*globals define*/
/*jslint browser:true*/
define(['Boiler', 'templates', './settings', './router/Router.Transactions'], function (Boiler, templates, settings, TransactionRouter) {
    return {
        initialize: function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext),
                router = new TransactionRouter();
            context.addSettings(settings);
            templates.load(settings);
            window.app.transactions = {
                context: context,
                router: router
            };
            window.app.transactions.context.listen(window.app.Events.Migration.TransactionsData, function (data) {
                router.TransactionCollection.add(data);
                router.TransactionCollection.sync("create", router.TransactionCollection);
            });
            window.app.context.listen(window.app.Events.Migration.Migrated, function () {
                router.TransactionCollection.sync("read", router.TransactionCollection);
            });
        }
    };

});