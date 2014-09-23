'use strict';

angular.module('myApp')
.controller('logInController', function ($location, userPermissions, ordersFacade, userDetails) {
    var vm = this;
    this.userName = '';
    this.password = '';
    this.orders = '';
    this.productDetailsPage = 'Product';

    this.getUserDetails = function () {
        return userDetails;
    };

    this.logIn = function () {
        // Basic checks
        if (!vm.userName || !vm.password)
            vm.message = "Please enter user credentials.";
        else {
            userPermissions.logIn(vm.userName, vm.password)
            .then(function () {
                vm.LoadUserOrders();
            }, function (reason) {
                vm.message = reason;
            });
        }
    };

    this.logOut = function () {
        userPermissions.logOut();
    };


    this.orderLinkClick = function (order) {
        $location.path(vm.productDetailsPage + '/' + order.Product.ProductId);
    };

    this.LoadUserOrders = function () {
        var user = vm.getUserDetails();
        // Basic checks
        if (user.authorized) {
            ordersFacade.getUserOrders(user.userName, user.password)
            .then(function (orders) {
                vm.orders = orders;
            }, function (reason) {
                vm.message = reason;
            });
        }
    }
    // Startup code
    //~~~~~~~~~~~~~~
    vm.LoadUserOrders();
});