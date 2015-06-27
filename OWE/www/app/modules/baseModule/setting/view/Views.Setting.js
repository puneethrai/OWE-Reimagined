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
                isBrowser: cordova.platformId === 'browser',
                supportsSavedLib: (cordova.platformId !== 'windowsphone' && cordova.platformId !== 'browser')
            }));
            self.$el.find(".dummyNotification").bootstrapSwitch({
                size: 'small',
                onSwitchChange: this.onNotificationChanged,
                state: this.model.get('notification')
            });
            return self;
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "tap .dummyBack": "onNavigateBack",
                "tap .dummyPhotoLib": "onPhotoLib",
                "tap .dummyPhotoAlbum": "onPhotoAlbum",
                "tap .dummyRateApp": "onRateApp"
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
            if ((cordova.platformId === 'browser' && !$('[type=file]').length) || cordova.platformId !== 'browser') {
                this._getImage(Camera.PictureSourceType.PHOTOLIBRARY);
                if (cordova.platformId === 'browser') {
                    this.onResizeView();
                }
            }
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
            navigator.notification.alert('Some thing went wrong while getting photo. Make sure you enable our app to access library', null, 'Failed');
        },
        onRateApp: function () {
            this.model.rateApp();
        },
        onResizeView: function () {
            var fileInput = $('[type=file]')[0],
                photoRect = this.$el.find('.dummyPhotoLib')[0].getClientRects().item(0);
            if (fileInput) {
                $(fileInput).css({
                    top: photoRect.top,
                    right: 0
                });
            }
        }
    });
    return Setting;
});