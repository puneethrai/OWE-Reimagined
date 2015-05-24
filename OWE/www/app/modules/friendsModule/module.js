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
                context: context,
                router: new FriendsRouter()
            };
            window.app.friends.context.listen(window.app.Events.FriendsData, function (data) {
                window.app.friends.router.FriendCollection(data);
            });
        }
    };

});