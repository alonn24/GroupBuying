'use strict';

angular.module('myApp')
.service('productsFacade', function (serverFacade, userDetails) {
    this.getProducts = function (userName) {
        if (userName)
            return serverFacade.getUserProducts(userName);
        else
            return serverFacade.getAllProducts();
    };

    this.getProductDetails = function (productId) {
        return serverFacade.getProductDetails(productId)
        .then(function (data) {
            data.TotalQuantity = 0;
            for (var i = 0; i < data.Orders.length; i++) {
                data.TotalQuantity += (data.Orders[i].Quantity * 1);    // Add total quantity
                data.Orders[i].Date = data.Orders[i].Date.fromMSJSON();
            }
            if (data.Product.DatePosted) {
                data.Product.DatePosted = data.Product.DatePosted.fromMSJSON();
            }
            if (data.DateEnd) {
                data.DateEnd = data.DateEnd.fromMSJSON();
            }
            return data;
        });
    };

    this.updateProductDetails = function (product) {
        var productToSave = angular.copy(product);
        productToSave.DatePosted = product.DatePosted.toMSJSON();
        return serverFacade.updateProductDetails(productToSave);
    };

    this.createProduct = function (newProduct) {
        var user = userDetails;
        return serverFacade.createProduct(newProduct);
    };

    this.removeProduct = function (productId) {
        var user = userDetails;
        return serverFacade.removeProduct(productId)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
        });
    };
});