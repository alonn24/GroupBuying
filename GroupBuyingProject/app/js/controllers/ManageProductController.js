﻿'use strict';

angular.module('myApp')
.controller('manageProductController', function ($location, userPermissions, productsFacade) {
    var vm = this;
    this.products = [];
    this.searchQuery = "";
    this.productDetailsPage = 'Product';
    this.NewProduct = {}; // New product input
    this.productImages = ['hundai.jpg', 'ipad.jpg', 'massage.jpg', 'pineapple.jpg', 'watch.jpg', 'wedding.jpg'];

    this.getUserDetails = function () {
        return userPermissions.details;
    };

    // Basic checks
    if (!vm.getUserDetails().authorized)
        vm.errorMessage = "User is not authorized.";
    else {
        productsFacade.getProducts(vm.getUserDetails().userName).then(
            function (data) {
                vm.products = data;
            },
            function (reason) {
                vm.errorMessage = reason;
            });
    }


    this.productOnClick = function (productId) {
        $location.path(vm.productDetailsPage + '/' + productId);
    }


    this.createOnClick = function () {
        // Clear message
        delete vm.errorMessage;
        delete vm.successMessage;

        // Basic checks
        if (!vm.NewProduct.Title || !vm.NewProduct.MinPrice ||
            !vm.NewProduct.MaxPrice || !vm.NewProduct.RequiredOrders)
            vm.errorMessage = "Enter product details.";
        else {
            productsFacade.createProduct(vm.NewProduct).then(
                function (data) {
                    vm.successMessage = "Created successfully.";
                },
                function (reason) {
                    vm.errorMessage = reason;
                });
        }
    }
});