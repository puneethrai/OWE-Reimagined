/*global define, describe, jasmine, describe, beforeEach, it, expect, spyOn, afterEach, */
/*jslint browser:true*/
define(['jquery',
    'backbone',
    'dataLayer',
    'templates',
    'app/modules/friendsModule/settings',
    'app/modules/friendsModule/router/Router.Friends',
    'app/modules/friendsModule/collection/Collection.Friends',
    'app/modules/friendsModule/model/Model.Friend',
    'app/modules/friendsModule/view/Views.Friends',
    'app/modules/friendsModule/view/Views.Friend'
    ], function ($, Backbone, DataLayer, templates, settings, FriendRouter, FriendCollection, FriendModel, ViewFriends, ViewFriend) {
    describe("Friend", function () {
        var loaded = false;

        beforeEach(function (done) {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            if (!loaded) {
                DataLayer.initialize().done(function () {
                    templates.load(settings);
                    loaded = true;
                    done();
                });
            } else {
                done();
            }
        });
        describe("Router", function () {
            var FR;
            beforeEach(function () {
                Backbone.history.stop();
                spyOn(FriendRouter.prototype, 'onFriend');
                FR = new FriendRouter();
                Backbone.history.start();
            });
            afterEach(function () {
                Backbone.history.stop();
            });
            it("should have one route", function () {
                expect(Object.keys(FR.routes).length).toEqual(1);
            });

            it("should be listen to friend url change", function () {
                Backbone.history.navigate("friends", {
                    trigger: true
                });
                expect(FR.onFriend).toHaveBeenCalled();
            });
        });


        describe("Collection", function () {
            var FC = null,
                testData = {
                    TCData: {},
                    callBack: function (model, collection, info) {
                        /*jslint unparam:true*/
                        if (this.cb) {
                            this.cb(model, collection, info);
                        }
                    },
                    invalidCallBack: function (collection, message, options) {
                        /*jslint unparam:true*/
                        if (this.cb) {
                            this.cb(collection, message, options);
                        }
                    }
                };
            beforeEach(function () {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 100;
                testData.TCData = {};
                FC = new FriendCollection();
            });
            it("should able to fetch data from abstraction layer", function (done) {
                var callBack = {},
                    cbFn = function (args) {
                        /*jslint unparam:true*/
                        expect(callBack.success).toHaveBeenCalled();
                        expect(callBack.error).not.toHaveBeenCalled();
                        done();
                    };
                callBack.success = callBack.error = cbFn;
                spyOn(callBack, "success").and.callThrough();
                spyOn(callBack, "error").and.callThrough();
                FC.fetch(callBack);
            });
            it("should able to add model and notify the same", function (done) {
                testData.TCData = {
                    name: "name"
                };
                testData.cb = function (model, collection, info) {
                    /*jslint unparam:true*/
                    expect(testData.callBack).toHaveBeenCalled();
                    expect(testData.callBack).toHaveBeenCalledWith(FC.models[FC.models.length - 1], FC, {
                        add: true,
                        merge: false,
                        remove: false
                    });
                    expect(collection).toEqual(FC);
                    expect(model).toEqual(FC.models[FC.models.length - 1]);
                    expect(info).toEqual({
                        add: true,
                        merge: false,
                        remove: false
                    });
                    done();
                };
                spyOn(testData, "callBack").and.callThrough();
                FC.on("add", testData.callBack, testData);
                FC.add(testData.TCData);

            });
            it("should not create new model when creating with invalid name (need to pass validate explicitly)", function (done) {
                testData.TCData = {
                    name: ""
                };
                testData.cb = function (collection, message, options) {
                    /*jslint unparam:true*/
                    expect(testData.callBack).not.toHaveBeenCalled();
                    expect(testData.invalidCallBack).toHaveBeenCalled();
                    expect(message).toEqual(-1);
                    done();
                };
                spyOn(testData, "callBack").and.callThrough();
                spyOn(testData, "invalidCallBack").and.callThrough();
                FC.on({
                    add: testData.callBack,
                    invalid: testData.invalidCallBack,
                }, testData);
                FC.add(testData.TCData, {
                    validate: true
                });

            });
        });

        describe("Model", function () {
            var FM;
            beforeEach(function () {
                //used for mulitple request to datalayer in same spec
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                FM = new FriendModel();
            });
            it("should able to add user and notify the change", function (done) {
                var testData = {
                    callBack: function () {
                        expect(testData.callBack).toHaveBeenCalledWith(FM, FM.get("name"), {});
                        done();
                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                FM.on("change:name", testData.callBack);
                FM.set("name", "123");

            });
            it("should not allow invalid name to be passed", function (done) {
                var testData = {
                    callBack: function () {
                        expect(testData.callBack).toHaveBeenCalledWith(FM, -1, {
                            validate: true,
                            validationError: -1
                        });
                        done();
                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                FM.on("invalid", testData.callBack);
                FM.set("name", "", {
                    validate: true
                });
                expect(FM.isValid()).not.toBeTruthy();
                expect(FM.validationError).toEqual(-1);

            });
            it("should able to delete and notify the same", function (done) {
                var testData = {
                    callBack: function () {
                        expect(testData.callBack).toHaveBeenCalled();
                        done();
                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                FM.on("destroy", testData.callBack);
                FM.destroy();

            });
            it("should delete if it can't save on to persistence layer", function (done) {
                var _DataLayer = DataLayer.addFriend,
                    testData = {
                        callBack: function () {
                            expect(testData.callBack).toHaveBeenCalled();
                            done();
                        }
                    };
                DataLayer.addFriend = function (transactionData) {
                    /*jslint unparam:true*/
                    var defer = $.Deferred();
                    setTimeout(function () {
                        defer.reject();
                    }, 0);
                    return defer.promise();
                };
                spyOn(testData, "callBack").and.callThrough();
                FM.on("destroy", testData.callBack);
                FM.save();
                DataLayer.addFriend = _DataLayer;

            });
            it("should able to save in persistent layer on save", function (done) {
                var testData = {
                    callBack: function (model, value) {
                        /*jslint unparam:true*/
                        var self = this;
                        expect(testData.callBack).toHaveBeenCalled();
                        /*currently no api in datalayer to find by id*/
                        DataLayer.getFriendByID(value).done(function () {
                            self.cb(true);
                        }).fail(function () {
                            self.cb(false);
                        });
                    },
                    destroy: function () {
                        this.cb();
                    },
                    cb: function (foundTransaction) {
                        expect(testData.callBack).toHaveBeenCalled();
                        expect(testData.destroy).not.toHaveBeenCalled();
                        expect(foundTransaction).toBeTruthy();
                        done();

                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                spyOn(testData, "destroy").and.callThrough();
                FM.on({
                    "change:id": testData.callBack,
                    "destroy": testData.destroy
                }, testData);
                FM.save();
            });

        });

        describe("Views:friends", function () {
            var VFS,
                FC;
            beforeEach(function () {
                FC = new FriendCollection();
                spyOn(ViewFriends.prototype, "onAddFriend").and.callThrough();
                spyOn(ViewFriends.prototype, "onNewFriend").and.callThrough();
                spyOn(ViewFriends.prototype, "onDeleteFriend").and.callThrough();
                VFS = new ViewFriends({
                    parentDiv: "dynamic",
                    collection: FC
                }).render();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;
            });
            afterEach(function () {
                VFS.remove();
            });
            it("should update the view upon render", function () {
                expect(VFS.$el).toBeInDOM();
                expect(VFS.$el).toHaveId("Friends");
            });
            it("should listen for user click event on add user", function () {
                VFS.$el.find(".dummyAddFriends").trigger("tap");
                expect(VFS.onAddFriend).toHaveBeenCalled();
            });
            it("should listen for add and remove event of Friends collection and update the UI", function (done) {
                var friendModel = new FriendModel({
                    name: "123"
                });
                friendModel.on("destroy", function () {
                    setTimeout(function () {
                        expect(VFS.onNewFriend).toHaveBeenCalled();
                        expect(VFS.onDeleteFriend).toHaveBeenCalled();
                        done();
                    }, 0);
                });
                FC.on("add", function (model) {
                    setTimeout(function () {
                        model.destroy();
                    }, 0);
                });
                FC.add(friendModel);


            });
        });

        describe("Views:friends", function () {
            var VF,
                FM;
            beforeEach(function () {
                FM = new FriendModel({name: "123"});
                spyOn(ViewFriend.prototype, "onDestroy").and.callThrough();
                spyOn(ViewFriend.prototype, "onRemoveTransaction").and.callThrough();
                spyOn(ViewFriend.prototype, "onNameChange").and.callThrough();

                VF = new ViewFriend({
                    model: FM
                }).render();
                $("#dynamic").html(VF.$el);
            });
            afterEach(function () {
                VF.remove();
            });
            it("should update the view upon render", function () {
                expect(VF.$el).toBeInDOM();
                expect(VF.$el.find(".displayName")).toHaveText(new RegExp(FM.get("name")));
            });
            it("should listen for user click event on close button", function () {
                $(".dummyDelete").trigger("tap");
                expect(VF.onRemoveTransaction).toHaveBeenCalled();
            });
            it("should listen for destroy event of model and remove the UI", function (done) {
                FM.on("destroy", function () {
                    setTimeout(function () {
                        expect(VF.onDestroy).toHaveBeenCalled();
                        expect(VF.$el).not.toBeInDOM();
                        expect($(".friend")).toHaveLength(0);
                        done();
                    }, 0);
                });
                FM.destroy();
            });
            it("should listen for change in name of its model", function (done) {
                expect(VF.$el.find(".displayName")).toHaveText(new RegExp(FM.get("name")));
                FM.on("change:name", function () {
                    setTimeout(function () {
                        expect(VF.$el.find(".displayName")).toHaveText(new RegExp(FM.get("name")));
                        done();
                    }, 0);
                });
                FM.set("name", "name");
            });
        });
    });

});