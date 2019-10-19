const fs = require('fs');
const elasticsearch = require('elasticsearch');
const INDEX_NAME = "newcs510preprojdata";
const TYPE = "article";

const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

const bulkIndex = function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
        bulkBody.push({
            index: {
                _index: index,
                _type: type,
                _id: item.id
            }
        });

        bulkBody.push(item);
    });

    esClient.bulk({body: bulkBody})
        .then(response => {
            let errorCount = 0;
            response.items.forEach(item => {
                if (item.index && item.index.error) {
                    console.log(++errorCount, item.index.error);
                }
            });
            console.log(`Successfully indexed ${data.length - errorCount} out of ${data.length} items`);
        })
        .catch(err => console.log(err));
};

// only for testing purposes
// all calls should be initiated through the module
const test = function test() {
    let articles = [];

    fs.readFile('Academic_papers/docs.json', 'utf8', (err, res) => {
        if (err) {
            console.log("File read failed:", err);
            return
        }
        // console.log('File data:', res);
        let lines = res.split('\n');
        for(let line = 0; line < lines.length; line++){
            if (lines[line]) {
                let jsonRes = JSON.parse(lines[line]);
                let actualRes = {
                    keyPhrases: jsonRes.keyPhrases,
                    paperAbstract: jsonRes.paperAbstract ? jsonRes.paperAbstract[0] : undefined,
                    numberKeyReferences: jsonRes.numberKeyReferences,
                    title: jsonRes.title ? jsonRes.title[0] : undefined,
                    venue: jsonRes.venue ? jsonRes.venue[0] : undefined,
                    numCitedBy: jsonRes.numCitedBy ? jsonRes.numCitedBy[0]: undefined,
                    numKeyCitations: jsonRes.numKeyCitations ? jsonRes.numKeyCitations[0] : undefined,
                    docno: jsonRes.docno,
                    id: line
                };
                articles.push(actualRes);
            }
        }
        console.log(`${articles.length} items parsed from data file`);
        bulkIndex(INDEX_NAME, TYPE, articles)
    });

};

test();

module.exports = {
    bulkIndex
};