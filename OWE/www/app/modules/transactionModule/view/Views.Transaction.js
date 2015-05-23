/*global define,templates, DataLayer*/
define(['backbone', 'templates', 'dataLayer', 'jquery', 'jqueryTap'], function (Backbone, templates, DataLayer) {
    var ViewTransaction = Backbone.View.extend({
        className: "transaction col-xs-12 col-sm-6 col-md-4",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction');
            this.model.on({
                "destroy": this.onDestroy,
                "change:amount": this.onAmountChange,
                "change:type": this.onChangeTransactionType
            }, this);
        },
        render: function render() {
            var self = this;
            this.$el.html(this.template(this.model.toJSON()));
            this.currentTypeClass = this.model.get("type") === this.model.TYPE.DEBT ? "out" : "in";
            setTimeout(function () {
                var friendModel = self.options.friendCollection.findWhere({
                    id: parseInt(self.model.get("userid"), 10)
                });
                if (friendModel) {
                    self.$el.find(".dummyFriendName").html(friendModel.get("name"));
                } else {
                    DataLayer.getFriendByID(parseInt(self.model.get("userid"), 10)).done(function (friend) {
                        //interested only in success case
                        self.$el.find(".dummyFriendName").html(friend.name);
                    });
                }
            }, 0);
            return this;
        },
        events: {
            "tap .dummyDelete": "onRemoveTransaction"
        },
        onRemoveTransaction: function onRemoveTransaction() {
            this.model.destroy();
            return false;
        },
        onAmountChange: function (model, amount) {
            /*jslint unparam:true*/
            this.$el.find(".dummyUserAmount").html("<i class=fa fa-inr''></i>" + amount);
        },
        onChangeTransactionType: function (model, type) {
            this.$el.find(".transaction-container").removeClass(this.currentTypeClass);
            this.currentTypeClass = type === model.TYPE.DEBT ? "out" : "in";
            this.$el.find(".transaction-container").addClass(this.currentTypeClass);
        },
        onDestroy: function onDestroy(model) {
            /*jslint unparam:true*/
            this.model.off(null, null, this);
            this.remove();
        }

    });
    return ViewTransaction;
});