var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/locals/:lat/:long', function(req, res) {
  res.json([{
    msg: "mock message from sewrver"
  },{
    msg: "mock message from sewrver"
  },{
    msg: "mock message from sewrver"
  },{
    msg: "mock message from sewrver"
  }]);
  console.log(req.params.lat,req.params.long);
});

module.exports = router;
