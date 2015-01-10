'use strict';
angular.module('app.common')
.service('urlDispacher', function ($location) {
    var _this = this;

    this.navigateToLogIn = function () {
        appMessages.clear();
        $location.path('LogInPage');
    };

    this.navigateToProduct = function (productId) {
        if (productId)
            $location.path('Product/' + productId);
        else
            $location.path('Products');
    };
});