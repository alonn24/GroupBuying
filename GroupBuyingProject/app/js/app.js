'use strict';

// Declare app level module which depends on filters, and services
angular.module('app.common', []);
angular.module('myApp', [
  'ngRoute',
  'ngDragDrop',
  'myApp.filters',
  'myApp.directives'
]).
config(['$routeProvider', function($routeProvider) {
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
    // Contacts page
    $routeProvider.when('/Contacts', { templateUrl: 'partials/Contacts.html', controller: 'logInController as logIn' });
    //$routeProvider.otherwise({ redirectTo: '/LogInPage' });
}]);
