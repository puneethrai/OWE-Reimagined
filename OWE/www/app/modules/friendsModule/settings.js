/*globals define*/
define(['text!./templates/Friend.html', 'text!./templates/Friends.html', 'text!./templates/Friends.Transactions.html', 'text!./templates/Friend.Transactions.html'], function () {
    return {
        templates: arguments,
        names: ['Friend', 'Friends', 'FriendsTransactions', 'FriendTransactions'],
        modulePath: 'js/friends',
        templatePath: 'templates',
        moduleName: 'friend'
    };
});