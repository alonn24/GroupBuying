'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.factory('productService', function ($rootScope, $resource, $q, userPermissions) {

    function getuserDetails() {
        return userPermissions.details;
    }

    return {
        GetProducts: function(userName) {
            // Return promise
            var deferred = $q.defer();

            // Set user products if exist
            var url = '/Services/GeneralServices.svc/GetProducts';
            var parameters = {};
            if (userName) {
                url += '/:userName';
                parameters.userName = userName;
            }

            // Get products from server
            var ProductsResource = $resource(url);
            ProductsResource.query(parameters,
                // Success
                function(data, responseHeaders){
                    deferred.resolve(data);
                },
                // Error
                function(responseHeaders){
                    deferred.reject('Error occurred in RegisterUser.');
                    console.error('Error occurred in RegisterUser: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        },
        OrderProducts: function(products) {
            // Return promise
            var deferred = $q.defer();

            // Build orders string - id,quantity,shipping...
            var orders = "";
            for(var i=0; i < products.length; i++) {
                if (i > 0) orders += ",";
                // Id
                orders += products[i].ProductId;
                // Quantity
                if(products[i].quantity)
                    orders += "," + products[i].quantity;
                else
                    orders += ",1";
                // Shipping
                if(products[i].shipping == true)
                    orders += ",1";
                else
                    orders += ",0";
            }

            // Order to server
            var OrderResource = $resource('/Services/GeneralServices.svc/OrderProducts/:username/:password/:orders');
            var user = getuserDetails();
            OrderResource.get({
                username: encodeURI(user.userName),
                password: encodeURI(user.password),
                    orders: orders},
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in OrderProducts.');
                    console.error('Error occurred in OrderProducts: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        },
        GetProductDetails: function(productId) {
            // Return promise
            var deferred = $q.defer();

            var ProductResource = $resource('/Services/GeneralServices.svc/GetProductDetails/:productId');
            ProductResource.get({productId: productId},
                // Success
                function(data, responseHeaders){
                    // Format date and calculate total quantity
                    data.TotalQuantity = 0;
                    for(var i=0; i<data.Orders.length; i++) {
                        data.TotalQuantity += (data.Orders[i].Quantity*1);    // Add total quantity
                        var date = new Date(parseInt(data.Orders[i].Date.substr(6)));
                        data.Orders[i].Date = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    if(data.Product.DatePosted) {
                        var date = new Date(parseInt(data.Product.DatePosted.substr(6)));
                        data.Product.DatePosted = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    if (data.DateEnd) {
                        var date = new Date(parseInt(data.DateEnd.substr(6)));
                        data.DateEnd = date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    deferred.resolve(data);
                },
                // Error
                function(responseHeaders){
                    deferred.reject('Error occurred in GetProductDetails.');
                    console.error('Error occurred in GetProductDetails: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        },
        UpdateProductDetails: function(product) {
            // Return promise
            var deferred = $q.defer();

            var UpdateProductResource = $resource('/Services/GeneralServices.svc/UpdateProductDetails' +
                '/:username/:password/:productId/:title/:minPrice/:maxPrice/:requiredOrders');
            var user = getuserDetails();
            UpdateProductResource.get(
                {
                    username: encodeURI(user.userName),
                    password: encodeURI(user.password),
                    productId: product.ProductId,
                    title: product.Title,
                    minPrice: product.MinPrice,
                    maxPrice: product.MaxPrice,
                    requiredOrders: product.RequiredOrders
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in UpdateProduct.');
                    console.error('Error occurred in UpdateProduct: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        },
        CreateProduct: function(newProduct) {
            // Return promise
            var deferred = $q.defer();

            var CreateProductResource = $resource('/Services/GeneralServices.svc/CreateProduct' +
                '/:username/:password/:title/:minPrice/:maxPrice/:requiredOrders');
            var user = getuserDetails();
            CreateProductResource.get(
                {
                    username: encodeURI(user.userName),
                    password: encodeURI(user.password),
                    title: newProduct.Title,
                    minPrice: newProduct.MinPrice,
                    maxPrice: newProduct.MaxPrice,
                    requiredOrders: newProduct.RequiredOrders
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in CreateProduct.');
                    console.error('Error occurred in CreateProduct: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        },
        RemoveProduct: function(productId) {
            // Return promise
            var deferred = $q.defer();

            var RemoveProductResource = $resource('/Services/GeneralServices.svc/RemoveProduct' +
                '/:username/:password/:productId');
            var user = getuserDetails();
            RemoveProductResource.get(
                {
                    username: encodeURI(user.userName),
                    password: encodeURI(user.password),
                    productId: productId
                },
                // Success
                function(data, responseHeaders) {
                    if(data && data.Succeed == true) {
                        deferred.resolve();
                    } else {
                        deferred.reject(data.Message);
                    }
                }
                // Error
                ,function(responseHeaders){
                    deferred.reject('Error occurred in RemoveProduct.');
                    console.error('Error occurred in RemoveProduct: ' + responseHeaders.data);
                });

            // Return promise
            return deferred.promise;
        }
    }
});