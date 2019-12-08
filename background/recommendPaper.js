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
        query: {
            more_like_this : {
                like : [
                    {
                        _index : INDEX_NAME,
                        _id : req.body.ids
                    }
                ],
                fields : ["title", "abstract"],
                min_term_freq : 1,
                max_query_terms : 12
            }
        }
    };

    console.log(`retrieving documents similar to '${req.body.ids}'...`);
    search(INDEX_NAME, body)
        .then(results => {
            console.log(`found ${results.hits.total} items in ${results.took}ms`);

            if (results.hits.total > 0) {
                console.log(`returned article titles:`);
            }

            let return_result = [];
            results.hits.hits.forEach((hit) => {
                let return_result_item = {
                    titles: hit._source.title,
                    abstracts: hit._source.paperAbstract,
                    ids: hit._source.id,
                    query:req.body.ids,
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