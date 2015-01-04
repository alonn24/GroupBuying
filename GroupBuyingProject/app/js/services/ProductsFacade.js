'use strict';

angular.module('myApp')
.service('productsFacade', function (serverFacade, userDetails) {
    this.getProducts = function (userName) {
        if (userName)
            return serverFacade.getUserProducts(userName);
        else
            return serverFacade.getAllProducts();
    };

    this.orderProducts = function (products) {
        // Build orders string - id,quantity,shipping...
        var orders = "";
        for (var i = 0; i < products.length; i++) {
            if (i > 0) orders += ",";
            // Id
            orders += products[i].ProductId;
            // Quantity
            if (products[i].quantity)
                orders += "," + products[i].quantity;
            else
                orders += ",1";
            // Shipping
            if (products[i].shipping == true)
                orders += ",1";
            else
                orders += ",0";
        }
        var user = userDetails;
        return serverFacade.orderProducts(/*user.userName, user.password,*/ orders)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
        });
    };

    this.getProductDetails = function (productId) {
        return serverFacade.getProductDetails(productId)
        .then(function (data) {
            data.TotalQuantity = 0;
            for (var i = 0; i < data.Orders.length; i++) {
                data.TotalQuantity += (data.Orders[i].Quantity * 1);    // Add total quantity
                var date = new Date(parseInt(data.Orders[i].Date.substr(6)));
                data.Orders[i].Date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
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
        return serverFacade.removeProduct(user.userName, user.password, productId)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
        });
    };
});