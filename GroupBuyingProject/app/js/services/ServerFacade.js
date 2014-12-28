'use strict';

angular.module('app.common')
.service('serverFacade', function ($http, $q, userDetails, appMessages) {

    var baseUrl = '/Services/GeneralServices.svc/';

    this.getUserData = function (userName, password) {
        return this.doHTTPGet(baseUrl + 'GetUserData/' + userName + '/' + password);
    }

    this.getUserOrders = function (userName, password) {
        return this.doHTTPGet(baseUrl + 'GetUserOrders/' + userName + '/' + password);
    }

    this.registerUser = function (data) {
        return this.doHTTPPost(baseUrl + 'RegisterUser', data);
    };

    this.getUserProducts = function (userName) {
        return this.doHTTPGet(baseUrl + 'GetProducts/' + userName);
    };

    this.getAllProducts = function (userName) {
        return this.doHTTPGet(baseUrl + 'GetProducts');
    };

    this.orderProducts = function (userName, password, orders) {
        return this.doHTTPPost(baseUrl + 'OrderProducts/' + orders);
    };

    this.getProductDetails = function (productId) {
        return this.doHTTPGet(baseUrl + 'GetProductDetails/' + productId);
    };

    this.updateProductDetails = function (username, password, productId, title, minPrice, maxPrice, requiredOrders) {
        var params = [username, password, productId, title, minPrice, maxPrice, requiredOrders].join('/');
        return this.doHTTPGet(baseUrl + 'UpdateProductDetails/' + params);
    };

    this.createProduct = function (product) {
        return this.doHTTPPost(baseUrl + 'CreateProduct', product);
    };

    this.removeProduct = function (username, password, productId) {
        var params = [username, password, productId].join('/');
        return this.doHTTPGet(baseUrl + 'RemoveProduct/' + params);
    };

    this.doHTTPGet = function (url) {
        appMessages.clear();
        return $http({
            url: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (data) {
            if (data.data.success === false) {
                appMessages.setErrorMessage(data.data.Message);
                return $q.reject(data.data.Message);
            }
            else
                return data.data.Result;
        }, function (reason) {
            console.log(reason);
            return $q.reject();
        });
    }

    this.doHTTPPost = function (url, data) {
        appMessages.clear();
        return $http({
            url: url,
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': 'application/json',
                'User': userDetails.userName,
                'Password': userDetails.password
            }
        })
        .then(function (data) {
            if (data.data.success === false) {
                appMessages.setErrorMessage(data.data.Message);
                return $q.reject(data.data.Message);
            }
            else
                return data.data.Result;
        }, function (reason) {
            console.log(reason);
            return $q.reject();
        });
    }
});