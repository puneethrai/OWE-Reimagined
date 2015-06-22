/*global define,templates, cordova, Camera*/
define(['underscore', 'backbone', 'templates', 'jquery', 'jqueryTap', 'jquerymove', 'jqueryswipe', 'uiswitch'], function (_, Backbone, templates, $) {
    var Setting = Backbone.View.extend({
        id: "Setting",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('baseModule', 'Setting');
            _.bindAll(this, 'onNotificationChanged', 'onPhoto', 'onPhotoError');
            this.model.on({
            }, this);
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON(),
                isBrowser: cordova.platformId === 'browser'
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
                "tap .dummyBack": "onNavigateBack",
                "tap .dummyPhotoLib": "onPhotoLib",
                "tap .dummyPhotoAlbum": "onPhotoAlbum"
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
        },
        onPhotoLib: function () {
            this._getImage(Camera.PictureSourceType.PHOTOLIBRARY);
        },
        onPhotoAlbum: function () {
            this._getImage(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        },
        _getImage: function (sourcetype) {
            navigator.camera.getPicture(this.onPhoto, this.onPhotoError, {quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType : sourcetype
                });
        },
        onPhoto: function (imageData) {
            this.model.set('backgroundImage', "data:image/jpeg;base64," + imageData);
            this.model.save();
        },
        onPhotoError: function () {
            navigator.notification.alert('Some thing went wrong will getting photo. Make sure you enable our app to access library', null, 'Failed');
        }
    });
    return Setting;
});