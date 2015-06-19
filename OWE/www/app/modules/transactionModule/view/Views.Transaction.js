/*global define,templates*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates, $) {
    var ViewTransaction = Backbone.View.extend({
        className: "transaction",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction');
            this.model.on({
                "change:name": this.onNameChange
            }, this);
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template(self.model.toJSON()));
            $("#" + this.options.parentDiv).html(this.$el);
            return self;
        },
        events: {
            "tap .dummyNewFriend": "onNewFriend"
        },
        onNewFriend: function () {
            return false;
        },
        onNameChange: function () {
            return true;
        }
    });
    return ViewTransaction;
});