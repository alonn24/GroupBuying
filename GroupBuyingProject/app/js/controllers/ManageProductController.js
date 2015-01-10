'use strict';

angular.module('myApp')
.controller('manageProductController', function (urlDispacher, appMessages, productsFacade, userDetails) {
    var vm = this;
    this.products = [];
    this.searchQuery = "";
    this.NewProduct = {}; // New product input
    this.productImages = ['hundai.jpg', 'ipad.jpg', 'massage.jpg', 'pineapple.jpg', 'watch.jpg', 'wedding.jpg'];

    this.getUserDetails = function () {
        return userDetails;
    };

    // Basic checks
    if (!userDetails.authorized)
        urlDispacher.navigateToLogIn();
    else {
        productsFacade.getProducts(userDetails.userName).then(
            function (data) {
                vm.products = data;
            });
    }


    this.productOnClick = function (productId) {
        urlDispacher.navigateToProduct(productId);
    }


    this.createOnClick = function () {
        appMessages.clear();

        // Basic checks
        if (!vm.NewProduct.Title || !vm.NewProduct.MinPrice ||
            !vm.NewProduct.MaxPrice || !vm.NewProduct.RequiredOrders)
            appMessages.setErrorMessage("Enter product details.");
        else {
            productsFacade.createProduct(vm.NewProduct).then(
                function (product) {
                    vm.products.push(product);
                    appMessages.setMessage("Created successfully.");
                });
        }
    }
});