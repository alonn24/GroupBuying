'use strict';

angular.module('app.common')
.service('serverFacade', function ($http, $q, userDetails, appMessages) {

    var baseUrl = '/Services/GeneralServices.svc/';

    this.getUserData = function (userName, password) {
        return this.doHTTPGet(baseUrl + 'GetUserData/' + userName + '/' + password);
    }

    this.getUserOrders = function () {
        return this.doHTTPGet(baseUrl + 'GetUserOrders');
    }

    this.getMerchantOrders = function () {
        return this.doHTTPGet(baseUrl + 'GetMerchantOrders');
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

    this.orderProducts = function (orders) {
        return this.doHTTPPost(baseUrl + 'OrderProducts', orders);
    };
    
    this.removeOrder = function (orderId) {
        return this.doHTTPPost(baseUrl + 'RemoveOrder', orderId);
    };

    this.getProductDetails = function (productId) {
        return this.doHTTPGet(baseUrl + 'GetProductDetails/' + productId);
    };

    this.updateProductDetails = function (product) {
        return this.doHTTPPost(baseUrl + 'UpdateProductDetails', product);
    };

    this.createProduct = function (product) {
        return this.doHTTPPost(baseUrl + 'CreateProduct', product);
    };

    this.removeProduct = function (productId) {
        return this.doHTTPPost(baseUrl + 'RemoveProduct/' + productId);
    };

    this.fulfillProductOrders = function (productId, price) {
        return this.doHTTPPost(baseUrl + 'FulfillProductOrders/' + productId, price);
    };
    this.doHTTPGet = function (url) {
        return $http({
            url: url,
            method: 'GET',
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
            console.log(reason, url);
            appMessages.setErrorMessage('General error. Please check you network.');
            return $q.reject();
        });
    }

    this.doHTTPPost = function (url, data) {
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
            if (Array.isArray(data.data) && data.data.length > 0) {
                appMessages.setErrorMessage(data.data.reduce(function (prev, response) {
                    return prev + response.Message;
                }, ''));
                return $q.reject();
            }
            else if (data.data.success === false) {
                appMessages.setErrorMessage(data.data.Message);
                return $q.reject();
            }
            else
                return data.data.Result;
        }, function (reason) {
            console.log(reason, url, data);
            appMessages.setErrorMessage('General error. Please check you network.');
            return $q.reject();
        });
    }
});