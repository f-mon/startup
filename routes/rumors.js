var express = require('express');
var router = express.Router();

var rumorsData = [];

/* GET users listing. */
router.get('/locals/:lat/:long', function(req, res) {
  res.json(rumorsData);
  console.log(req.params.lat,req.params.long);
});

router.post('/locals/push', function(req, res) {
  var newRumor = req.body;
  console.log("put msg ",newRumor);
  rumorsData.push(newRumor);
  res.json({
    status: "OK"
  });
});

module.exports = router;
