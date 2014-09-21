'use strict';

angular.module('app.common')
.service('userPermissions', function (serverFacade) {
    var _this = this;
    this.details = {
        authorized: false
    };

    this.logOut = function () {
        angular.extend(this.details, {
            userName: '',
            password: '',
            role: '',
            authorized: false,
            email: '',
            profile: ''
        });
    };

    this.logIn = function (userName, password) {
        if (!userName || !password)
            throw 'userPermissions: user name and password are not valid';
        
        return serverFacade.getUserData(userName, password)
        .then(function (data) {
            if (data.Authorized) {
                // Save data to model
                _this.details.userName = data.UserName;
                _this.details.password = data.Password;
                _this.details.role = data.Role;
                _this.details.authorized = data.Authorized;
                _this.details.email = data.Email;
                _this.details.profile = data.Profile;
                return _this.details;
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
                _this.details.userName = username;
                _this.details.password = password;
                _this.details.role = role;
                _this.details.authorized = true;
                _this.details.email = email;
                _this.details.profile = "Default.jpg";
                return _this.details;
            }
            else {
                throw "User alrdaey exists.";
            }
        });
    };
});