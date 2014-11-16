'use strict';

var app = angular.module('rumors.pusher', ['rumors.home']);

app.controller('PusherCtrl', ['$scope','rumorsService','$timeout', function($scope, rumorService, $timeout){

  console.log('pippo')
  var msgs = [
    {msg: 'Sono seduta la bar qui fuori. Chi mi offre da bere?', time: 4000},
    {msg: 'Forza Roma!', time: 2500},
    {msg: 'Forza Lazio!', time: 2500},
    {msg: 'Chi vuole venire a fare una corsetta con me?', time: 5000},
  ];

 var pushingRumor = function(text){
   return {id: guid(),
    lat: 44,
    long: 11,
    msg: text};
  };

  var i = 0;
  var sendMsg = function(){
    rumorService.pushRumor(pushingRumor(msgs[i].msg));
    $timeout(sendMsg, msgs[i].time);
    i = (i+1) % msgs.length;
  };

  sendMsg();
}]);

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