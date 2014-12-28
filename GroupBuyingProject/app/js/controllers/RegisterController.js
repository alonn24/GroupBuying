'use strict';

angular.module('myApp')
.controller('registerController', function (urlDispacher, appMessages, userPermissions) {
    var vm = this;

    this.nextPage = "LogInPage";
    this.profiles = [
        { name: "Default", url: "Default.jpg" },
        { name: "Unknown", url: "Unknown.jpg" }
    ];
    
    this.register = function () {
        if (!vm.userName || !vm.password || !vm.email)
            appMessages.setErrorMessage("Please enter user details.");
        else {
            userPermissions.registerUser(vm.userName, vm.password, vm.email)
            .then(function () {
                urlDispacher.navigateToLogIn();
            });
        }
    };
});