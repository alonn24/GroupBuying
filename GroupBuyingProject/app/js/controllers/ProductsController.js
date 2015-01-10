'use strict';

angular.module('myApp')
.controller('productsController', function ($scope, urlDispacher, appMessages, $filter, userDetails, productsFacade) {
    var vm = this;

    $scope.allProducts = [];
    $scope.selectedProducts = [];
    this.searchQuery = "";

    productsFacade.getProducts().then(function (data) {
        $scope.allProducts = data;
    });

    this.getUserDetails = function () {
        return userDetails;
    }

    this.productOnClick = function (productId) {
        urlDispacher.navigateToProduct(productId);
    }

    // Get filter function
    $scope.filterProducts = function () {
        return $filter('filter')($scope.allProducts, vm.searchQuery);
    };

    this.orderOnClick = function () {
        appMessages.clear();

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password)
            appMessages.setErrorMessage("No user name or password.");
        else {
            productsFacade.orderProducts($scope.selectedProducts)
            .then(function (data) {
                appMessages.setMessage("Order successfully.");
                // Clear curt
                for (var i = $scope.selectedProducts.length - 1; i >= 0; i--) {
                    $scope.allProducts.push($scope.selectedProducts.pop());
                }
            });
        }
    }
});