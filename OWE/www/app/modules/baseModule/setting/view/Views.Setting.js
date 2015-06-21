/*global define,templates*/
define(['underscore', 'backbone', 'templates', 'jquery', 'jqueryTap', 'jquerymove', 'jqueryswipe', 'uiswitch'], function (_, Backbone, templates, $) {
    var Setting = Backbone.View.extend({
        id: "Setting",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('baseModule', 'Setting');
            _.bindAll(this, 'onNotificationChanged');
            this.model.on({
            }, this);
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON()
            }));
            self.$el.find(".dummyNotification").bootstrapSwitch({
                size: 'mini',
                onSwitchChange: this.onNotificationChanged,
                state: this.model.get('notification')
            });
            return self;
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "change .dummyNotification": "onNotificationChanged",
                "tap .dummyBack": "onNavigateBack"
            });
        },
        onAnimationEnded: function () {
            if (this.$el.hasClass('zoomOutDown')) {
                this.close(true);
            }
        },
        onNotificationChanged: function (event) {
            this.model.set({notification: $(event.target).is(':checked')});
            this.model.save();
        },
        onNavigateBack: function () {
            var hash = location.hash;
            Backbone.history.navigate('temp');
            Backbone.history.navigate(hash, {trigger: true});
            if (!this.closed) {
                Backbone.history.navigate('', {trigger: true});
            }
        }
    });
    return Setting;
});