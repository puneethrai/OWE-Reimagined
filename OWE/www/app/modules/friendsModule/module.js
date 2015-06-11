/*globals define*/
/*jslint browser:true*/
define(['Boiler', 'templates', './settings', './router/Router.Friends'], function (Boiler, templates, settings, FriendsRouter) {
    return {
        initialize : function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext);
            context.addSettings(settings);
            templates.load(settings);
            window.app.friends = {
                context: context
            };
            window.app.friends.router = new FriendsRouter();
        }
    };

});