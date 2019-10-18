var express = require('express');
var router = express.Router();
const elasticsearch = require('elasticsearch');
const INDEX_NAME = "newcs510preprojdata";

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
});

const search = function search(index, body) {
    return esClient.search({index: index, body: body});
};

router.post('/', function(req, res, next) {
    let body = {
        size: 20,
        from: 0,
        query: {
            match: {
                title: {
                    query: req.body.query,
                    minimum_should_match: 1,
                    fuzziness: 2
                }
            }
        }
    };

    console.log(`retrieving documents whose title matches '${body.query.match.title.query}'...`);
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
                    ids: hit._source.id
                };
                return_result.push(return_result_item);
            });

            console.log(return_result);
            return res.json(return_result);
        })
        .catch(
            console.error
        );
});

module.exports = router;