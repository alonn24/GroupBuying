'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

/* User Controller */
/* ~~~~~~~~~~~~~~~ */
.controller('userCtrl', ['$scope', '$location', 'userService',
    function ($scope, $location, userService) {
    // Scope Data
    $scope.userName = '';
    $scope.password = '';
    $scope.user = userService.model;
    $scope.orders = [];
    $scope.productDetailsPage = 'Product';

    // Event - LogInClick
    //~~~~~~~~~~~~~~~~~~~~
    $scope.LogInClick = function () {
        // Basic checks
        if (!this.userName || !this.password)
            this.message = "Please enter user credentials.";
        else {
            // Log in
            var promise = userService.LogIn($scope.userName, $scope.password);
            // Success
            promise.then(function() {
                $scope.LoadUserOrders();
            // Error
            }, function(reason) {
                $scope.message = reason;
            });
        }
    };
    // Event - LogOutClick
    //~~~~~~~~~~~~~~~~~~~~~
    $scope.LogOutClick = function () {
        userService.LogOut();
    };
    // Event - OrderClick
    //~~~~~~~~~~~~~~~~~~~~~~~
    $scope.OrderLinkClick = function(order) {
        $location.path($scope.productDetailsPage + '/' + order.Product.ProductId);
    };
    // Loading User Orders
    //~~~~~~~~~~~~~~~~~~~~~
    $scope.LoadUserOrders = function() {
        // Basic checks
        if (!this.user.userName || !this.user.password)
            this.message = "No user name or password.";
        else {
            // Get Orders
            var promise = userService.GetUserOrders()
            // Success
            promise.then(function(data) {
                $scope.orders = data;
                // Error
            }, function(reason) {
                $scope.message = reason;
            });
        }
    }
    // Startup code
    //~~~~~~~~~~~~~~
    if($scope.user.authorized)
        $scope.LoadUserOrders();
}])
/* register Controller */
/* ~~~~~~~~~~~~~~~~~~~ */
.controller('registerCtrl', ['$scope', '$location', 'userService',
    function ($scope, $location, userService) {
    // Scope Data    
    $scope.profiles = [
        { name: "Default", url: "Default.jpg" },
        { name: "Unknown", url: "Unknown.jpg" }
    ];
    $scope.nextPage = "LogInPage";
    $scope.roles = ["User", "ProductManager"];

    // Event - Register
    //~~~~~~~~~~~~~~~~~~
    $scope.RegisterClick = function () {
        // Basic checks
        if (!this.userName || !this.password || !this.email)
            this.message = "Please enter user details.";
        else {
            // Get user data from server
            // Register
            // TODO: problem with selected profile
            var promise = userService.RegisterUser($scope.userName, $scope.password,
                $scope.selectedRole, $scope.email, $scope.selectedProfile);
            // Success
            promise.then(function() {
                $location.path($scope.nextPage);
                // Error
            }, function(reason) {
                $scope.message = reason;
            });
        }
    }
}])
/* All products controller */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
.controller('allProductsCtrl', ['$scope', '$location', '$resource', '$filter', 'userService', 'productService',
    function($scope, $location, $resource, $filter, userService, productService) {
        // Set scope data
        $scope.user = userService.model;
        $scope.products = [];
        $scope.selectedProducts = [];
        $scope.searchQuery = "";
        //$scope.searchPrice = 0;
        $scope.productDetailsPage = 'Product';

        // Get all products
        var promise = productService.GetProducts();
        // Success
        promise.then(function(data) {
            $scope.products = data;
            // Error
        }, function(reason) {
            $scope.message = reason;
        });

        // Event - product click
        //~~~~~~~~~~~~~~~~~~~~~~~
        $scope.ProductClick = function(productId) {
            $location.path($scope.productDetailsPage + '/' + productId);
        }

        // Get filter function
        $scope.filterProducts = function() {
            return $filter('filter')($scope.products, $scope.searchQuery);
        };

        // Event - order click
        //~~~~~~~~~~~~~~~~~~~~~
        $scope.OrderClick = function() {
            // Clear message
            delete $scope.errorMessage;
            delete $scope.successMessage;

            // Basic checks
            if (!$scope.user.userName || !$scope.user.password)
                $scope.errorMessage = "No user name or password.";
            else {
                var promise = productService.OrderProducts($scope.selectedProducts);
                // Success
                promise.then(function(data) {
                    $scope.successMessage = "Order successfully.";
                    // Clear curt
                    for(var i=$scope.selectedProducts.length-1; i>=0; i--) {
                        $scope.products.push($scope.selectedProducts.pop());
                    }
                }, function(reason) {
                    $scope.errorMessage = reason;
                });
            }
        }
        // Event - filter products
        /*$scope.SearchProduct = function(product) {
            if($scope.searchQuery == "" && $scope.searchPrice == "")
                return true;
            else {
                // Check if price is valid
                var regex = /[0-9]|\./;
                var validPrice = regex.test($scope.searchPrice);

                // Split by spaces to search each field
                var arrQuery = $scope.searchQuery.toLowerCase().split(" ");
                // Check search fields
                for(var i = 0; i < arrQuery.length; i++) {
                    if(product.ProductId.toString().toLowerCase().indexOf(arrQuery[i]) == -1 &&
                        product.Seller.UserName.toLowerCase().indexOf(arrQuery[i]) == -1 &&
                        product.Title.toLowerCase().indexOf(arrQuery[i]) == -1)
                        return false;
                }
                // Check price
                if(validPrice && $scope.searchPrice > 0 &&
                    product.MinPrice > $scope.searchPrice)
                    return false;

                // All OK
                return true;
            }
        }*/
    }
])
/* All products controller */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
.controller('productCtrl', ['$scope', '$location', '$route', 'userService', 'productService',
    function($scope, $location, $route, userService, productService) {
        // Set scope data
        $scope.user = userService.model;
        $scope.update = false;  // Indicated if the user can update product data
        $scope.seller = false;  // Indicates if the logged on user is the seller
        $scope.Product = {};
        $scope.Orders = [];
        $scope.CurrentPrice = 0;    // Calculated price
        $scope.DateEnd = "";        // Calculated date
        $scope.Quantity = 1;        // Default quantity
        $scope.Shipping = false;    // Default shipping
        $scope.productsPage = "Products";

        // Startup - Get given product url details
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Check if product exists from url
        if ($route.current.params.productId) {
            var promise = productService.GetProductDetails($route.current.params.productId)
            // Success
            promise.then(function(data) {
                // Populate scope
                $scope.Product = data.Product;
                $scope.Orders = data.Orders;
                $scope.CurrentPrice = data.CurrentPrice;
                $scope.TotalQuantity = data.TotalQuantity;
                $scope.DateEnd = data.DateEnd;

                // Set update indicator
                $scope.seller = false;
                $scope.update = false;
                if ($scope.user.userName == $scope.Product.Seller.UserName) {
                    $scope.seller = true;
                    if($scope.Orders.length == 0) {
                        $scope.update = true;
                    }
                }
            }, function(reason) {
                $scope.errorMessage = reason;
            });
        }
        // Event - Order Click
        //~~~~~~~~~~~~~~~~~~~~~
        $scope.OrderClick = function() {
            // Clear message;
            delete $scope.errorMessage;
            delete $scope.successMessage;

            // Basic checks
            if (!$scope.user.userName || !$scope.user.password || !$scope.Product.ProductId)
                $scope.errorMessage = "No user name or password.";
            else {
                var promise = productService.OrderProducts([$scope.Product]);
                // Success
                promise.then(function(data) {
                    $scope.successMessage = "Order successfully.";
                    GetProductDetails($scope);
                // Error
                }, function(reason) {
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

            // Basic checks
            if (!$scope.user.userName || !$scope.user.password)
                $scope.errorMessage = "No user name or password.";
            else if(!$scope.Product.Title || !$scope.Product.MinPrice ||
                !$scope.Product.MaxPrice || !$scope.Product.RequiredOrders)
                $scope.errorMessage = "Enter product details.";
            else {
                // Update product
                var promise = productService.UpdateProductDetails($scope.Product);
                // Success
                promise.then(function() {
                    $scope.successMessage = "Order successfully.";
                // Error
                }, function(reason) {
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

            var promise = productService.RemoveProduct($scope.Product.ProductId);
            // Success
            promise.then(function() {
                $location.path($scope.productsPage);
            // Error
            }, function(reason) {
                $scope.errorMessage = reason;
            });
        }
}])
/* products manager controller */
/* ~~~~~~~~~~~~~~~~~~~~~~~ */
.controller('ProductsManagementCtrl', ['$scope', '$location', 'userService', 'productService',
    function($scope, $location, userService, productService) {
        // Set scope data
        $scope.user = userService.model;
        $scope.products = [];
        $scope.searchQuery = "";
        $scope.productDetailsPage = 'Product';
        $scope.NewProduct = {}; // New product input
        $scope.productImages = ['hundai.jpg', 'ipad.jpg', 'massage.jpg', 'pineapple.jpg', 'watch.jpg', 'wedding.jpg'];

        // Basic checks
        if (!$scope.user.userName)
            $scope.errorMessage = "User is not authorized.";
        else {
            var promise = productService.GetProducts($scope.user.userName);
            // Success
            promise.then(function(data) {
                $scope.products = data;
            // Error
            }, function(reason) {
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
                var promise = productService.CreateProduct($scope.NewProduct);
                // Success
                promise.then(function() {
                    $scope.successMessage = "Order updated successfully.";
                // Error
                }, function(reason) {
                    $scope.errorMessage = reason;
                });
            }
        }
}]);