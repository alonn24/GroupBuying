'use strict';

angular.module('myApp')
.service('ordersFacade', function (serverFacade) {
    this.getUserOrders = function () {
        return serverFacade.getUserOrders().then(normelizeOrders);
    }

    this.getMerchantOrders = function () {
        return serverFacade.getMerchantOrders().then(normelizeOrders);
    }

    function normelizeOrders(orders) {
        for (var i = 0; i < orders.length; i++) {
            orders[i].Date = orders[i].Date.fromMSJSON();
            orders[i].Product.DatePosted = orders[i].Product.DatePosted.fromMSJSON();
        }
        return orders;
    }

    this.orderProducts = function (ordersRequests) {
        var orderRequests = ordersRequests.map(function (productRequest) {
            return {
                ProductId: productRequest.ProductId,
                Quantity: productRequest.Quantity || 1
            };
        });
        return serverFacade.orderProducts(orderRequests);
    }
});