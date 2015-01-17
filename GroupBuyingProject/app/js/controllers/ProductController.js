'use strict';

angular.module('myApp')
.controller('productController', function (urlDispacher, appMessages, $route, userDetails, productsFacade, ordersFacade) {
    var vm = this;

    this.canOrder = false;
    this.canUpdate = false;
    this.canFulfill = false;
    this.Product = {};
    this.Orders = [];
    this.CurrentPrice = 0;    // Calculated price
    this.DateEnd = "";        // Calculated date
    this.Quantity = 1;        // Default quantity
    this.Shipping = false;    // Default shipping

    // Startup - Get given product url details
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Check if product exists from url
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

    // Event - Order Click
    //~~~~~~~~~~~~~~~~~~~~~
    this.orderOnClick = function () {
        appMessages.clear();
        ordersFacade.orderProducts([vm.Product])
            .then(function () {
                load();
                appMessages.setMessage("Order successfully.");
            });
    }
    // Event - Update product data
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.updateOnClick = function () {
        appMessages.clear();
        productsFacade.updateProductDetails(vm.Product)
            .then(function (data) {
                appMessages.setMessage("Updated successfully.");
            });
    }
    // Event - Remove product
    //~~~~~~~~~~~~~~~~~~~~~~~~
    this.removeProduct = function () {
        appMessages.clear();
        productsFacade.removeProduct(vm.Product.ProductId).then(function (data) {
            appMessages.setMessage("Removed successfully.");
            urlDispacher.navigateToProduct();
        });
    }
});