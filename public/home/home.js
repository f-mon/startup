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

        $scope.newRumor = {};

        var isoContainer = $('#rumors').isotope({
          itemSelector: '.rumor',
          layoutMode: 'masonry',
          masonry: {
                columnWidth: ""
          },
          getSortData: {
                number: '[order]'
          },
          sortBy: ['number']
        });

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
                    r.isNew=true;
                    var el = createRumorElement(r);
                    isoContainer.isotope("insert",el);
                }
            }
            removeObsoleteRumors();
            isoContainer.isotope({
                sortBy: 'number'
            });
            isoContainer.isotope('reloadItems');
            isoContainer.isotope('layout');
        };

        var createRumorElement = function(r) {
            var el = $("<div></div>");
            el.attr("id","rumor_"+ r.id);
           // el.addClass("double-width");
            //el.addClass("double-height");
            el.addClass("isNew");
            el.addClass("rumor");
            el.addClass("messages");
            el.css("display","none");
            el.attr("order",r.order);
            el.attr("version",r.version);
            var html= "<div class='sender lp'>US</div>"+
                "<div class='msg'>"+r.msg+"</div>"+
                "<div class='db'><span class='icon-volume'>"+r.order+"+db</div>"+
                "<div class='distance'><span class='icon-location' style='color: red'></span>32 mt</div>"+
                "<div class='commentsCount'><span class='icon-pencil' style='color: #f2f2f2'></span>12</div>"+
                "<div class='echosCount'><span class='icon-echo' style='font-size: 1em'></span>7</div>";
            el.append(html);
            el.element=el;
            return el;
        };

        var mergeRumor = function(newRumor) {
            var el = $("#rumor_"+newRumor.id);
            if (el.length) {
                updateRumor(el,newRumor);
                return true;
            }
            return false;
        };

        var updateRumor = function(rumorElement,newRumor) {
            rumorElement.attr("version",count);
            rumorElement.attr("order",newRumor.order);
            rumorElement.removeClass("isNew");
        };

        var removeObsoleteRumors = function() {
            isoContainer.isotope( 'remove', $(".rumor[version="+(count-1)+"]"));
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