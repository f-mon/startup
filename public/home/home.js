'use strict';

angular.module('rumors.home', ['ngRoute', 'ngResource'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl'
    });
  }])
    .factory('rumorsService', ['$resource','$q','$http', function ($resource,$q,$http) {

        var Rumor = $resource("rumors/locals/:lat/:long");

        return {

            pushRumor: function(rumor) {
                return $http.post("rumors/locals/push",rumor);
            },

            getRumors: function() {
                var defer = $q.defer();
                Rumor.query({
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

        $scope.rumors = [];

        $scope.newRumor = {};

    var container = $('#rumors').isotope({
      itemSelector: '.rumor',
      layoutMode: 'masonry',
      masonry: {
        columnWidth: '.grid-sizer'
      },
      getSortData: {
        name: '.db', // text from querySelector
        category: '[data-category]', // value of attribute
        weight: function (itemElem) { // function
          var weight = $(itemElem).find('.db').text();
          return parseFloat(weight.replace(/[\(\)]/g, ''));
        }
      },
      sortBy: 'db'
    });

        $scope.pushRumor = function() {
            $scope.newRumor.id = guid();
            $scope.newRumor.lat=123;
            $scope.newRumor.long=9999;
            rumorsService.pushRumor($scope.newRumor);
            $scope.newRumor = {};
        };

        var mergeRumors = function(newRumors) {
            for (var i=0; i<newRumors.length; i++) {
                var r = newRumors[i];
                if (!mergeRumor(r)) {
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

        };

        var removeObsoleteRumors = function() {
            for (var i=0; i<$scope.rumors.length; i++) {
                var r = $scope.rumors[i];
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