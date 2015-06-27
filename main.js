
({
    baseUrl: "./",
    out: "main-build.js",
    name: 'libs/almond',
    include: ['app/main'],
    paths : {
        // requirejs plugins in use
        text : './libs/require/text',
        i18n : './libs/require/i18n',
        path : './libs/require/path',
        domReady : './libs/require/domReady',
        // namespace that aggregate core classes that are in frequent use
        Boiler : './app/core/_boiler_',
        //Framework
        jquery : './libs/jquery/jquery-min',
        underscore : './libs/underscore/underscore-min',
        backbone : './libs/backbone/backbone-min',
        localforage : './libs/localforage/localforage',
        localforagebackbone : './libs/localforage/localforage.backbone',
        bootstrap: './libs/boostrap/bootstrap.min',
        jqueryTap: './libs/jquery/jquery.tap',
        jquerymove:  './libs/jquery/jquery.event.move',
        jqueryswipe: './libs/jquery/jquery.event.swipe',
        uiswitch: './libs/boostrap/bootstrap-switch.min',
        //Helpers
        templates: './app/core/templates-handler',
        dataLayer: './app/core/data-abstraction',
        backbonehandler: './app/core/backbone-additional-method',
        viewHandler: './app/core/views-handler'
    },
    shim: {
        jquery: {
            exports: ['jQuery', '$']
        },
        underscore: {
            exports: '_'
        },
        backbone: {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },
        localforagebackbone: {
            deps: ['localforage']
        },
        bootstrap: {
            deps: ['jquery']
        },
        bootstrapSelect: {
            deps: ['jquery', 'bootstrap']
        },
        jqueryTap: {
            deps: ['jquery']
        }
    }
})