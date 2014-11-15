'use strict';

angular.module('rumors.home', ['ngRoute', 'ngResource'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/home', {
      templateUrl: 'home/home.html',
      controller: 'HomeCtrl'
    });
  }])
  .factory('rumorsService', ['$resource', '$q', function ($resource, $q) {

    var localRumors = $resource("rumors/locals/:lat/:long");

    return {
      getRumors: function () {
        var defer = $q.defer();
        localRumors.query({
          lat: 12,
          long: 23
        }, function (data) {
          defer.resolve(data);
        });
        return defer.promise;
      }
    };

  }])
  .controller('HomeCtrl', ['$scope', 'rumorsService', '$timeout', function ($scope, rumorsService, $timeout) {

    $scope.rumors = [
      {sender: "LP", msg: "mock message1", db: 12},
      {sender: "AK", msg: "mock message2", db: 1},
      {sender: "FF", msg: "this is a message", db: 13},
      {sender: "FF", msg: "this is a message", db: 23}
    ];

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
    })

    var mergeRumors = function (newRumors) {
      container.isotope();
      console.log(newRumors);
    };

    var pollRumor = function () {
      $timeout(function () {
        rumorsService.getRumors().then(function (rumors) {
          mergeRumors(rumors);
          pollRumor();
        });
      }, 1000, true);
    };

    pollRumor();

  }])
;