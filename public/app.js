'use strict';

// Declare app level module which depends on views, and components
angular.module('rumors', [
  'ngRoute',
  'rumors.home'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/home'});
}]);
