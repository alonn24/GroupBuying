'use strict';

angular.module('myApp')
.controller('productController', function (urlDispacher, appMessages, $route, userDetails, productsFacade, ordersFacade) {
    var vm = this;
    // Action indicators
    this.canOrder = false;
    this.canUpdate = false;
    this.canFulfill = false;

    this.Product = {};
    this.Orders = [];
    this.CurrentPrice = 0;    // Calculated price
    this.DateEnd = "";        // Calculated date
    this.Quantity = 1;        // Default quantity

    // Load the product data and action indicators
    function load() {
        productsFacade.getProductDetails($route.current.params.productId)
        .then(function (data) {
            vm.Product = data.Product;
            vm.Orders = data.Orders;
            vm.CurrentPrice = data.CurrentPrice;
            vm.TotalQuantity = data.TotalQuantity;
            vm.DateEnd = data.DateEnd;

            // Set update indicator
            vm.canOrder = userDetails.authorized && userDetails.userName !== vm.Product.Seller.UserName;
            vm.canUpdate = userDetails.authorized &&
                userDetails.userName === vm.Product.Seller.UserName &&
                vm.Orders.length === 0;
            vm.canFulfill = userDetails.authorized &&
                userDetails.userName === vm.Product.Seller.UserName &&
                vm.Orders.length > 0;
        });
    }
    load();

    // Order this product
    this.orderOnClick = function () {
        appMessages.clear();
        ordersFacade.orderProducts([vm.Product]).then(function () {
            appMessages.setMessage("Order successfully.");
            load();
        });
    }
    
    // Update produt details
    this.updateOnClick = function () {
        appMessages.clear();
        productsFacade.updateProductDetails(vm.Product).then(function (data) {
            appMessages.setMessage("Updated successfully.");
        });
    }
    
    // Remove this product
    this.removeProduct = function () {
        appMessages.clear();
        productsFacade.removeProduct(vm.Product.ProductId).then(function (data) {
            appMessages.setMessage("Removed successfully.");
            urlDispacher.navigateToProduct();
        });
    }

    // Fulfill this product
    this.fulfillOnCLick = function () {
        appMessages.clear();
        productsFacade.fulfillProductOrders(vm.Product.ProductId, vm.CurrentPrice).then(function (data) {
            appMessages.setMessage("Fulfilled successfully.");
            load();
        });
    }
});