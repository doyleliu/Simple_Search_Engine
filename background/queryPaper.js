const express = require('express');
const router = express.Router();
const elasticsearch = require('elasticsearch');
const INDEX_NAME = "newcs510preprojdata";

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});

const search = function search(index, body) {
    return esClient.search({index: index, body: body});
};

router.post('/', function(req, res) {
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

    console.log(`retrieving documents whose title/abstract matches '${req.body.query}'...`);
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
                return_result.push(return_result_item);
            });
            return res.json(return_result);
        })
        .catch(
            console.error
        );
});

module.exports = router;