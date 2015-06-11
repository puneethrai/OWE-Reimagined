/*globals define*/
define(['backbone', '../model/Model.Friend'], function (Backbone, FriendModel) {

    var FriendCollection = Backbone.Collection.extend({
        sync: Backbone.localforage.sync('Friends'),
        model: FriendModel,
        create: function (attrs, options) {
            var friendModel = null,
                self = this;
            if (options && options.wait) {
                friendModel = new this.model(attrs, options);
                if (friendModel && friendModel.isValid()) {
                    friendModel.save({
                        success: function () {
                            self.add(friendModel);
                        }
                    });
                }
            } else {
                return Backbone.Collection.prototype.create.call(this, attrs.options);
            }
        }
    });
    return FriendCollection;
});