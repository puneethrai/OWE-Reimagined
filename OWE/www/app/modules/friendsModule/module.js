/*globals define*/
/*jslint browser:true*/
define(['Boiler', 'templates', './settings', './router/Router.Friends'], function (Boiler, templates, settings, FriendsRouter) {
    return {
        initialize : function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext),
                router = new FriendsRouter();
            context.addSettings(settings);
            templates.load(settings);
            window.app.friends = {
                context: context,
                router: router
            };
            window.app.friends.context.listen(window.app.Events.Migration.FriendsData, function (data) {
                router.FriendCollection.add(data);
                router.FriendCollection.sync("create", router.FriendCollection);
            });
            window.app.context.listen(window.app.Events.Migration.Migrated, function () {
                router.FriendCollection.sync("read", router.FriendCollection);
            });
        }
    };

});