/*globals define*/
/*jslint browser:true, sloppy:true*/
define(function (require) {
    /*jslint unparam:true*/
    //dependencies
    var Boiler = require("Boiler"), // BoilerplateJS namespace used to access core classes, see above for the definition
        settings = require("./settings"), //global settings file of the product suite
        modules = require("./modules/modules"), //file where all of your product modules will be listed
        $ = require('jquery'),
        Backbone = require("backbone"),
        DataLayer = require("dataLayer");
    //Load the files which won't be explicitly called by other file
    require("localforagebackbone");
    //return an object with the public interface for an 'application' object. Read about module pattern for details.
    return {
        initialize: function () {
            var globalContext = new Boiler.Context();
            globalContext.addSettings(settings);
            window.app = {
                context: globalContext,
                Events: {
                    Migration: {
                        TransactionsData: "Events.Migration.TransactionData",
                        FriendsData: "Events.Migration.FriendsData"
                    }
                },
                scrollDown: function (scrollToValue, scrollwindow) {
                    if ($.fn.animate) {
                        // Or you can animate the scrolling:Performance might get affected
                        $(scrollwindow || "body").animate({
                            scrollTop: scrollToValue
                        });
                    } else {
                        $(scrollwindow || "body").scrollTop(scrollToValue);
                    }
                },
                scrollStop: function (scrollwindow) {
                    $(scrollwindow || "body").stop();
                }
            };
            document.addEventListener('deviceready', this.startLoadingModules, false);
        },
        startLoadingModules: function () {
            /* In JavaScript, functions can be used similarly to classes in OO programming. Below,
             * we create an instance of 'Boiler.Context' by calling the 'new' operator. Then add
             * global settings. These will be propagated to child contexts
             */
            /* In BoilerplateJS, your product module hierachy is associated to a 'Context' heirachy. Below
             * we create the global 'Context' and load child contexts (representing your product sub modules)
             * to create a 'Context' tree (product modules as a tree).
             */
            var index = 0;
            DataLayer.initialize().done(function () {
                for (index = 0; index < modules.length; index++) {
                    modules[index].initialize(window.app.context);
                }
                if (!Backbone.History.started) {
                    Backbone.history.start();
                }
            });
        }
    };
});