'use strict';

// Declare app level module which depends on views, and components
angular.module('rumors', [
  'ngRoute',
  'rumors.home',
  'rumors.pusher'
]).
  config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/push', {
      templateUrl: '/pusher/pusher.html',
      controller: 'PusherCtrl'
    })
      .otherwise({redirectTo: '/home'});
  }]);
