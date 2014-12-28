'use strict';

angular.module('myApp')
.controller('logInController', function (urlDispacher, appMessages, userPermissions, ordersFacade, userDetails) {
    var vm = this;
    this.userName = '';
    this.password = '';
    this.orders = '';
    this.productDetailsPage = 'Product';

    this.authorized = function () {
        return userDetails.authorized;
    };

    this.getUserDetails = function () {
        return userDetails;
    };

    this.logIn = function () {
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
        var user = vm.getUserDetails();
        // Basic checks
        if (user.authorized) {
            ordersFacade.getUserOrders(user.userName, user.password)
            .then(function (orders) {
                vm.orders = orders;
            });
        }
    }
    // Startup code
    //~~~~~~~~~~~~~~
    vm.LoadUserOrders();
});