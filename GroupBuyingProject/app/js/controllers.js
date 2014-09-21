'use strict';

/* Controllers */

angular.module('myApp.controllers', ['app.common'])
/* All products controller */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
.controller('productCtrl', function ($scope, $location, $route, userPermissions, productsFacade) {
        // Set scope data
        $scope.update = false;  // Indicated if the user can update product data
        $scope.seller = false;  // Indicates if the logged on user is the seller
        $scope.Product = {};
        $scope.Orders = [];
        $scope.CurrentPrice = 0;    // Calculated price
        $scope.DateEnd = "";        // Calculated date
        $scope.Quantity = 1;        // Default quantity
        $scope.Shipping = false;    // Default shipping
        $scope.productsPage = "Products";

        $scope.getUserDetails = function () {
            return userPermissions.details;
        };

        // Startup - Get given product url details
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Check if product exists from url
        if ($route.current.params.productId) {
            productsFacade.getProductDetails($route.current.params.productId)
            .then(
            function (data) {
                // Populate scope
                $scope.Product = data.Product;
                $scope.Orders = data.Orders;
                $scope.CurrentPrice = data.CurrentPrice;
                $scope.TotalQuantity = data.TotalQuantity;
                $scope.DateEnd = data.DateEnd;

                // Set update indicator
                $scope.seller = false;
                $scope.update = false;
                if ($scope.getUserDetails().userName == $scope.Product.Seller.UserName) {
                    $scope.seller = true;
                    if ($scope.Orders.length == 0) {
                        $scope.update = true;
                    }
                }
            },
            function (reason) {
                $scope.errorMessage = reason;
            });
        }
        // Event - Order Click
        //~~~~~~~~~~~~~~~~~~~~~
        $scope.OrderClick = function() {
            // Clear message;
            delete $scope.errorMessage;
            delete $scope.successMessage;

            var user = $scope.getUserDetails();
            // Basic checks
            if (!user.userName || !user.password || !$scope.Product.ProductId)
                $scope.errorMessage = "No user name or password.";
            else {
                productsFacade.orderProducts([$scope.Product]).then(
                    function (data) {
                        $scope.successMessage = "Order successfully.";
                        GetProductDetails($scope);
                    },
                    function (reason) {
                        $scope.errorMessage = reason;
                    });
            }
        }
        // Event - Update product data
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        $scope.UpdateClick = function() {
            // Clear message;
            delete $scope.errorMessage;
            delete $scope.successMessage;

            var user = $scope.getUserDetails();
            // Basic checks
            if (!user.userName || !user.password)
                $scope.errorMessage = "No user name or password.";
            else if(!$scope.Product.Title || !$scope.Product.MinPrice ||
                !$scope.Product.MaxPrice || !$scope.Product.RequiredOrders)
                $scope.errorMessage = "Enter product details.";
            else {
                // Update product
                productsFacade.updateProductDetails($scope.Product).then(
                    function (data) {
                        $scope.successMessage = "Updated successfully.";
                    },
                    function (reason) {
                        $scope.errorMessage = reason;
                    });
            }
        }
        // Event - Remove product
        //~~~~~~~~~~~~~~~~~~~~~~~~
        $scope.RemoveProduct = function() {
            // Clear message;
            delete $scope.errorMessage;
            delete $scope.successMessage;

            productsFacade.removeProduct($scope.Product.ProductId).then(function (data) {
                $location.path($scope.productsPage);
            },
            function (reason) {
                $scope.errorMessage = reason;
            });
        }
})
/* products manager controller */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
.controller('ProductsManagementCtrl', function ($scope, $location, userPermissions, productsFacade) {
        // Set scope data
        $scope.products = [];
        $scope.searchQuery = "";
        $scope.productDetailsPage = 'Product';
        $scope.NewProduct = {}; // New product input
        $scope.productImages = ['hundai.jpg', 'ipad.jpg', 'massage.jpg', 'pineapple.jpg', 'watch.jpg', 'wedding.jpg'];

        $scope.getUserDetails = function () {
            return userPermissions.details;
        };

        // Basic checks
        if (!$scope.getUserDetails().authorized)
            $scope.errorMessage = "User is not authorized.";
        else {
            productsFacade.getProducts($scope.getUserDetails().userName).then(
                function (data) {
                    $scope.products = data;
                },
                function (reason) {
                    $scope.errorMessage = reason;
                });
        }
        // Event - product click
        //~~~~~~~~~~~~~~~~~~~~~~~
        $scope.ProductClick = function(productId) {
            $location.path($scope.productDetailsPage + '/' + productId);
        }
        // Event - Create new product
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        $scope.CreateClick = function() {
            // Clear message
            delete $scope.errorMessage;
            delete $scope.successMessage;

            // Basic checks
            if (!$scope.NewProduct.Title || !$scope.NewProduct.MinPrice ||
                !$scope.NewProduct.MaxPrice || !$scope.NewProduct.RequiredOrders)
                $scope.errorMessage = "Enter product details.";
            else {
                productsFacade.createProduct($scope.NewProduct).then(
                    function (data) {
                        $scope.successMessage = "Order updated successfully.";
                    },
                    function (reason) {
                        $scope.errorMessage = reason;
                    });
            }
        }
});