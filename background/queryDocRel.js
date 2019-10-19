const db = require("./model/index");
const express = require('express');
const router = express.Router();

router.post('/', function(req, res){
    let queryDocRelItem = {
        query: req.body.query,
        document_title: req.body.document_title,
        relevance: req.body.relevance
    };

    db.query(`insert into queryDocRelevance set ?`, queryDocRelItem, function (err) {
        if (err) {
            console.log("Cannot insert query-document-relevance item into table." + err);
        } else {
            return res.send("feedback recorded!");
        }
    })
});

router.get('/', function(req, res){
    res.send('u got me!');
});

module.exports = router;
