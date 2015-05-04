/*globals define*/
define(['Boiler', './router/Router.Transactions'], function (Boiler, TransactionRouter) {


    // Definition of the base Module as an object, this is the return value of this AMD script
    return {
        initialize : function (parentContext) {
            //create module context by assiciating with the parent context
            var context = new Boiler.Context(parentContext);
        }
    };

});