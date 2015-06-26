/*globals define*/
define(['underscore'], function (_) {
    var templates = {
        templateHTMLs: {},
        compiledTemplates: {},

        load: function (settings) {
            var that = this;
            that.compiledTemplates[settings.moduleName] = {};
            that.templateHTMLs[settings.moduleName] = {};
            var loadTemplate = function (index) {
                var name = settings.names[index];
                that.templateHTMLs[settings.moduleName][name] = settings.templates[index];
                index++;
                if (index < settings.names.length) {
                    loadTemplate(index);
                }
            };
            if (settings.names.length > 0) {
                loadTemplate(0);
            }
        },

        get: function (moduleName, name) {
            var self = this;
            var moduleCompiledTemplates = self.compiledTemplates[moduleName];
            if (!moduleCompiledTemplates[name]) {
                moduleCompiledTemplates[name] = _.template(self.templateHTMLs[moduleName][name]);
                delete self.templateHTMLs[moduleName][name];
            }
            return moduleCompiledTemplates[name];
        }
    };
    return templates;
});