'use strict';
angular.module('app.common').value('userDetails', {});

angular.module('app.common')
.service('userPermissions', function (serverFacade, userDetails) {
    var _this = this;

    function resetUserDetails() {
        userDetails.userName = '';
        userDetails.password = '';
        userDetails.role = '';
        userDetails.authorized = false;
        userDetails.email = '';
        userDetails.profile = '';
    }
    resetUserDetails();

    this.logOut = function () {
        resetUserDetails();
    };

    this.logIn = function (userName, password) {
        if (!userName || !password)
            throw 'userPermissions: user name and password are not valid';
        
        return serverFacade.getUserData(userName, password)
        .then(function (data) {
            if (data.Authorized) {
                // Save data to model
                userDetails.userName = data.UserName;
                userDetails.password = data.Password;
                userDetails.role = data.Role;
                userDetails.authorized = data.Authorized;
                userDetails.email = data.Email;
                userDetails.profile = data.Profile;

                return userDetails;
            }
            else {
                throw "User is not authorized.";
            }
        });
    };

    this.registerUser = function (username, password, role, email) {
        return serverFacade.registerUser(username, password, role, email)
        .then(function (data) {
            if (data.Succeed == true) {
                userDetails.userName = username;
                userDetails.password = password;
                userDetails.role = role;
                userDetails.authorized = true;
                userDetails.email = email;
                userDetails.profile = "Default.jpg";

                return userDetails;
            }
            else {
                throw "User alrdaey exists.";
            }
        });
    };
});