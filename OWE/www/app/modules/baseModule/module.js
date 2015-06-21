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
        DataLayer = require('dataLayer'),
        templates = require('templates'),
        settings = require('./settings'),
        viewHandler = require('viewHandler'),
        settingModel = require('./setting/model/Model.Setting'),
        SettingView = require('./setting/view/Views.Setting');

    // Definition of the base Module as an object, this is the return value of this AMD script
    return {
        initialize: function (parentContext) {
            //create module context by assiciating with the parent context
            var self = this,
                context = new Boiler.Context(parentContext);
            _.bindAll(this, 'startMigration', 'onRenderSettingView');
            context.addSettings(settings);
            templates.load(settings);
            window.app.baseModule = {
                context: context,
                renderSettingView: this.onRenderSettingView
            };
            localStorage.on('change:migrated', this.onMigrationComplete, this);
            settingModel.fetch();
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
                }).fail(function () {
                    navigator.notification.confirm("Looks like migration failed . Did you had any transaction? . Press cancel to continue without migration", function (index) {
                        if (index === 2) {
                            model.save({
                                migrated: true
                            });
                        } else {
                            window.app.baseModule.context.notify(window.app.Events.Migration.Clear);
                            self.startMigration(model);
                        }
                    }, 'Migration failed');
                });
            }
        },
        onMigrationComplete: function (model, value) {
            if (value) {
                window.app.baseModule.context.notify(window.app.Events.Migration.Migrated);
                model.off(null, null, this);
            }
        },
        onRenderSettingView: function () {
            this.SettingView = new SettingView({
                model: settingModel
            });
            viewHandler.render(viewHandler.DIV.RIGHT, this.SettingView);
        }
    };

});