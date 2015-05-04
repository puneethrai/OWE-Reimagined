/*global Backbone,templates,$,ViewFriend,app,_*/
var ViewFriends = Backbone.View.extend({
    id: "Friends",
    className: "container",
    initialize: function initialize(options) {
        this.options = options;
        this.template = templates.get('friend', 'Friends');
        this.collection.on({
            "add": this.onNewFriend,
            "remove": this.onDeleteFriend
        }, this);
        _.bindAll(this, "updateScroll");
        $(window).on("resize", this.updateScroll);
        $(window).on("orientationchange", this.updateScroll);
    },
    render: function render() {
        var modelIndex = 0;
        this.$el.html(this.template({
            friends: this.collection.models.length
        }));
        $("#" + this.options.parentDiv).append(this.$el);
        for (modelIndex = 0; modelIndex < this.collection.models.length; modelIndex++) {
            this._createFriendsView(this.collection.models[modelIndex]);
        }
        this.updateScroll();
        return this;
    },
    events: {
        "tap .dummyAddFriends": "onAddFriend",
    },

    onNewFriend: function onNewFriend(model, collection) {
        /*jslint unparam:true*/
        this._createFriendsView(model, {
            validate: true
        });
        this.$el.find(".dummyFriendsCount").html(this.collection.models.length);
        if (model.isNew()) {
            model.save();

        }

    },
    onAddFriend: function onAddCredit() {
        this._onAddToCollection(this.$el.find(".dummyFriendName").val());
    },
    _onAddToCollection: function _onAddToCollection(name) {
        this.collection.create({
            name: name
        }, {
            validate: true,
            wait: true
        });
    },
    onDeleteFriend: function onDeleteTransaction(model) {
        /*jslint unparam:true*/
        this.$el.find(".dummyFriendsCount").html(this.collection.models.length);
    },
    _createFriendsView: function _createFriendsView(model) {
        var FriendView = new ViewFriend({
            model: model
        }).render();
        this.$el.find(".dummyFriendList").append(FriendView.el);
        app.scrollDown(FriendView.$el.offset().top - this.$el.find(".dummyFriendList").offset().top + this.$el.find(".dummyFriendList").scrollTop());
    },
    updateScroll: function () {
        var height = window.innerHeight -
            parseInt($("#Dynamic").css("padding-top"), 10) -
            this.$el.find(".row:first-child").height() -
            this.$el.find(".row:nth-child(2)").height() -
            parseInt(this.$el.find(".dummyFriendList").css("margin-top"), 10);
        this.$el.find(".dummyFriendList").css("max-height", height);
    },
    remove: function () {
        $(window).off("resize", this.updateCSS);
        $(window).off("orientationchange", this.updateCSS);
        Backbone.View.prototype.remove.apply(this, arguments);
    }
});