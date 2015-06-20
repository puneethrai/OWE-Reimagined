/*globals define*/
define([
    'text!./templates/Transaction.html',
    'text!./templates/Transactions.html',
    'text!./templates/Transaction.Friend.html',
    'text!./templates/Friend.Transaction.html',
    'text!./templates/Modal.Friend.Add.html'],
    function () {
        return {
            templates: arguments,
            names: ['Transaction', 'Transactions', 'Transaction.Friend', 'Friend.Transaction', 'Modal.Friend.Add'],
            modulePath: 'js/transactions',
            templatePath: 'templates',
            moduleName: 'transaction'
        };
    });