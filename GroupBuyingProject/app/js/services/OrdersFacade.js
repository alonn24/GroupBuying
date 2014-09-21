﻿'use strict';

angular.module('myApp')
.service('ordersFacade', function (serverFacade) {
    this.getUserOrders = function (userName, password) {
        return serverFacade.getUserOrders(userName, password)
        .then(function (data) {
            for (var i = 0; i < data.length; i++) {
                var date = new Date(parseInt(data[i].Date.substr(6)));
                data[i].Date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            }
            return data;
        });
    }
});