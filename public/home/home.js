'use strict';

angular.module('rumors.home', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .factory('rumorsService', ['$resource','$q', function ($resource,$q) {

        var localRumors = $resource("rumors/locals/:lat/:long");

        return {
            getRumors: function() {
                var defer = $q.defer();
                localRumors.query({
                    lat: 12,
                    long: 23
                },function(data) {
                    defer.resolve(data);
                });
                return defer.promise;
            }
        };

    }])
    .controller('HomeCtrl', ['$scope','rumorsService','$timeout', function ($scope,rumorsService,$timeout) {

        $scope.rumors = [
            {msg:"mock message1"},
            {msg:"mock message2"},
            {msg:"mock message3"}
        ];

        var mergeRumors = function(newRumors) {
          console.log(newRumors);
        };

        var pollRumor = function() {
            $timeout(function() {
                rumorsService.getRumors().then(function(rumors) {
                    mergeRumors(rumors);
                    pollRumor();
                });
            },1000,true);
        };

        pollRumor();

    }])
;