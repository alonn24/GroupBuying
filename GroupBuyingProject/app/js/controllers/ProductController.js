'use strict';

angular.module('myApp')
.controller('productController', function ($location, $route, userPermissions, productsFacade) {
    var vm = this;

    this.update = false;  // Indicated if the user can update product data
    this.seller = false;  // Indicates if the logged on user is the seller
    this.Product = {};
    this.Orders = [];
    this.CurrentPrice = 0;    // Calculated price
    this.DateEnd = "";        // Calculated date
    this.Quantity = 1;        // Default quantity
    this.Shipping = false;    // Default shipping
    this.productsPage = "Products";

    this.getUserDetails = function () {
        return userPermissions.details;
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
        },
        function (reason) {
            vm.errorMessage = reason;
        });
    }
    // Event - Order Click
    //~~~~~~~~~~~~~~~~~~~~~
    this.orderOnClick = function () {
        // Clear message;
        delete vm.errorMessage;
        delete vm.successMessage;

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password || !vm.Product.ProductId)
            vm.errorMessage = "No user name or password.";
        else {
            productsFacade.orderProducts([vm.Product]).then(
                function (data) {
                    vm.successMessage = "Order successfully.";
                },
                function (reason) {
                    vm.errorMessage = reason;
                });
        }
    }
    // Event - Update product data
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    this.updateOnClick = function () {
        // Clear message;
        delete vm.errorMessage;
        delete vm.successMessage;

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password)
            vm.errorMessage = "No user name or password.";
        else if (!vm.Product.Title || !vm.Product.MinPrice ||
            !vm.Product.MaxPrice || !vm.Product.RequiredOrders)
            vm.errorMessage = "Enter product details.";
        else {
            // Update product
            productsFacade.updateProductDetails(vm.Product).then(
                function (data) {
                    vm.successMessage = "Updated successfully.";
                },
                function (reason) {
                    vm.errorMessage = reason;
                });
        }
    }
    // Event - Remove product
    //~~~~~~~~~~~~~~~~~~~~~~~~
    this.removeProduct = function () {
        // Clear message;
        delete vm.errorMessage;
        delete vm.successMessage;

        productsFacade.removeProduct(vm.Product.ProductId).then(function (data) {
            $location.path(vm.productsPage);
        },
        function (reason) {
            vm.errorMessage = reason;
        });
    }
});