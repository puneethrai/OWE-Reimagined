/*globals define*/
/*jslint browser: true*/
define(['jquery'], function ($) {
    var DataLayer = {

        _connection: null,
        _currentIndex: 0,
        _db: null,
        /*
         * ENUM for db properties
         */
        PROPERTIES: {
            dbName: 'friends',
            dbVersion: '',
            dbDescription: 'Friend OWES',
            dbSize: 200000
        },
        //Database Queries List
        QUERIES: {
            //Transaction
            //Create
            createTableQueryTransaction: "CREATE TABLE IF NOT EXISTS OTRANSACTION( id INTEGER PRIMARY KEY AUTOINCREMENT, userid INTEGER, amount DOUBLE, type DEFAULT " + "'+'" + ")",
            //Insert
            insertIntoTransaction: 'INSERT INTO OTRANSACTION(id,userid,amount,type) VALUES (NULL,"',
            //update
            updateTransaction: "UPDATE OTRANSACTION SET userid='--U--',amount='--A--',type='--T--' WHERE id=?",
            //Drop
            dropTransactionTable: " DROP TABLE IF EXISTS OTRANSACTION",
            //get
            selectAllFromTransaction: 'SELECT * FROM OTRANSACTION ORDER BY amount',
            //Search
            searchContact: "SELECT * FROM OTRANSACTION WHERE name LIKE '--S--%' OR mobileNo LIKE '--S--%' OR workNo LIKE '--S--%' OR homeNo LIKE '--S--%' OR avataruri LIKE '--S--%' OR email LIKE '--S--%' OR homeAdd LIKE '--S--%' OR workAdd LIKE '--S--%'  ORDER BY jid",
            searchExistingID: "SELECT * FROM OTRANSACTION WHERE id = ?",
            //Delete
            deleteTransaction: "DELETE FROM OTRANSACTION WHERE id = ?",
            //Friends
            createFriendQueryTransaction: "CREATE TABLE IF NOT EXISTS FRIENDS( id INTEGER PRIMARY KEY AUTOINCREMENT, name INTEGER)",
            //Insert
            insertIntoFriend: 'INSERT INTO FRIENDS(id,name) VALUES (NULL,"',
            //update
            updateFriend: "UPDATE FRIENDS SET name='--N--' WHERE id=?",
            //Drop
            dropFriendTable: " DROP TABLE IF EXISTS FRIENDS",
            //get
            selectAllFromFriend: 'SELECT * FROM FRIENDS ORDER BY name',
            //Search
            searchFriend: "SELECT * FROM FRIENDS WHERE name LIKE '--S--%' OR mobileNo LIKE '--S--%' OR workNo LIKE '--S--%' OR homeNo LIKE '--S--%' OR avataruri LIKE '--S--%' OR email LIKE '--S--%' OR homeAdd LIKE '--S--%' OR workAdd LIKE '--S--%'  ORDER BY jid",
            searchExistingFriendID: "SELECT * FROM FRIENDS WHERE id = ?",
            //Delete
            deleteFriend: "DELETE FROM FRIENDS WHERE id = ?"
        },
        initialize: function () {
            var self = this,
                defer = $.Deferred();
            if (!self._db) {
                //Open the database with the properties listed in the ENUM
                self._db = window.openDatabase(this.PROPERTIES.dbName, this.PROPERTIES.dbVersion, this.PROPERTIES.dbDescription, this.PROPERTIES.dbSize);
                if (self._db) {
                    //self._executeSql(self.QUERIES.dropTransactionTable, null, function(){
                    self._executeSql(self.QUERIES.createTableQueryTransaction, null, function () {
                        self._executeSql(self.QUERIES.createFriendQueryTransaction, null, function () {
                            defer.resolve();
                        }, function () {
                            defer.reject();
                        });
                    }, function () {
                        defer.reject();
                    });
                    //});
                } else {
                    defer.reject();
                }
            } else {
                defer.resolve();
            }
            return defer.promise();
        },
        getAllTransaction: function () {
            var self = this,
                defer = $.Deferred();
            if (self._db) {
                self._executeSql(self.QUERIES.selectAllFromTransaction, null, function (tx, transactions) {
                    /*jslint unparam:true*/
                    var tempModels = [],
                        transactionsIndex = 0;
                    for (transactionsIndex = 0; transactionsIndex < transactions.rows.length; transactionsIndex++) {
                        defer.notify(transactions.rows.item(transactionsIndex));
                        tempModels.push(transactions.rows.item(transactionsIndex));
                    }
                    defer.resolve(tempModels);
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        addTransaction: function (transactionData) {

            var self = this,
                defer = $.Deferred(),
                sqlScript = "",
                id = [];
            if (self._db) {
                if (transactionData.id) {
                    sqlScript = self.QUERIES.updateTransaction.replace("--U--", transactionData.userid)
                        .replace("--A--", transactionData.amount)
                        .replace("--T--", transactionData.type);
                    id = [transactionData.id];
                } else {
                    sqlScript = self.QUERIES.insertIntoTransaction + transactionData.userid + '","' + transactionData.amount + '","' + transactionData.type + '")';
                }
                self._executeSql(sqlScript, id, function (tx, transactions) {
                    /*jslint unparam:true*/
                    if (transactions.rows.length > 0) {
                        defer.resolve(transactions.rows.item(0));
                    } else if (id.length === 0) {
                        //New entry
                        defer.resolve(transactions.insertId);
                    } else {
                        defer.resolve(transactionData);
                    }
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        removeTransaction: function (id) {

            var self = this,
                defer = $.Deferred();
            self._executeSql(self.QUERIES.deleteTransaction, [id], function () {
                defer.resolve();
            }, function () {
                defer.reject();
            });
            return defer.promise();
        },
        getAllFriends: function () {

            var self = this,
                defer = $.Deferred();
            if (self._db) {
                self._executeSql(self.QUERIES.selectAllFromFriend, null, function (tx, friends) {
                    /*jslint unparam:true*/
                    var tempModels = [],
                        friendsIndex = 0;
                    for (friendsIndex = 0; friendsIndex < friends.rows.length; friendsIndex++) {
                        defer.notify(friends.rows.item(friendsIndex));
                        tempModels.push(friends.rows.item(friendsIndex));
                    }
                    defer.resolve(tempModels);
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        addFriend: function (friendData) {

            var self = this,
                defer = $.Deferred(),
                sqlScript = "",
                id = [];
            if (self._db) {
                if (friendData.id) {
                    sqlScript = self.QUERIES.updateFriend.replace("--N--", friendData.name);
                    id = [friendData.id];
                } else {
                    sqlScript = self.QUERIES.insertIntoFriend + friendData.name + '")';
                }
                self._executeSql(sqlScript, id, function (tx, friends) {
                    /*jslint unparam:true*/
                    if (friends.rows.length > 0) {
                        defer.resolve(friends.rows.item(0));
                    } else if (id.length === 0) {
                        //New entry
                        defer.resolve(friends.insertId);
                    } else {
                        defer.resolve(friends);
                    }
                }, function () {
                    defer.reject();
                });
            }
            return defer.promise();
        },
        removeFriend: function (id) {

            var self = this,
                defer = $.Deferred();
            self._executeSql(self.QUERIES.deleteFriend, [id], function () {
                defer.resolve();
            }, function () {
                defer.reject();
            });
            return defer.promise();
        },
        getFriendByID: function (id) {
            var self = this,
                defer = $.Deferred();
            self._executeSql(self.QUERIES.searchExistingFriendID, [id], function (tx, friends) {
                /*jslint unparam:true*/
                if (friends.rows.length > 0) {
                    defer.resolve(friends.rows.item(0));
                } else {
                    defer.reject();
                }
            }, function () {
                defer.reject();
            });
            return defer.promise();

        },
        removeAllTable: function () {
            var self = this,
                defer = $.Deferred();
            self._executeSql(self.QUERIES.dropTransactionTable, null, function (tx, friends) {
                /*jslint unparam:true*/
                self._executeSql(self.QUERIES.dropFriendTable, null, function (tx, friends) {
                    defer.resolve();
                }, function () {
                    defer.reject();
                });
            }, function () {
                defer.reject();
            });
            return defer.promise();

        },
        _executeSql: function (SQL, params, successCallback, errorCallback, options) {
            var self = this;
            var success = function (tx, result) {
                self._logger(SQL + (params || "--No prams--") + " - finished", "DEBUG", "_executeSql");
                if (successCallback) {
                    successCallback(tx, result);
                }
            };
            var error = function (tx, error) {
                self._logger(SQL + (params || "--No prams--") + " - error: " + error.message, "DEBUG", "_executeSql");
                if (errorCallback) {
                    errorCallback(tx, error);
                }
            };

            if (options && options.transaction) {
                options.transaction.executeSql(SQL, params, success, error);
            } else {
                this._db.transaction(function (tx) {
                    tx.executeSql(SQL, params, success, error);
                });
            }
        },

        /*
         * @function: _logger
         * @description: logging function for Telephony router module
         * @params: message {String}: Message to log
         * @params: type {String}: Type of log
         * Optional params
         * @params: functionName {String}: Name of the function
         * @params: fileName {String}: File Name
         */
        _logger: function (message, logType, functionName, fileName) {
            console.log(message, logType, functionName, fileName);
            /*app.context.notify(app.Events.Log,_.extend({
                message      : message,
                fileName     : fileName||"contact-abstraction",
                functionName : functionName,
                type         : logType
            },app.context.getSettings()));*/
        },
    };
    return DataLayer;
});