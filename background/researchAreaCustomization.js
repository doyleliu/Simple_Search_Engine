const express = require('express');
const router = express.Router();
const elasticsearch = require('elasticsearch');
const INDEX_NAME = "newcs510preprojdata";
const top10topcis = require('../Data/preprocessed/top10.json');

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});

const search = function search(index, body) {
    return esClient.search({index: index, body: body});
};

router.post('/', function(req, res) {
    console.log(req.body);
    let input_topics = req.body.topics;
    let customized_papers = [];
    let body = {
        size: 20,
        from: 0,
        query: {
            multi_match: {
                query: req.body.query,
                fields: ["title", "abstract"]
            }
        }
    };

    input_topics.forEach(topic => {
       customized_papers = [...customized_papers, ...top10topcis[topic]]
    });

    console.log(`filtering out documents which are not among the selected top 10 topics ...`);
    search(INDEX_NAME, body)
        .then(results => {
            console.log(`found ${results.hits.hits.length} items in ${results.took}ms`);

            if (results.hits.total > 0) {
                console.log(`returned article titles:`);
            }

            let return_result = [];
            results.hits.hits.forEach((hit) => {
                let return_result_item = {
                    titles: hit._source.title,
                    abstracts: hit._source.abstract,
                    ids: hit._source.fileName,
                    query:req.body.query,
                };
                if (customized_papers.indexOf(return_result_item.ids) >= 0) {
                    return_result.push(return_result_item);
                } else {
                    console.log(return_result_item.ids);
                }
            });
            return res.json(return_result);
        })
        .catch(
            console.error
        );
});

module.exports = router;