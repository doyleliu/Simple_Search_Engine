var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    result = {
        val : "here"
    }
    
    search_engine_port = 26000;
    

    res.json(result);
})
module.exports = router;