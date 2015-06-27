/*globals define,cordova*/
/*jslint browser:true, sloppy:true*/
define(["Boiler", "./settings", "./modules/modules", "jquery", "underscore", "viewHandler", "backbone", "localforage", "localforagebackbone", "backbonehandler", "bootstrap"], function (Boiler, settings, modules, $, _, viewHandler, Backbone) {
    /*jslint unparam:true*/
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
                        FriendsData: "Events.Migration.FriendsData",
                        Migrated: "Events.Migration.Migrated",
                        Clear: "Events.Migration.Clear",
                    },
                    RateApp: "Events.RateApp"
                },
                ID: {
                    LocalstorageModel: "Localstorage",
                    TransactionModel: "Transaction",
                    TransactionCollection: "Transactions",
                    FriendModel: "Friend",
                    FriendCollection: "Friends"
                },
                rateApp: function () {
                    var url;
                    switch (cordova.platformId) {
                    case 'windowsphone':
                        url = encodeURI('zune://navigate?appid=' + this.context.getSettings().appID.wp);
                        break;
                    }
                    if (url) {
                        window.open(url, '_self', null);
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
                },
                getAnimationListner: function (functionName) {
                    return {
                        webkitAnimationEnd: functionName,
                        mozAnimationEnd: functionName,
                        MSAnimationEnd: functionName,
                        oanimationend: functionName,
                        animationend: functionName
                    };
                }
            };
            _.bindAll(this, 'startLoadingModules');
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
            $(window).on("resize", this.updateView);
            $(window).on("orientationchange", this.updateView);
            for (index = (modules.length - 1); index >= 0; index--) {
                modules[index].initialize(window.app.context);
            }
            window.app.context.listen(window.app.Events.Migration.Migrated, function () {
                Backbone.history.navigate('', {replace: true});
                if (!Backbone.History.started) {
                    Backbone.history.start();
                }
            });
            this.updateView();
        },
        updateView: function () {
            var height = $(window).height(),
                width = $(window).width();
            $('#Left, #Right').css({
                'min-height': height,
                'max-height': height
            });
            viewHandler.onWindowResize(height, width);
        }
    };
});