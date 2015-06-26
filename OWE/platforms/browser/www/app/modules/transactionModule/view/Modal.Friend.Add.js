/*global define,templates*/
define(['underscore', 'backbone', 'templates', 'jquery', 'jqueryTap'], function (_, Backbone, templates) {
    var AddNewFriend = Backbone.View.extend({
        id: "AddNewFriend",
        className: "modal fade",
        attributes: {
            tabindex: "-1",
            role: "dialog",
            'aria-hidden': "true"
        },
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Modal.Friend.Add');
            _.bindAll(this, 'onClose');
        },
        render: function () {
            var self = this;
            self.$el.html(self.template());
            self.$el.modal('show');
            return self;
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "tap .dummyAdd": "onNewFriend",
                "hidden.bs.modal": "onRemove",
                "shown.bs.modal": "onRendered"
            });
        },
        onRendered: function () {
            this.$el.find('.dummyNewName').focus();
        },
        onNewFriend: function () {
            if (!this.collection.create({
                    name: this.$el.find('.dummyNewName').val()
                }, {
                    validate: true,
                    success: this.onClose,
                    error: function () {
                        console.error(arguments);
                    }
                })) {
                this.$el.find('.dummyNewName').addClass('animated shake');
            }
        },
        onClose: function (model) {
            this.options.onDone(model);
        },
        onNameChange: function (model, value) {
            /*jslint unparam:true*/
            this.$el.find('.dummyName').val(value);
        },
        onRemove: function () {
            this.options.onDone();
            this.close(true);
        },
        onAnimationEnded: function () {
            this.$el.find('.dummyNewName').removeClass('animated shake');
        },
        beforeClose: function () {
            this.$el.modal('hide');
        }
    });
    return AddNewFriend;
});