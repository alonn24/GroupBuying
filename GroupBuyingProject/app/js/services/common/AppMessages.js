'use strict';
angular.module('app.common')
.service('appMessages', function ($location) {
    var _this = this;
    this.message = '';
    this.type = '';

    this.setMessage = function (message) {
        this.message = message;
        this.type = 'success';
    };

    this.setErrorMessage = function (message) {
        this.message = message;
        this.type = 'error';
    };

    this.clear = function () {
        this.message = '';
        this.type = '';
    };
});