'use strict';

angular.module('myApp')
.controller('logInController', function (urlDispacher, appMessages, userPermissions, ordersFacade, userDetails) {
    var vm = this;
    this.userName = '';
    this.password = '';
    this.orders = '';

    this.authorized = function () {
        return userDetails.authorized;
    };

    this.getUserDetails = function () {
        return userDetails;
    };

    this.logIn = function () {
        appMessages.clear();
        // Basic checks
        if (!vm.userName || !vm.password)
            appMessages.setErrorMessage('Please enter user credentials.');
        else {
            userPermissions.logIn(vm.userName, vm.password)
            .then(function () {
                vm.LoadUserOrders();
            });
        }
    };

    this.logOut = function () {
        userPermissions.logOut();
    };

    this.orderLinkClick = function (order) {
        urlDispacher.navigateToProduct(order.Product.ProductId);
    };

    this.LoadUserOrders = function () {
        ordersFacade.getUserOrders().then(function (orders) {
            vm.orders = orders;
        });
    }
    // Startup code
    //~~~~~~~~~~~~~~
    vm.LoadUserOrders();
});