'use strict';

angular.module('myApp')
.controller('registerController', function ($location, userPermissions) {
    var vm = this;

    this.profiles = [
        { name: "Default", url: "Default.jpg" },
        { name: "Unknown", url: "Unknown.jpg" }
    ];
    this.nextPage = "LogInPage";
    this.roles = ["User", "ProductManager"];

    this.register = function () {
        if (!vm.userName || !vm.password || !vm.email)
            vm.message = "Please enter user details.";
        else {
            userPermissions.registerUser(vm.userName, vm.password,
                vm.selectedRole, vm.email/*, vm.selectedProfile.url*/)
            .then(function () {
                $location.path(vm.nextPage);
            }, function (reason) {
                vm.message = reason;
            });
        }
    };
});