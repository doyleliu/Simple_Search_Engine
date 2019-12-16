const express = require('express');
const router = express.Router();
const top10topcis = require('../Data/preprocessed/top10.json');

router.post('/', function(req, res) {
    let question = req.body.question.toLowerCase();
    if (question.includes("search")) {
        return res.json({
            answer: "You can type your query on our website."
        })
    } else if (question.includes("topic") && question.includes("what")) {
        return  res.json({
            answer: Object.keys(top10topcis)
        })
    } else if (question.includes('hi') || question.includes("hello")) {
        return res.json({
            answer: "How can I help you?"
        })
    } else {
        return res.json({
            answer: "Sorry I don't get you."
        })
    }
});

module.exports = router;