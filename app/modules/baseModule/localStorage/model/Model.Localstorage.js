/*globals define*/
define(['backbone', "localforage", "localforagebackbone"], function (Backbone) {
    var Localstorage = Backbone.Model.extend({
        sync: Backbone.localforage.sync('Localstorage')
    });
    return new Localstorage({
        id: 'Localstorage'
    });
});