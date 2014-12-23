'use strict';

angular.module('myApp')
.controller('registerController', function ($location, userPermissions) {
    var vm = this;

    this.nextPage = "LogInPage";
    this.profiles = [
        { name: "Default", url: "Default.jpg" },
        { name: "Unknown", url: "Unknown.jpg" }
    ];
    
    this.register = function () {
        if (!vm.userName || !vm.password || !vm.email)
            vm.message = "Please enter user details.";
        else {
            userPermissions.registerUser(vm.userName, vm.password, vm.email)
            .then(function () {
                $location.path(vm.nextPage);
            }, function (reason) {
                vm.message = reason;
            });
        }
    };
});