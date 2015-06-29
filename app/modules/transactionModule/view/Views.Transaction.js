/*global define,templates*/
define(['underscore', 'backbone', 'templates', './Views.Transaction.Friend', './Views.Friend.Transaction', './Modal.Friend.Add', 'viewHandler', 'jquery', 'jqueryTap'], function (_, Backbone, templates, TransactionFriendView, FriendTransactionView, NewFriendView, viewHandler, $) {
    var ViewTransaction = Backbone.View.extend({
        className: "transaction",
        initialize: function initilization(options) {
            this.options = options;
            this.template = templates.get('transaction', 'Transaction');
            this.model.on({
                "change:name": this.onNameChange
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
            this.transactionAdded = false;
            self.$el.html(self.template({
                model: self.model.toJSON(),
                isNew: self.model.isNew(),
                tempValue: self.$el.find('.dummyAmount').val()
            }));
            if (self.model.isNew() && !self.model.isSpecial()) {
                self.collection.each(function (model) {
                    self.onNewFriendAdded(model);
                });
            } else {
                self.options.transactions.each(function (model) {
                    self.onNewAmountAdded(model);
                });
            }
            return self;
        },
        postRendering: function () {
            var self = this;
            self.animationCount = Object.keys(self.TransactionFriendViews).length;
            self.onResizeView(this._height);
            if (!self.animationCount && this.model.isNew()) {
                self._addTooltip();
            } else {
                self._removeTooltip();
            }
        },
        _addTooltip: function () {
            this.$el.find('.dummyNewFriend').tooltip({title: 'Lets add new friend'}).tooltip('show');
            this.$el.find('.dummyDebt').tooltip({title: 'To give to a friend'}).tooltip('show');
            this.$el.find('.dummyCredit').tooltip({
                title: 'To get from friend',
                placement: 'bottom'
            }).tooltip('show');
            this._tooltipped = true;
        },
        _hideTooltip: function () {
            if (this._tooltipped) {
                this.$el.find('.dummyNewFriend').tooltip('hide');
                this.$el.find('.dummyDebt').tooltip('hide');
                this.$el.find('.dummyCredit').tooltip('hide');
            }
        },
        _removeTooltip: function () {
            if (this._tooltipped) {
                this.$el.find('.dummyNewFriend').tooltip('destroy');
                this.$el.find('.dummyDebt').tooltip('destroy');
                this.$el.find('.dummyCredit').tooltip('destroy');
                this._tooltipped = false;
            }
        },
        events: function () {
            return _.extend(window.app.getAnimationListner('onAnimationEnded'), {
                "tap .dummyNewFriend": "onNewFriend",
                "tap .dummyDebt, .dummyCredit": "onAddAmount",
                "tap .dummyBack": "onGoBack",
                "submit .dummyForm": "onFormSubmit",
                "tap .dummyShowSetting": "onRenderSetting"
            });
        },
        onFormSubmit: function () {
            return false;
        },
        onGoBack: function () {
            this.options.onCompleted();
        },
        onNewFriend: function () {
            this._removeTooltip();
            this.NewFriendView = new NewFriendView({
                collection: this.collection,
                onDone: this._closeNewFriendModal
            });
            viewHandler.render(viewHandler.DIV.MODAL, this.NewFriendView);
        },
        _closeNewFriendModal: function (model) {
            if (this.NewFriendView) {
                this.NewFriendView.close();
                this.NewFriendView = null;
                if (model) {
                    this.model.off(null, null, this);
                    this.model = model;
                    this.onFriendSaved();
                }
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
            this.render();
        },
        onAddAmount: function (event) {
            var model = this.model.isNew() ? this.selectedView ? this.selectedView.model : null : this.model,
                TYPE = this.options.transactions.model.prototype.TYPE;
            if (model) {
                this._createNewTransaction($(event.currentTarget).hasClass('dummyDebt') ? TYPE.DEBT : TYPE.CREDIT, model.id);
            } else if (!Object.keys(this.TransactionFriendViews).length) {
                this.$el.find('.dummyAmount').blur();
                this.onNewFriend();
            } else {
                this.$el.find('.dummyFriendList').addClass('animated pulse');
            }
        },
        _createNewTransaction: function (type, userid) {
            var self = this;
            this.$el.find('.dummyInputGroup').removeClass('has-error');
            if (!this.options.transactions.create({
                    amount: Number(this.$el.find('.dummyAmount').val()),
                    type: type,
                    userid: userid,
                    date: new Date().getTime()
                }, {
                    validate: true,
                    success: function () {
                        self.options.onCompleted(userid);
                    }
                })) {
                this.$el.find('.dummyInputGroup').addClass('has-error');
            } else {
                this.$el.find('.dummyAmount').val('');
                this.transactionAdded = true;
            }
        },
        onNewFriendAdded: function (model) {
            if (!this.TransactionFriendViews[model.cid] && this.model !== model && !model.isSpecial()) {
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
            this.$el.find('.dummyFriendList').css({
                'max-height': height - Number(this.$el.find('.dummyNav').height()) - Number(this.$el.find('.dummyUserAction').height()) - 20
            });
            Backbone.View.prototype.onResizeView.apply(this, arguments);
            if (this._tooltipped) {
                this._hideTooltip();
                this._addTooltip();
            }
        },
        onAnimationEnded: function (event) {
            if ($(event.target).hasClass('dummyFriendList')) {
                $(event.target).removeClass('pulse');
            } else if ($(event.target).hasClass('FriendTransaction') && this.transactionAdded) {
                this.options.onCompleted();
            } else if ($(event.target).hasClass('FriendTransaction')) {
                --this.animationCount;
                if (!(this.animationCount)) {
                    this.onResizeView(this._height);
                }

            }
        },
        beforeClose: function (remove) {
            var cid;
            if (remove) {
                this._removeTooltip();
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