'use strict';

angular.module('myApp')
.controller('productsController', function ($scope, $location, $filter, userDetails, productsFacade) {
    var vm = this;

    $scope.allProducts = [];
    $scope.selectedProducts = [];
    this.searchQuery = "";
    this.productDetailsPage = 'Product';

    productsFacade.getProducts().then(
        function (data) {
            $scope.allProducts = data;
        }, function (reason) {
            vm.message = reason;
        });

    this.getUserDetails = function () {
        return userDetails;
    }

    this.productOnClick = function (productId) {
        $location.path(vm.productDetailsPage + '/' + productId);
    }

    // Get filter function
    $scope.filterProducts = function () {
        return $filter('filter')($scope.allProducts, vm.searchQuery);
    };

    this.orderOnClick = function () {
        // Clear message
        delete vm.errorMessage;
        delete vm.successMessage;

        var user = vm.getUserDetails();
        // Basic checks
        if (!user.userName || !user.password)
            vm.errorMessage = "No user name or password.";
        else {
            productsFacade.orderProducts($scope.selectedProducts)
            .then(function (data) {
                vm.successMessage = "Order successfully.";
                // Clear curt
                for (var i = $scope.selectedProducts.length - 1; i >= 0; i--) {
                    $scope.allProducts.push($scope.selectedProducts.pop());
                }
            }, function (reason) {
                vm.errorMessage = reason;
            });
        }
    }
});