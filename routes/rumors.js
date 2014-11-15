var express = require('express');
var router = express.Router();

var rumorsData = [];

var score= function(rumor,now,lat,long) {
  var elapsed=now.getTime()-rumor.time.getTime();
  return elapsed;
};

/* GET users listing. */
router.get('/locals/:lat/:long', function(req, res) {
  var now = new Date();
  var results = [];
  for (var i=0; i<rumorsData.length; i++) {
    results.push(rumorsData[i]);
  }
  results.sort(function(a,b) {
    var aScore = score(a,now,req.params.lat,req.params.long);
    var bScore = score(b,now,req.params.lat,req.params.long);
    return aScore-bScore;
  });
  var portions = results.slice(0,8);
  for (var i=0; i<portions.length; i++) {
    portions[i].order=i+1;
  }
  res.json(portions);
});
var colors = [
  '#f3b200',
  '#632f00',
  '#4617b4',
  '#00c13f',
  '#aa40ff',
  '#91d100',
  '#fe7c22',
  '#77b900',
  '#b01e00',
  '#006ac1'
];
var i = 0;
router.post('/locals/push', function(req, res) {

  var newRumor = req.body;
  newRumor.time = new Date();
  newRumor.color = colors[i++ % colors.length];
    newRumor.big = (i%5==0);
  console.log("put msg ",newRumor);
  rumorsData.push(newRumor);
  if (rumorsData.length>20) {
    rumorsData.splice(0,rumorsData.length-20);
  }
  res.json({
    status: "OK"
  });
});

module.exports = router;
