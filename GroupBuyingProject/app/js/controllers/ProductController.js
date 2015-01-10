'use strict';

angular.module('myApp')
.controller('productController', function (urlDispacher, appMessages, $route, userDetails, productsFacade) {
    var vm = this;

    this.update = false;  // Indicated if the user can update product data
    this.seller = false;  // Indicates if the logged on user is the seller
    this.Product = {};
    this.Orders = [];
    this.CurrentPrice = 0;    // Calculated price
    this.DateEnd = "";        // Calculated date
    this.Quantity = 1;        // Default quantity
    this.Shipping = false;    // Default shipping

    this.getUserDetails = function () {
        return userDetails;
    };

    // Startup - Get given product url details
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Check if product exists from url
    if ($route.current.params.productId) {
        productsFacade.getProductDetails($route.current.params.productId)
        .then(
        function (data) {
            vm.Product = data.Product;
            vm.Orders = data.Orders;
            vm.CurrentPrice = data.CurrentPrice;
            vm.TotalQuantity = data.TotalQuantity;
            vm.DateEnd = data.DateEnd;

            // Set update indicator
            vm.seller = false;
            vm.update = false;
            if (vm.getUserDetails().userName == vm.Product.Seller.UserName) {
                vm.seller = true;
                if (vm.Orders.length == 0) {
                    vm.update = true;
                }
            }
        });
    }
    // Event - Order Click
    //~~~~~~~~~~~~~~~~~~~~~
    this.orderOnClick = function () {
        appMessages.clear();

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password || !vm.Product.ProductId)
            appMessages.setErrorMessage("No user name or password.");
        else {
            productsFacade.orderProducts([vm.Product]).then(
                function (data) {
                    appMessages.setMessage("Order successfully.");
                });
        }
    }
    // Event - Update product data
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.updateOnClick = function () {
        appMessages.clear();

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password)
            appMessages.setErrorMessage("No user name or password.");
        else if (!vm.Product.Title || !vm.Product.MinPrice ||
            !vm.Product.MaxPrice || !vm.Product.RequiredOrders)
            appMessages.setErrorMessage("Enter product details.");
        else {
            // Update product
            productsFacade.updateProductDetails(vm.Product).then(
                function (data) {
                    appMessages.setMessage("Updated successfully.");
                });
        }
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