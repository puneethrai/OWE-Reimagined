/*global define,templates, cordova, Camera*/
/*jslint browser:true*/
define(['underscore', 'backbone', 'templates', 'jquery', './Modal.EULA', 'viewHandler', 'jqueryTap', 'jquerymove', 'jqueryswipe', 'uiswitch'], function (_, Backbone, templates, $, EUlAView, viewHandler) {
    var Setting = Backbone.View.extend({
        id: "Setting",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('baseModule', 'Setting');
            _.bindAll(this, 'onNotificationChanged', 'onPhoto', 'onPhotoError', '_closeEula');
            this.model.on({
                "change:backgroundImage": this.onBackgroundImage
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
                "tap .dummyRateApp": "onRateApp",
                "tap .dummyRemoveImage": "onRemoveImage",
                "tap .dummyEULA": "onEula"
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
            $('[type=file]').addClass('hide');
            Backbone.history.navigate('temp');
            Backbone.history.navigate(hash, {trigger: true});
            if (!this.closed) {
                Backbone.history.navigate('', {trigger: true});
            }
        },
        onRemoveImage: function () {
            this.model.save({backgroundImage: ""});
        },
        onBackgroundImage: function (model, value) {
            /*jslint unparam:true*/
            if (value) {
                this.$el.find('.dummyRemoveImage').removeClass('hide');
            } else {
                this.$el.find('.dummyRemoveImage').addClass('hide');
            }
        },
        onPhotoLib: function () {
            if ((cordova.platformId === 'browser' && !$('[type=file]').length) || cordova.platformId !== 'browser') {
                this._getImage(Camera.PictureSourceType.PHOTOLIBRARY);
                if (cordova.platformId === 'browser') {
                    this.onResizeView(this._height, this._width);
                }
            } else if (cordova.platformId === 'browser' && $('[type=file]').length) {
                $('[type=file]').removeClass('hide');
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
        onResizeView: function (height) {
            var fileInput = $('[type=file]')[0],
                photoRect = this.$el.find('.dummyPhotoLib')[0].getClientRects().item(0);
            if (fileInput) {
                $(fileInput).css({
                    top: photoRect.top,
                    right: 0
                });
            }
            this.$el.css({
                'max-height' : height - Number(this.$el.find('nav').height()) - 10 - Number(this.$el.find('.dummyTitle').height())
            });
            Backbone.View.prototype.onResizeView.apply(this, arguments);
        },
        onEula: function () {
            this._closeEula();
            this.eUlAView = new EUlAView({
                onClose: this._closeEula
            });
            viewHandler.render(viewHandler.DIV.MODAL, this.eUlAView);
        },
        _closeEula: function () {
            if (this.eUlAView) {
                this.eUlAView.close(true);
                this.eUlAView = null;
            }
        },
        beforeClose: function () {
            $('[type=file]').addClass('hide');
            this._closeEula();
        }
    });
    return Setting;
});