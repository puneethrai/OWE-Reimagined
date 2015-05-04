/*global Backbone,templates,$,ViewTransaction,app,_*/
var ViewTransactions = Backbone.View.extend({
    id: "Transaction",
    className: "container",
    initialize: function initialize(options) {
        this.options = options;
        this.template = templates.get('transaction', 'Transactions');
        this.collection.on({
            "add": this.onNewTransaction,
            "remove": this.onDeleteTransaction
        }, this);
        this.options.friendCollection.on({
            "add": this.onNewFriends,
            "remove": this.onRemoveFriends
        }, this);
        this.tAmount = 0;
        this.yAmount = 0;
        this.newFriend = "";
        this.waitingForNewFriend = null;
        _.bindAll(this, "updateScroll");
        $(window).on("resize", this.updateScroll);
        $(window).on("orientationchange", this.updateScroll);
    },
    render: function render() {
        var self = this,
            modelIndex = 0;
        this.$el.html(this.template());
        this.$el.find(".dummyFriends").selectpicker('render');
        $("#" + this.options.parentDiv).append(this.$el);
        for (modelIndex = 0; modelIndex < this.collection.models.length; modelIndex++) {
            this._createTransactionView(this.collection.models[modelIndex]);
        }
        setTimeout(function () {
            for (modelIndex = 0; modelIndex < self.options.friendCollection.models.length; modelIndex++) {
                self.onNewFriends(self.options.friendCollection.models[modelIndex]);
            }
            self.$el.find(".shrink").removeClass("shrink");
        }, 0);
        this.updateScroll();
        return this;
    },
    events: {
        "tap .dummyDebt": "onAddDebt",
        "tap .dummyCredit": "onAddCredit",
        "NoResult": "onNoResult",
        "ResultFound": "onResultFound"
    },

    onNewTransaction: function onNewTransaction(model, collection) {
        /*jslint unparam:true*/
        var transactionView = this._createTransactionView(model);
        if (model.isNew()) {
            model.save();
            app.scrollDown(transactionView.$el.offset().top - this.$el.find(".dummyTransaction").offset().top + this.$el.find(".dummyTransaction").scrollTop(), this.$el.find(".dummyTransaction"));
        }

    },
    onNoResult: function (event, name) {
        /*jslint unparam:true*/
        this.newFriend = name;
    },
    onResultFound: function (event, name) {
        /*jslint unparam:true*/
        this.newFriend = "";
    },
    onAddDebt: function onAddDebt() {
        this._onAddToCollection(this.$el.find(".dummyAmount").val(), "-", this.$el.find(".dummyFriends").val());
    },
    onAddCredit: function onAddCredit() {
        this._onAddToCollection(this.$el.find(".dummyAmount").val(), "+", this.$el.find(".dummyFriends").val());
    },
    _onAddToCollection: function _onAddToCollection(amount, type, userid) {
        this.$el.find(".has-feedback").removeClass("has-error").find(".form-control-feedback").removeClass("glyphicon-remove");
        var tempModel = new this.collection.model(this.waitingForNewFriend || {
            amount: Number(Number(amount).toFixed(4)),
            type: type,
            userid: parseInt(userid, 10)
        });
        if (tempModel.isValid()) {
            if (this.newFriend) {
                this.waitingForNewFriend = {
                    amount: Number(Number(amount).toFixed(4)),
                    type: type
                };

                this.options.friendCollection.create({
                    name: this.newFriend
                }, {
                    wait: true
                });
                this.newFriend = "";
            } else {
                this.collection.add(this.waitingForNewFriend || tempModel, {
                    validate: true
                });
            }
        } else {
            this.$el.find(".has-feedback").addClass("has-error").find(".form-control-feedback").addClass("glyphicon-remove");
        }
    },
    onDeleteTransaction: function onDeleteTransaction(model) {
        if (model.get("type") === model.TYPE.DEBT) {
            this.tAmount -= model.get("amount");
            this.$el.find(".dummyTCount").html(this.tAmount);
        } else {
            this.yAmount -= model.get("amount");
            this.$el.find(".dummyYCount").html(this.yAmount);
        }
    },
    onNewFriends: function (model, collection) {
        /*jslint unparam:true*/
        var self = this;
        self.$el.find("select.dummyFriends").append($("<option>").attr("value", model.get("id")).html(model.get("name")));
        if (self.waitingForNewFriend) {
            self.waitingForNewFriend.userid = model.get("id");
            self._onAddToCollection();
            self.waitingForNewFriend = null;
        }
        self.$el.find(".dummyFriends").selectpicker('refresh');

    },
    onRemoveFriends: function (model, collection) {
        /*jslint unparam:true*/
        var self = this;
        self.$el.find(".dummyFriends option[value=" + model.get("id") + "]").remove();
        this.$el.find(".dummyFriends").selectpicker('refresh');
    },
    _createTransactionView: function _createTransactionView(model) {
        var transactionView = new ViewTransaction({
            model: model,
            friendCollection: this.options.friendCollection
        }).render();
        this.$el.find(".dummyTransaction").append(transactionView.el);
        this._updateOWEValue(model);
        return transactionView;
    },
    _updateOWEValue: function (model) {
        if (model.get("type") === model.TYPE.DEBT) {
            this.tAmount += model.get("amount");
            this.$el.find(".dummyTCount").html(this.tAmount);
        } else {
            this.yAmount += model.get("amount");
            this.$el.find(".dummyYCount").html(this.yAmount);

        }
    },
    updateScroll: function () {
        var height = window.innerHeight -
            parseInt($("#Dynamic").css("padding-top"), 10) -
            this.$el.find(".row:first-child").height() -
            this.$el.find(".row:nth-child(2)").height() -
            parseInt(this.$el.find(".dummyTransaction").css("margin-top"), 10);
        this.$el.find(".dummyTransaction").css("max-height", height);
    },
    remove: function () {
        $(window).off("resize", this.updateCSS);
        $(window).off("orientationchange", this.updateCSS);
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});