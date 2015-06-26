/*globals define*/
define(['text!./templates/Friends.Transactions.html', 'text!./templates/Friend.Transactions.html'], function () {
    return {
        templates: arguments,
        names: ['FriendsTransactions', 'FriendTransactions'],
        modulePath: 'js/friends',
        templatePath: 'templates',
        moduleName: 'friend'
    };
});