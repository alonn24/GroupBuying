'use strict';

angular.module('myApp')
.controller('manageOrdersController', function (urlDispacher, appMessages, userDetails, ordersFacade) {
    var vm = this;

    // Basic checks
    if (!userDetails.authorized)
        urlDispacher.navigateToLogIn();
    else
        LoadUserOrders();

    function LoadUserOrders () {
        ordersFacade.getMerchantOrders().then(function (orders) {
            vm.orders = orders;
        });
    }

    this.productClick = function (productId) {
        urlDispacher.navigateToProduct(productId);
    };

    this.removeOrder = function (orderId) {
        ordersFacade.removeOrder(orderId).then(function () {
            appMessages.setMessage("Remove order successfully.");
            LoadUserOrders();
        });
    };
});
