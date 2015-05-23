/*globals define*/
define(['text!./templates/Friend.html', 'text!./templates/Friends.html'], function () {
    return {
        templates: arguments,
        names: ['Friend', 'Friends'],
        modulePath: 'js/friends',
        templatePath: 'templates',
        moduleName: 'friend'
    };
});