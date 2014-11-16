'use strict';

var app = angular.module('rumors.pusher', ['rumors.home']);

app.controller('PusherCtrl', ['$scope','rumorsService','$timeout', function($scope, rumorService, $timeout){

  console.log('pippo')
  var msgs = [
    {msg: 'è in corso la presentazione di Rumors!', time: 3000},
    {msg: 'Sono seduta la bar qui fuori. Chi mi offre da bere?', time: 6000},
    {msg: 'è stato un super weekend!', time: 3500},
    {msg: 'Chi vuole venire a fare una corsetta con me?', time: 5000},
    {msg: 'Android lollipop è una figata pazzesca', time: 2500},
    {msg: 'Da Zio Pepe una pizza ed una birra a sole 5€ #ziopepe', time: 3000},
    {msg: 'Avete visto un bassotto nero? è scappato!', time: 3500},
    {msg: 'La Elena si tromba Simone!!! :)', time: 1000},
    {msg: 'Vi piace Rumors?', time: 1000},
    {msg: 'Vendo la mia bicicletta Canondale X5000, sono qui al bar', time: 2000},
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