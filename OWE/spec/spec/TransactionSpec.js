/*global define, describe, jasmine, describe, beforeEach, it, expect, spyOn, afterEach, */
/*jslint browser:true*/
define(['jquery',
    'backbone',
    'dataLayer',
    'templates',
    'app/modules/transactionModule/settings',
    'app/modules/transactionModule/router/Router.Transactions',
    'app/modules/transactionModule/collection/Collection.Transactions',
    'app/modules/transactionModule/model/Model.Transaction',
    'app/modules/transactionModule/view/Views.Transactions',
    'app/modules/transactionModule/view/Views.Transaction',
    'app/modules/friendsModule/collection/Collection.Friends'
    ], function ($, Backbone, DataLayer, templates, settings, TransactionRouter, TransactionCollection, TransactionModel, ViewTransactions, ViewTransaction, FriendCollection) {
    /*jslint unparam:true*/
    describe("Transaction", function () {
        var TR, loaded = false;

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
            beforeEach(function () {
                Backbone.history.stop();
                spyOn(TransactionRouter.prototype, 'onTransaction');
                TR = new TransactionRouter();
                Backbone.history.start();
            });
            it("should have one route", function () {
                expect(Object.keys(TR.routes).length).toEqual(1);
            });
            it("should be listen to transaction url change", function () {
                Backbone.history.navigate("transaction", {
                    trigger: true
                });
                expect(TR.onTransaction).toHaveBeenCalled();
            });
        });


        describe("Collection", function () {
            var TC = null,
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
                /*fetch may take time during startup*/
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
                testData.TCData = {};
                TC = new TransactionCollection();
            });
            it("should able to fetch data from abstraction layer", function (done) {
                var callBack = {
                    cbFn : function (args) {
                        /*jslint unparam:true*/
                        expect(callBack.success).toHaveBeenCalled();
                        expect(callBack.error).not.toHaveBeenCalled();
                        done();
                    }
                };
                callBack.success = callBack.error = callBack.cbFn;
                spyOn(callBack, "success").and.callThrough();
                spyOn(callBack, "error").and.callThrough();
                TC.fetch(callBack);
            });
            it("should able to add model and notify the same", function (done) {
                testData.TCData = {
                    amount: 1234,
                    type: TransactionModel.prototype.TYPE.DEBT
                };
                testData.cb = function (model, collection, info) {
                    /*jslint unparam:true*/
                    expect(testData.callBack).toHaveBeenCalled();
                    expect(testData.callBack).toHaveBeenCalledWith(TC.models[TC.models.length - 1], TC, {
                        add: true,
                        merge: false,
                        remove: false
                    });
                    expect(collection).toEqual(TC);
                    expect(model).toEqual(TC.models[TC.models.length - 1]);
                    expect(info).toEqual({
                        add: true,
                        merge: false,
                        remove: false
                    });
                    done();
                };
                spyOn(testData, "callBack").and.callThrough();
                TC.on("add", testData.callBack, testData);
                TC.add(testData.TCData);
            });
            it("should not create new model when creating with invalid amount (need to pass validate explicitly)", function (done) {
                testData.TCData = {
                    amount: "123abcd",
                    type: TransactionModel.prototype.TYPE.DEBT
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
                TC.on({
                    add: testData.callBack,
                    invalid: testData.invalidCallBack,
                }, testData);
                TC.add(testData.TCData, {
                    validate: true
                });

            });
            it("should create model without having userid", function (done) {
                testData.TCData = {
                    amount: 123,
                    type: TransactionModel.prototype.TYPE.DEBT
                };
                testData.cb = function () {
                    expect(testData.callBack).toHaveBeenCalled();
                    expect(testData.invalidCallBack).not.toHaveBeenCalled();
                    done();
                };
                spyOn(testData, "callBack").and.callThrough();
                spyOn(testData, "invalidCallBack").and.callThrough();
                TC.on({
                    add: testData.callBack,
                    invalid: testData.invalidCallBack,
                }, testData);
                TC.add(testData.TCData, {
                    validate: true
                });

            });
            it("should not create model without have valid transaction type", function (done) {
                testData.TCData = {
                    amount: 123,
                    type: "123"
                };
                testData.cb = function (collection, message, options) {
                    /*jslint unparam:true*/
                    expect(testData.callBack).not.toHaveBeenCalled();
                    expect(testData.invalidCallBack).toHaveBeenCalled();
                    expect(message).toEqual(-2);
                    done();
                };
                spyOn(testData, "callBack").and.callThrough();
                spyOn(testData, "invalidCallBack").and.callThrough();
                TC.on({
                    add: testData.callBack,
                    invalid: testData.invalidCallBack,
                }, testData);
                TC.add(testData.TCData, {
                    validate: true
                });

            });
        });

        describe("Model", function () {
            var TM = null;
            beforeEach(function () {
                //used for mulitple request to datalayer in same spec
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
                TM = new TransactionModel();
            });
            it("should able to add amount and notify the change", function (done) {
                var testData = {
                    callBack: function () {
                        expect(testData.callBack).toHaveBeenCalledWith(TM, TM.get("amount"), {});
                        done();
                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                TM.on("change:amount", testData.callBack);
                TM.set("amount", "123");
            });
            it("should not allow invalid amount to be passed", function () {
                TM.set("amount", "123");
                expect(TM.isValid()).not.toBeTruthy();
                expect(TM.validationError).toEqual(-1);
            });
            it("should not allow empty/zero amount to be passed", function () {
                TM.set("amount", 0);
                expect(TM.isValid()).not.toBeTruthy();
                expect(TM.validationError).toEqual(-1);
            });
            it("should not allow invalid type to be passed", function () {
                TM.set("amount", 123);
                //not type set then default will be used
                expect(TM.isValid()).toBeTruthy();
                expect(TM.get("type")).toEqual(TM.defaults().type);
                TM.set("type", "123");
                expect(TM.isValid()).not.toBeTruthy();
                expect(TM.validationError).toEqual(-2);
            });
            it("should able to delete and notify the same", function (done) {
                var testData = {
                    callBack: function () {
                        expect(testData.callBack).toHaveBeenCalled();
                        done();
                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                TM.on("destroy", testData.callBack);
                TM.destroy();
            });
            it("should delete if it can't save on to persistence layer", function (done) {
                var _DataLayer = DataLayer.addTransaction,
                    testData = {
                        callBack: function () {
                            expect(testData.callBack).toHaveBeenCalled();
                            done();
                        }
                    };
                DataLayer.addTransaction = function (transactionData) {
                    /*jslint unparam:true*/
                    var defer = $.Deferred();
                    setTimeout(function () {
                        defer.reject();
                    }, 0);
                    return defer.promise();
                };
                spyOn(testData, "callBack").and.callThrough();
                TM.on("destroy", testData.callBack);
                TM.set({
                    amount: 1234,
                    type: TM.TYPE.CREDIT
                });
                TM.save();
                DataLayer.addTransaction = _DataLayer;
            });
            it("should able to save in persistent layer on save", function (done) {
                var testData = {
                    callBack: function () {
                        var self = this;
                        expect(testData.callBack).toHaveBeenCalled();
                        /*currently no api in datalayer to find by id*/
                        DataLayer.getAllTransaction().done(function (transactions) {
                            var foundTransaction = false,
                                index = 0;
                            for (index = 0; index < transactions.length; index++) {
                                if (transactions[index].id === TM.get("id")) {
                                    foundTransaction = true;
                                    break;
                                }
                            }
                            self.cb(foundTransaction);
                        });
                    },
                    destroy: function () {
                        this.cb();
                    },
                    cb: function (foundTransaction) {
                        expect(testData.callBack).toHaveBeenCalled();
                        expect(foundTransaction).toBeTruthy();
                        done();

                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                TM.on({
                    "change:id": testData.callBack,
                    "destroy": testData.destroy
                }, testData);
                TM.set({
                    amount: 1234,
                    type: TM.TYPE.CREDIT
                });
                TM.save();
            });
            it("should able to delete its entry from persistent layer if the model is destroy", function (done) {

                var testData = {
                    callBack: function (model, value) {
                        /*jslint unparam:true*/
                        this.id = value;
                        model.on("destroy", this.destroy, this);
                        model.destroy();
                    },
                    destroy: function () {
                        var self = this;
                        /*currently no api in datalayer to find by id*/
                        DataLayer.getAllTransaction().done(function (transactions) {
                            var foundTransaction = false,
                                index = 0;
                            for (index = 0; index < transactions.length; index++) {
                                if (transactions[index].id === TM.get("id")) {
                                    foundTransaction = true;
                                    break;
                                }
                            }
                            self.cb(foundTransaction);
                        });
                    },
                    cb: function (foundTransaction) {
                        expect(testData.callBack).toHaveBeenCalled();
                        expect(foundTransaction).not.toBeTruthy();
                        done();

                    }
                };
                spyOn(testData, "callBack").and.callThrough();
                TM.on("change:id", testData.callBack, testData);
                TM.set({
                    amount: 1234,
                    type: TM.TYPE.CREDIT
                });
                TM.save();
            });

        });

        describe("Views:transactions", function () {
            var VTS = null,
                TC = null,
                FC = null;
            beforeEach(function () {
                FC = new FriendCollection();
                TC = new TransactionCollection();
                spyOn(ViewTransactions.prototype, "onAddDebt").and.callThrough();
                spyOn(ViewTransactions.prototype, "onAddCredit").and.callThrough();
                spyOn(ViewTransactions.prototype, "onNewTransaction").and.callThrough();
                spyOn(ViewTransactions.prototype, "onDeleteTransaction").and.callThrough();
                spyOn(ViewTransactions.prototype, "onRemoveFriends").and.callThrough();
                spyOn(ViewTransactions.prototype, "onNewFriends").and.callThrough();
                VTS = new ViewTransactions({
                    parentDiv: "dynamic",
                    collection: TC,
                    friendCollection: FC
                }).render();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            });
            afterEach(function () {
                VTS.remove();
            });
            it("should update the view upon render", function () {
                expect(VTS.$el).toBeInDOM();
                expect(VTS.$el).toHaveId("Transaction");
            });
            it("should listen for user click event on debit or credit button", function () {
                VTS.$el.find(".dummyDebt").trigger("tap");
                VTS.$el.find(".dummyCredit").trigger("tap");
                expect(VTS.onAddDebt).toHaveBeenCalled();
                expect(VTS.onAddCredit).toHaveBeenCalled();
            });
            it("should listen for add and remove event of transaction collection", function (done) {
                var tranModel = new TransactionModel({
                    amount: 123,
                    type: TransactionModel.prototype.TYPE.DEBT
                });
                tranModel.on("destroy", function () {
                    setTimeout(function () {
                        expect(VTS.onNewTransaction).toHaveBeenCalled();
                        expect(VTS.onDeleteTransaction).toHaveBeenCalled();
                        done();
                    }, 0);
                });
                TC.on("add", function (model) {
                    setTimeout(function () {
                        model.destroy();
                    }, 0);
                });
                TC.add(tranModel);

            });
            it("should listen for add event of transaction collection and update the UI", function (done) {
                var tranModel = new TransactionModel({
                    amount: 123,
                    type: TransactionModel.prototype.TYPE.DEBT
                });
                TC.on("add", function () {
                    setTimeout(function () {
                        expect(VTS.$el.find(".dummyTransaction > div")).toHaveLength(1);
                        expect(VTS.$el.find(".dummyTransaction > div")[0]).toBeInDOM();
                        done();
                    }, 0);
                });
                TC.add(tranModel);

            });
            it("should listen for remove event of transaction collection and update the UI", function (done) {
                var tranModel = new TransactionModel({
                    amount: 123,
                    type: TransactionModel.prototype.TYPE.DEBT
                });
                TC.on("remove", function () {
                    setTimeout(function () {
                        expect(VTS.$el.find(".dummyTransaction > div")).toHaveLength(0);
                        done();
                    }, 0);
                });
                TC.add(tranModel);
                tranModel.destroy();
            });
            it("should listen for add and remove event of friends collection and update the UI", function (done) {
                FC.on("add", function (model) {
                    setTimeout(function () {
                        expect(VTS.$el.find("select.dummyFriends option")).toHaveLength(FC.models.length);
                        expect(VTS.$el.find("select.dummyFriends option[value=" + model.get("id") + "]")).toBeInDOM();
                        expect(VTS.$el.find("select.dummyFriends option[value=" + model.get("id") + "]")).toHaveText(new RegExp(model.get("name")));
                        done();
                    }, 0);
                });
                FC.create({
                    name: "Test"
                }, {
                    wait: true
                });

            });
            it("should listen for user input to add new friends", function (done) {
                var testname = "Testing new User";
                FC.on("add", function (model) {
                    expect(model.get("name")).toBe(testname);
                });
                TC.on("add", function (model) {
                    expect(VTS.onNewFriends).toHaveBeenCalled();
                    expect(VTS.onNewTransaction).toHaveBeenCalled();
                    done();
                });
                VTS.$el.trigger("NoResult", testname);
                VTS.$el.find(".dummyAmount").val("1234");
                VTS.$el.find(".dummyDebt").trigger("tap");
            });
            it("should not add the previously not found friend to friends list if user is able to find the friend", function (done) {
                var testname = "Testing new User";
                TC.on("add", function (model) {
                    setTimeout(function () {
                        expect(VTS.onNewFriends).not.toHaveBeenCalled();
                        expect(VTS.onNewTransaction).toHaveBeenCalled();
                        done();
                    }, 300);
                });
                VTS.$el.trigger("NoResult", testname);
                VTS.$el.trigger("ResultFound");
                VTS.$el.find(".dummyAmount").val("1234");
                VTS.$el.find(".dummyDebt").trigger("tap");
            });
            it("should able to accept floating point number", function (done) {
                var number = 1234.1234;
                TC.on("add", function (model) {
                    setTimeout(function () {
                        expect(model.get("amount")).toBe(number);
                        done();
                    }, 300);
                });
                VTS.$el.find(".dummyAmount").val(number);
                VTS.$el.find(".dummyDebt").trigger("tap");

            });
            it("should able to add/substract number and display effectivly", function (done) {
                var float4Number = 1234.1234,
                    float3Number = 1234.123,
                    intNumber = 1234,
                    number = [intNumber, intNumber, float4Number, float3Number, float3Number, float3Number],
                    modelIndex,
                    numberIndex;
                TC.on("add", function (model) {
                    if (TC.length === (number.length * 2)) {
                        expect(VTS.$el.find(".dummyTCount").html()).toBe("7404.492399999999");
                        expect(VTS.$el.find(".dummyYCount").html()).toBe("7404.492399999999");
                        for (modelIndex = TC.length - 1; modelIndex >= 0; modelIndex--) {
                            TC.models[modelIndex].destroy();
                        }
                    }
                });
                TC.on("remove", function (model) {
                    if (TC.length === 0) {
                        expect(VTS.$el.find(".dummyTCount").html()).toBe("0");
                        expect(VTS.$el.find(".dummyYCount").html()).toBe("0");
                        done();
                    }
                });
                for (numberIndex = 0; numberIndex < number.length; numberIndex++) {
                    VTS.$el.find(".dummyAmount").val(number[numberIndex]);
                    VTS.$el.find(".dummyDebt").trigger("tap");
                }
                for (numberIndex = 0; numberIndex < number.length; numberIndex++) {
                    VTS.$el.find(".dummyAmount").val(number[numberIndex]);
                    VTS.$el.find(".dummyCredit").trigger("tap");
                }

            });
        });

        describe("Views:transaction", function () {
            var TM, VT, FC;
            beforeEach(function () {
                TM = new TransactionModel({
                    amount: 123,
                    type: TransactionModel.prototype.TYPE.DEBT
                });
                FC = new FriendCollection();
                spyOn(ViewTransaction.prototype, "onRemoveTransaction").and.callThrough();
                spyOn(ViewTransaction.prototype, "onDestroy").and.callThrough();
                spyOn(ViewTransaction.prototype, "onAmountChange").and.callThrough();
                VT = new ViewTransaction({
                    model: TM,
                    friendCollection: FC
                }).render();
                $("#dynamic").html(VT.$el);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
            });
            afterEach(function () {
                VT.remove();
            });
            it("should update the view upon render", function () {
                expect(VT.$el).toBeInDOM();
                expect(VT.$el.find(".transaction-container")[0]).toHaveClass("out");
                expect(VT.$el.find(".transaction-container")[0]).not.toHaveClass("in");
                TM.set("type", TransactionModel.prototype.TYPE.CREDIT);
                expect(VT.$el.find(".transaction-container")[0]).toHaveClass("in");
                expect(VT.$el.find(".transaction-container")[0]).not.toHaveClass("out");
            });
            it("should listen for user click event on close button", function () {
                $(".dummyDelete").trigger("tap");
                expect(VT.onRemoveTransaction).toHaveBeenCalled();
            });

            it("should listen for destroy event of model and remove the UI", function (done) {
                TM.on("destroy", function () {
                    setTimeout(function () {
                        expect(VT.onDestroy).toHaveBeenCalled();
                        expect(VT.$el).not.toBeInDOM();
                        expect($(".transaction")).toHaveLength(0);
                        done();
                    }, 0);
                });
                TM.destroy();
            });

            it("should listen for change in amount of its model", function (done) {
                expect(VT.$el.find(".dummyUserAmount")).toHaveText(new RegExp(TM.get("amount")));
                TM.on("change:amount", function (model, value) {
                    /*jslint unparam:true*/
                    setTimeout(function () {
                        expect(VT.onAmountChange).toHaveBeenCalled();
                        expect(VT.$el.find(".dummyUserAmount")).toHaveText(new RegExp(value));
                        done();
                    }, 0);
                });
                TM.set("amount", 1234);

            });

            it("should have friend name appended if available", function (done) {
                expect(VT.$el.find(".dummyFriendName")).toHaveText("");
                FC.on("add", function (model) {
                    TM.set("userid", model.get("id"));
                    VT.render();
                    setTimeout(function () {
                        expect(VT.$el.find(".dummyFriendName")).toHaveText(model.get("name"));
                        done();
                    }, 0);
                });
                FC.create({
                    name: "Test"
                }, {
                    wait: true
                });
            });
        });
    });
});