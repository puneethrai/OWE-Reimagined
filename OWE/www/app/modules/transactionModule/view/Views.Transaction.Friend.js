/*global define,templates*/
define(['backbone', 'templates', 'jquery', 'jqueryTap'], function (Backbone, templates) {
    var FriendTransaction = Backbone.View.extend({
        className: "FriendTransaction animated slideInRight",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction.Friend');
            this.model.on({
                "change:name": this.onNameChange
            }, this);
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON()
            }));
            return self;
        },
        events: {
            "tap": "onSelect"
        },
        onSelect: function () {
            this.$el.toggleClass('select');
            this.options.onSelect(this.$el.hasClass('select') ? this : null);
        },
        onDeselect: function () {
            this.$el.removeClass('select');
        },
        onNameChange: function (model, value) {
            /*jslint unparam:true*/
            this.$el.find('.dummyName').val(value);
        }
    });
    return FriendTransaction;
});