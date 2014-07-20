'use strict';

/* Directives */

angular.module('myApp.directives', [])
// Set object to focus
.directive('focus', function () {
    return function (scope, element) {
        element[0].focus();
    }
})
.directive('linkNavigate', ['$location', 'userService', function ($location, userService) {
    return {
        link:
            function LinkFn(scope, lElement, attrs) {
                scope.user = userService.model;
                // Bind click event
                lElement.bind('click', function () {
                    scope.$apply($location.path(attrs.linkNavigate));
                });
            }
    }
}])
.directive('miniProfile', function ($parse, userService) {
    return {
        restrict: 'E',
        controller: 'userCtrl',
        transclude: true,
        template: '<div class="miniProfile" ng-transclude></div>',
        link: function LinkFn(scope, lElement, attrs) {
            /*scope.$watch('user.userName', function() {
                alert(userService.model.userName);
            });*/
        }
    }
});

/*angular.module('myApp.directives', []).
    directive('demoGreet', function ($parse) {
        return {
            scope: { userName: '=demoGreet' },  // Disable leaks
            link:
                function LinkFn(scope, lElement, attrs) {
                    scope.$watch(attrs.demoGreet, function (name) {
                        lElement.text('Hello ' + name);
                    }, true);
                    lElement.bind('click', function () {
                        scope.$apply(function () {
                            $parse(attrs.demoGreet).assign(scope, 'clicked!');  // Parameter
                        });
                    });
                }
        }
});*/