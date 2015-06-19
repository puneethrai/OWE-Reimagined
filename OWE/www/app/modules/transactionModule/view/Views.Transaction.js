/*global define,templates*/
define(['underscore', 'backbone', 'templates', './Views.Transaction.Friend', 'jquery', 'jqueryTap'], function (_, Backbone, templates, TransactionFriendView) {
    var ViewTransaction = Backbone.View.extend({
        className: "transaction hidden-xs",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction');
            this.model.on({
                "change:name": this.onNameChange
            }, this);
            this.collection.on({
                "add": this.onNewFriendAdded
            }, this);
            this.TransactionFriendViews = {};
            this.selectedView = null;
            _.bindAll(this, 'onFriendSelected');
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON(),
                isNew: self.model.isNew()
            }));
            if (self.model.isNew()) {
                self.collection.each(function (model) {
                    if (this.model !== model) {
                        self.onNewFriendAdded(model);
                    }
                });
            }
            return self;
        },
        events: {
            "tap .dummyNewFriend": "onNewFriend"
        },
        onNewFriend: function () {
            return false;
        },
        onNameChange: function () {
            return true;
        },
        onNewFriendAdded: function (model) {
            if (!this.TransactionFriendViews[model.cid]) {
                this.TransactionFriendViews[model.cid] = new TransactionFriendView({
                    model: model,
                    onSelect: this.onFriendSelected
                }).render();
                this.$el.find('.dummyFriendList').append(this.TransactionFriendViews[model.cid].$el);
            }
        },
        onFriendSelected: function (view) {
            if (this.selectedView && this.selectedView !== view) {
                this.selectedView.onDeselect();
            }
            this.selectedView = view;
        },
        onResizeView: function (height) {
            this.$el.find('.dummyTransaction').css({
                'max-height': height - Number(this.$el.find('.dummyNav').height()) - 20
            });
        }
    });
    return ViewTransaction;
});