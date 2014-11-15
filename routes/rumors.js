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
  var portions = results.slice(0,4);
  for (var i=0; i<portions.length; i++) {
    portions[i].order=i+1;
  }
  res.json(portions);
});

router.post('/locals/push', function(req, res) {
  var newRumor = req.body;
  newRumor.time = new Date();
  console.log("put msg ",newRumor);
  rumorsData.push(newRumor);
  if (rumorsData.length>20) {
    rumorsData.splice(0,1);
  }
  res.json({
    status: "OK"
  });
});

module.exports = router;
