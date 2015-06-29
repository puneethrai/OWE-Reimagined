/*global define,templates*/
define(['underscore', 'backbone', 'templates', 'jquery', 'jqueryTap'], function (_, Backbone, templates) {
    /*jslint unparam:true*/
    var EULA = Backbone.View.extend({
        id: "EULA",
        className: "modal fade",
        attributes: {
            tabindex: "-1",
            role: "dialog",
            'aria-hidden': "true"
        },
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('baseModule', 'Modal.EULA');
        },
        render: function () {
            var self = this;
            self.$el.html(self.template());
            self.$el.modal('show');
            return self;
        },
        events: function () {
            return {
                "hidden.bs.modal": "onRemove",
                "shown.bs.modal": "onRendered"
            };
        },
        onRendered: function () {
            var self = this;
            self._calculate();
        },
        _calculate: function () {
            var headerHeight, footerHeight;
            try {
                headerHeight = this.$el.find('.modal-header')[0].getClientRects().item(0).height;
                footerHeight = this.$el.find('.modal-footer')[0].getClientRects().item(0).height;
            } catch (e) {
                headerHeight = this.$el.find('.modal-header').height();
                footerHeight = this.$el.find('.modal-footer').height();
            }
            this.$el.find('.dummyContent').css({
                'max-height': this._height - Number(headerHeight) - Number(footerHeight) - parseInt(this.$el.find('.modal-dialog').css("margin-top"), 10) - parseInt(this.$el.find('.modal-dialog').css("margin-bottom"), 10)
            });
        },
        onResizeView: function () {
            this._calculate();
            Backbone.View.prototype.onResizeView.apply(this, arguments);
        },
        onRemove: function () {
            this.options.onClose();
        },
        beforeClose: function () {
            this.$el.modal('hide');
        }
    });
    return EULA;
});