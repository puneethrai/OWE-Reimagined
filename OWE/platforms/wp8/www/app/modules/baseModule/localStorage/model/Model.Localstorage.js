/*globals define*/
define(['backbone'], function (Backbone) {
    var Localstorage = Backbone.Model.extend({
        sync: Backbone.localforage.sync('Localstorage')
    });
    return new Localstorage({
        id: 'Localstorage'
    });
});