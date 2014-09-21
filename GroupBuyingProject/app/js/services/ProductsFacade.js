'use strict';

angular.module('myApp')
.service('productsFacade', function (serverFacade, userPermissions) {
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
        var user = userPermissions.details;
        return serverFacade.orderProducts(user.userName, user.password, orders)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
            else {
                throw data.message;
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
                var date = new Date(parseInt(data.Product.DatePosted.substr(6)));
                data.Product.DatePosted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            }
            if (data.DateEnd) {
                var date = new Date(parseInt(data.DateEnd.substr(6)));
                data.DateEnd = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            }
            return data;
        });
    };

    this.updateProductDetails = function (product) {
        var user = userPermissions.details;
        return serverFacade.updateProductDetails(user.userName, user.password, product.ProductId, product.Title, 
            product.MinPrice, product.MaxPrice, product.RequiredOrders)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
            else {
                throw data.message;
            }
        });
    };

    this.createProduct = function (newProduct) {
        var user = userPermissions.details;
        return serverFacade.createProduct(user.userName, user.password, newProduct.Title,
            newProduct.MinPrice, newProduct.MaxPrice, newProduct.RequiredOrders)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
            else {
                throw data.message;
            }
        });
    };

    this.removeProduct = function (productId) {
        var user = userPermissions.details;
        return serverFacade.removeProduct(user.userName, user.password, productId)
        .then(function (data) {
            if (data.Succeed) {
                return data;
            }
            else {
                throw data.message;
            }
        });
    };
});