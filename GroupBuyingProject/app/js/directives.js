'use strict';

/* Directives */

angular.module('myApp.directives', ['app.common'])
// Set object to focus
.directive('focus', function () {
    return function (scope, element) {
        element[0].focus();
    }
})
.directive('linkNavigate', function ($location, userPermissions) {
    return {
        link:
            function LinkFn(scope, lElement, attrs) {
                scope.getUserDetails = function () {
                    return userPermissions.details;
                };
                // Bind click event
                lElement.bind('click', function () {
                    scope.$apply($location.path(attrs.linkNavigate));
                });
            }
    }
})
.directive('miniProfile', function ($parse) {
    return {
        restrict: 'E',
        controller: 'logInController',
        controllerAs: 'miniLogIn',
        transclude: true,
        template: '<div class="miniProfile" ng-transclude></div>',
        link: function LinkFn(scope, lElement, attrs) {
        }
    }
});