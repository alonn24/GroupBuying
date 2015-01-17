'use strict';

// Declare app level module which depends on filters, and services
angular.module('app.common', []);
angular.module('myApp', [
  'ngRoute',
  'ngDragDrop',
  'myApp.filters',
  'myApp.directives'
]).
config(['$routeProvider', function ($routeProvider) {
    // Login page
    $routeProvider.when('/LogInPage', { templateUrl: 'partials/LogInPage.html', controller: 'logInController as logIn' });
    // Registration page
    $routeProvider.when('/Register', { templateUrl: 'partials/Register.html', controller: 'registerController as register' });
    // All products page
    $routeProvider.when('/Products', { templateUrl: 'partials/Products.html', controller: 'productsController as products' });
    // Single product page
    $routeProvider.when('/Product/:productId', { templateUrl: 'partials/ProductDetails.html', controller: 'productController as product' });
    // Manage all products page
    $routeProvider.when('/ProductsManagement', { templateUrl: 'partials/ProductsManagement.html', controller: 'manageProductController as manageProduct' });
    // Manage all orders page
    $routeProvider.when('/OrdersManagement', { templateUrl: 'partials/OrdersManagement.html', controller: 'manageOrdersController as manageOrders' });
    // Contacts page
    $routeProvider.when('/Contacts', { templateUrl: 'partials/Contacts.html', controller: 'logInController as logIn' });
    //$routeProvider.otherwise({ redirectTo: '/LogInPage' });
}]).
run(['$rootScope', function ($rootScope) {
    $rootScope.Date = Date;
}]);

Date.prototype.toMSJSON = function () {
    var dt = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate(),
        this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds()));
    return '/Date(' + dt.getTime() + ')/';
};

String.prototype.fromMSJSON = function () {
    return new Date(parseInt(this.substr(6)));
}
