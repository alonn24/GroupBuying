'use strict';

angular.module('app.common')
.service('serverFacade', function ($http) {

    var baseUrl = '/Services/GeneralServices.svc/';

    this.getUserData = function (userName, password) {
        return this.doHTTPGet(baseUrl + 'GetUserData/' + userName + '/' + password);
    }

    this.getUserOrders = function (userName, password) {
        return this.doHTTPGet(baseUrl + 'GetUserOrders/' + userName + '/' + password);
    }

    this.registerUser = function (userName, password, role, email) {
        var params = [userName, password, role, email].join('/');
        return this.doHTTPGet(baseUrl + 'RegisterUser/' + params);
    };

    this.getUserProducts = function (userName) {
        return this.doHTTPGet(baseUrl + 'GetProducts/' + userName);
    };

    this.getAllProducts = function (userName) {
        return this.doHTTPGet(baseUrl + 'GetProducts');
    };

    this.orderProducts = function (userName, password, orders) {
        var params = [userName, password, orders].join('/');
        return this.doHTTPGet(baseUrl + 'OrderProducts/' + params);
    };

    this.getProductDetails = function (productId) {
        return this.doHTTPGet(baseUrl + 'GetProductDetails/' + productId);
    };

    this.updateProductDetails = function (username, password, productId, title, minPrice, maxPrice, requiredOrders) {
        var params = [username, password, productId, title, minPrice, maxPrice, requiredOrders].join('/');
        return this.doHTTPGet(baseUrl + 'UpdateProductDetails/' + params);
    };

    this.createProduct = function (username, password, title, minPrice, maxPrice, requiredOrders) {
        var params = [username, password, title, minPrice, maxPrice, requiredOrders].join('/');
        return this.doHTTPGet(baseUrl + 'CreateProduct/' + params);
    };

    this.removeProduct = function (username, password, productId) {
        var params = [username, password, productId].join('/');
        return this.doHTTPGet(baseUrl + 'RemoveProduct/' + params);
    };

    this.doHTTPGet = function (url) {
        return $http({
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (data) { 
            return data.data;
        }, function (reason) {
            console.log(reason);
            return reason;
        });
    }
});