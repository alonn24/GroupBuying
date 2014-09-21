'use strict';

// Declare app level module which depends on filters, and services
angular.module('app.common', []);
angular.module('myApp', [
  'ngRoute',
  'ngResource',
  'ngCookies',
  'ngDragDrop',
  'myApp.filters',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
    // Login page
    $routeProvider.when('/LogInPage', { templateUrl: 'partials/LogInPage.html', controller: 'logInController as logIn' });
    // Registration page
    $routeProvider.when('/Register', { templateUrl: 'partials/Register.html', controller: 'registerController as register' });
    // All products page
    $routeProvider.when('/Products', { templateUrl: 'partials/Products.html', controller: 'productsController as products' });
    // Single product page
    $routeProvider.when('/Product/:productId', { templateUrl: 'partials/ProductDetails.html', controller: 'productCtrl' });
    // Manage all products page
    $routeProvider.when('/ProductsManagement', { templateUrl: 'partials/ProductsManagement.html', controller: 'ProductsManagementCtrl' });
    // Contacts page
    $routeProvider.when('/Contacts', { templateUrl: 'partials/Contacts.html', controller: 'userCtrl' });
    //$routeProvider.otherwise({ redirectTo: '/LogInPage' });
}]);
