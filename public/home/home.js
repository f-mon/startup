'use strict';

angular.module('rumors.home', ['ngRoute', 'ngResource'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'home/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .factory('getPosition', ['$q', function($q) {
        return function() {
            var defer = $q.defer();
            navigator.geolocation.getCurrentPosition(function(loc) {
                defer.resolve(loc);
            });
            return defer.promise;
        }
    }])
    .factory('rumorsService', ['$resource','$q','$http','getPosition', function ($resource,$q,$http,getPosition) {

        var Rumor = $resource("rumors/locals/:lat/:long");

        return {

            pushRumor: function(rumor) {
                return $http.post("rumors/locals/push",rumor);
            },

            getRumors: function() {
                return getPosition().then(function(pos) {
                    var defer = $q.defer();
                    Rumor.query({
                        lat: pos.coords.latitude,
                        long: pos.coords.longitude
                    },function(data) {
                        defer.resolve(data);
                    });
                    return defer.promise;
                });
            }
        };

    }])
    .controller('HomeCtrl', ['$scope','rumorsService','$timeout','$q','getPosition', function ($scope,rumorsService,$timeout,$q,getPosition) {

        $scope.rumors = [];

        $scope.newRumor = {};

        $scope.pushRumor = function() {
            getPosition().then(function(pos){
                $scope.newRumor.id = guid();
                $scope.newRumor.lat=pos.coords.latitude;
                $scope.newRumor.long=pos.coords.longitude;
                rumorsService.pushRumor($scope.newRumor);
                $scope.newRumor = {};
            });
        };

        var count=0;

        var mergeRumors = function(newRumors) {

            console.log("ritornati: ",newRumors.length);
            count=count+1;
            for (var i=0; i<newRumors.length; i++) {
                var r = newRumors[i];
                if (!mergeRumor(r)) {
                    r.version= count;
                    $scope.rumors.push(r);
                }
            }
            removeObsoleteRumors();
        };

        var mergeRumor = function(newRumor) {
            for (var i=0; i<$scope.rumors.length; i++) {
                var r = $scope.rumors[i];
                if (newRumor.id===r.id) {
                    updateRumor(r,newRumor);
                    return true;
                }
            }
            return false;
        };

        var updateRumor = function(oldRumor,newRumor) {
            oldRumor.version = count;
        };

        var removeObsoleteRumors = function() {
            for (var i=$scope.rumors.length-1; i>0; i--) {
                var r = $scope.rumors[i];
                if (!r.version || r.version<count) {
                    $scope.rumors.splice(i,1);
                }
            }
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

        var guid = (function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return function() {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        })();

    }])
;