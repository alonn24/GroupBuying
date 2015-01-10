'use strict';

angular.module('myApp')
.controller('productsController', function ($scope, urlDispacher, appMessages, $filter, userDetails, productsFacade, ordersFacade) {
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

        ordersFacade.orderProducts($scope.selectedProducts)
            .then(function (data) {
                appMessages.setMessage("Order successfully.");
                // Clear curt
                for (var i = $scope.selectedProducts.length - 1; i >= 0; i--) {
                    $scope.allProducts.push($scope.selectedProducts.pop());
                }
            });
    }
});