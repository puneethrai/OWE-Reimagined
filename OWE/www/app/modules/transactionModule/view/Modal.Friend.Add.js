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
            this.model.on({
                "change:name": this.onNameChange
            }, this);
            _.bindAll(this, 'onClose');
        },
        render: function () {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON()
            }));
            self.$el.modal('show');
            return self;
        },
        events: {
            "tap .dummyAdd": "onNewFriend",
            "hidden.bs.modal": "onRemove"
        },
        onNewFriend: function () {
            this.model.set('name', this.$el.find('.dummyNewName').val(), {validate: true});
            this.model.save({
                success: this.onClose
            });
        },
        onClose: function () {
            this.options.onDone();
        },
        onNameChange: function (model, value) {
            /*jslint unparam:true*/
            this.$el.find('.dummyName').val(value);
        },
        onRemove: function () {
            this.options.onDone();
            this.close(true);
        },
        beforeClose: function () {
            this.$el.modal('hide');
        }
    });
    return AddNewFriend;
});