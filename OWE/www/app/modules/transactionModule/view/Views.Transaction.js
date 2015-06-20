/*global define,templates*/
define(['underscore', 'backbone', 'templates', './Views.Transaction.Friend', './Views.Friend.Transaction', './Modal.Friend.Add', 'viewHandler', 'jquery', 'jqueryTap'], function (_, Backbone, templates, TransactionFriendView, FriendTransactionView, NewFriendView, viewHandler, $) {
    var ViewTransaction = Backbone.View.extend({
        className: "transaction hidden-xs",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction');
            this.model.on({
                "change:name": this.onNameChange,
                "sync": this.onFriendSaved
            }, this);
            this.collection.on({
                add: this.onNewFriendAdded
            }, this);
            this.options.transactions.on({
                add: this.onNewAmountAdded,
                remove: this.onAmountRemoved
            }, this);
            this.TransactionFriendViews = {};
            this.selectedView = null;
            _.bindAll(this, 'onFriendSelected', '_closeNewFriendModal');
        },
        render: function render() {
            var self = this;
            self.$el.html(self.template({
                model: self.model.toJSON(),
                isNew: self.model.isNew()
            }));
            if (self.model.isNew() && !self.model.isSpecial()) {
                self.collection.each(function (model) {
                    if (this.model !== model && !model.isSpecial()) {
                        self.onNewFriendAdded(model);
                    }
                });
            } else {
                self.options.transactions.each(function (model) {
                    self.onNewAmountAdded(model);
                });
            }
            return self;
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "tap .dummyNewFriend": "onNewFriend",
                "tap .dummyDebt, .dummyCredit": "onAddAmount"
            });
        },
        onNewFriend: function () {
            this.NewFriendView = new NewFriendView({
                model: this.model,
                onDone: this._closeNewFriendModal
            });
            viewHandler.render('#Modal', this.NewFriendView);
        },
        _closeNewFriendModal: function () {
            if (this.NewFriendView) {
                this.NewFriendView.close();
                this.NewFriendView = null;
            }
        },
        onNameChange: function (model, value) {
            /*jslint unparam:true*/
            this.$el.find('.dummyMainName').html(value);
        },
        onFriendSaved: function () {
            var cid;
            for (cid in this.TransactionFriendViews) {
                if (this.TransactionFriendViews.hasOwnProperty(cid)) {
                    this.TransactionFriendViews[cid].close(true);
                    delete this.TransactionFriendViews[cid];
                }
            }
        },
        onAddAmount: function (event) {
            var model = this.model.isNew() ? this.selectedView ? this.selectedView.model : null : this.model,
                TYPE = this.options.transactions.model.prototype.TYPE;
            if (model) {
                this._createNewTransaction($(event.currentTarget).hasClass('dummyDebt') ? TYPE.DEBT : TYPE.CREDIT, model.id);
            } else {
                this.$el.find('.dummyFriendList').addClass('animated pulse');
            }
        },
        _createNewTransaction: function (type, userid) {
            this.$el.find('.dummyInputGroup').removeClass('has-error');
            if (!this.options.transactions.create({
                    amount: Number(this.$el.find('.dummyAmount').val()),
                    type: type,
                    userid: userid,
                    date: new Date().getTime()
                }, {validate: true})) {
                this.$el.find('.dummyInputGroup').addClass('has-error');
            } else {
                this.$el.find('.dummyAmount').val('');
            }
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
        onNewAmountAdded: function (model) {
            var self = this;
            if (!this.TransactionFriendViews[model.cid] && (model.get('userid') === self.model.id || (self.model.isSpecial() && !model.get('userid')))) {
                this.TransactionFriendViews[model.cid] = new FriendTransactionView({
                    model: model
                }).render();
                this.$el.find('.dummyFriendList').append(this.TransactionFriendViews[model.cid].$el);
            }
        },
        onAmountRemoved: function (model) {
            if (this.TransactionFriendViews[model.cid]) {
                delete this.TransactionFriendViews[model.cid];
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
        },
        onAnimationEnded: function (event) {
            if ($(event.target).hasClass('dummyFriendList')) {
                $(event.target).removeClass('pulse');
            }
        },
        beforeClose: function (remove) {
            var cid;
            if (remove) {
                this.options.transactions.off(null, null, this);
                for (cid in this.TransactionFriendViews) {
                    if (this.TransactionFriendViews.hasOwnProperty(cid)) {
                        this.TransactionFriendViews[cid].close(remove);
                        delete this.TransactionFriendViews[cid];
                    }
                }
                this._closeNewFriendModal();
            }
        }
    });
    return ViewTransaction;
});