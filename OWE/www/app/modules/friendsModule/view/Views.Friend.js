/*globals define*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates) {
    var ViewFriend = Backbone.View.extend({
        className: "friend col-xs-12 col-sm-6 col-md-4",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('friend', 'Friend');
            this.model.on({
                "destroy": this.onDestroy,
                "change:name": this.onNameChange
            }, this);
        },
        render: function render() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        events: {
            "tap .dummyDelete": "onRemoveTransaction",
        },
        onRemoveTransaction: function onRemoveTransaction() {
            this.model.destroy();
            return false;
        },
        onNameChange: function (model, value) {
            /*jslint unparam:true*/
            this.$el.find(".displayName").html("Friend Name:" + value);
        },
        onDestroy: function onDestroy(model) {
            /*jslint unparam:true*/
            this.model.off(null, null, this);
            this.remove();
        }

    });
    return ViewFriend;
});