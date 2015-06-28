/*globals define*/
define(['text!./templates/Setting.html', "text!./templates/Modal.EULA.html"], function () {
    return {
        templates: arguments,
        names: ['Setting', 'Modal.EULA'],
        templatePath: 'templates',
        moduleName: 'baseModule'
    };
});