/*
 * Definition of the base module. Base module contain some common components some one may use in
 * creating own application. These components are not a core part of BoilerplateJS, but available as samples.
 */
/*globals define*/
/*jslint browser:true*/
define(['Boiler', 'templates', './settings', './router/Router.Friends'], function (Boiler, templates, settings, FriendsRouter) {

    // Definition of the base Module as an object, this is the return value of this AMD script
    return {
        initialize : function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext);
            context.addSettings(settings);
            templates.load(settings);
            window.app.friends = {
                context: context,
                router: new FriendsRouter()
            };
        }
    };

});