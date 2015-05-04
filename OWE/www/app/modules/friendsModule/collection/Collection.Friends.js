var FriendCollection = Backbone.Collection.extend({
    model: function (attrs, options) {
        return new FriendModel(attrs, options);
    },
    create: function (attrs, options) {
        var friendModel = null,
            self = this;
        if (options && options.wait) {
            friendModel = new this.model(attrs, options);
            if (friendModel && friendModel.isValid()) {
                friendModel.save().done(function () {
                    self.add(friendModel);
                });
            }
        } else {
            return Backbone.Collection.prototype.create.call(this, attrs.options);
        }
    },
    fetch: function (options) {
        var self = this;
        options = options || {};
        var success = options.success || function () {
                return true;
            },
            error = options.error || function () {
                return true;
            };
        DataLayer.getAllFriends().done(function (friends) {
            self.add(friends, {
                validate: true
            });
            success(self.models);
        }).fail(function (message) {
            error(message);
        });
    }
});