/*globals define*/
define(['text!./templates/Transaction.html', 'text!./templates/Transactions.html', 'text!./templates/Transaction.Friend.html'], function () {
    return {
        templates: arguments,
        names: ['Transaction', 'Transactions', 'Transaction.Friend'],
        modulePath: 'js/transactions',
        templatePath: 'templates',
        moduleName: 'transaction'
    };
});