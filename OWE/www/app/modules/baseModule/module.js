/*
 * Definition of the base module. Base module contain some common components some one may use in
 * creating own application. These components are not a core part of BoilerplateJS, but available as samples.
 */
/*globals define*/
/*jslint browser:true*/
define(function (require) {

    // Load the dependencies
    var Boiler = require('Boiler'),
        localStorage = require('./localStorage/model/Model.Localstorage'),
        _ = require('underscore'),
        DataLayer = require('dataLayer');

    // Definition of the base Module as an object, this is the return value of this AMD script
    return {
        initialize: function (parentContext) {
            //create module context by assiciating with the parent context
            var self = this,
                context = new Boiler.Context(parentContext);
            window.app.baseModule = {
                context: context
            };
            _.bindAll(this, 'startMigration');
            localStorage.on('change:migrated', this.onMigrationComplete, this);
            setTimeout(function () {
                localStorage.fetch({
                    success: self.startMigration,
                    //First time if localstorage it not there it will fail
                    error: self.startMigration
                });

            });
        },
        startMigration: function (model) {
            var self = this;
            if (!model.get('migrated')) {
                DataLayer.initialize().done(function () {
                    DataLayer.getAllFriends().done(function (friends) {
                        window.app.baseModule.context.notify(window.app.Events.Migration.FriendsData, friends);
                        DataLayer.getAllTransaction().done(function (transactions) {
                            window.app.baseModule.context.notify(window.app.Events.Migration.TransactionsData, transactions);
                            navigator.notification.confirm("Migration completed, Total: " + transactions.length + " transaction found and " + friends.length + " friends found. Press cancel to retry", function (index) {
                                if (index === 1) {
                                    model.save({
                                        migrated: true
                                    });
                                } else {
                                    window.app.baseModule.context.notify(window.app.Events.Migration.Clear);
                                    self.startMigration(model);
                                }
                            }, 'Migration completed');
                        });
                    });
                });
            }
        },
        onMigrationComplete: function (model, value) {
            if (value) {
                window.app.baseModule.context.notify(window.app.Events.Migration.Migrated);
                model.off(null, null, this);
            }
        }
    };

});