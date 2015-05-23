/*globals define*/
define(['text!./templates/Transaction.html', 'text!./templates/Transactions.html'], function () {
    return {
        templates: arguments,
        names: ['Transaction', 'Transactions'],
        modulePath: 'js/transactions',
        templatePath: 'templates',
        moduleName: 'transaction'
    };
});