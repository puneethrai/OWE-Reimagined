/*global define,templates*/
define(['underscore', 'backbone', 'templates', 'jquery', 'jqueryTap', 'jquerymove', 'jqueryswipe'], function (_, Backbone, templates) {
    var FriendTransaction = Backbone.View.extend({
        className: "FriendTransaction animated slideInRight",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Friend.Transaction');
            this.model.on({
                "change:deleted": this.onDeleted,
                'destroy': this.onDestroy
            }, this);
        },
        render: function render() {
            var self = this,
                date = new Date(0);
            date.setMilliseconds(Number(self.model.get('date')));
            self.$el.html(self.template({
                model: self.model.toJSON(),
                date: date.toDateString()
            }));
            self.onDeleted(self.model, self.model.get('deleted'));
            self.$el.addClass(self.model.get('type') === self.model.TYPE.DEBT ? 'debt' : 'credit');
            return self;
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "tap .dummyDelete": "onDelete",
                "tap .dummyDestroy": "onDestroyTransaction",
                "swiperight" : "onDelete"
            });
        },
        onDelete: function () {
            this.model.set('deleted', true).save();
        },
        onDeleted: function (model, value) {
            /*jslint unparam:true*/
            if (value) {
                this.$el.addClass('deleted');
                this.$el.find('.dummyDelete').removeClass('fa-times-circle dummyDelete').addClass('fa-trash dummyDestroy');
            } else {
                this.$el.removeClass('deleted');
                this.$el.find('.dummyDestroy').removeClass('fa-trash dummyDestroy').addClass('fa-times-circle dummyDelete');
            }
        },
        onAnimationEnded: function () {
            if (this.$el.hasClass('zoomOutDown')) {
                this.close(true);
            }
        },
        onDestroyTransaction: function () {
            this.model.destroy();
        },
        onDestroy: function () {
            this.$el.removeClass('slideInRight').addClass('zoomOutDown');
        }
    });
    return FriendTransaction;
});