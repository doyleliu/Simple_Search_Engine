const fileQueue = require('filequeue');
const elasticsearch = require('elasticsearch');
const INDEX_NAME = "newcs510preprojdata";
const TYPE = "article";
const ROOT_DIR = "./Data/grobid_processed/";
const OUTPUT_DIR = "./Data/output/";
const TOTAL_DOCS = 40376;

const fq = new fileQueue(200);

const esClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'error'
});

let articles = [];

const bulkIndex = function bulkIndex(index, type, data) {
    let bulkBody = [];

    data.forEach(item => {
        bulkBody.push({
            index: {
                _index: index,
                _type: type,
                _id: item.fileName
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

const writeToFile = function writeToFile(articles) {
    articles.forEach(article => {
        fq.writeFile(OUTPUT_DIR + article.fileName+'.json', JSON.stringify(article), err => {
            if (err) {
                throw err;
            }
        })
    })
};

// only for testing purposes
// all calls should be initiated through the module
const test = function test() {
    let toParse = ['title', 'abstract', 'introduction'];

    fq.readdir(ROOT_DIR, function(err, files) {
        if(err) {
            throw err;
        }
        files.forEach((file) => {
            fq.readFile(ROOT_DIR + file, 'utf8', (err, res) => {
                let articleRes = {};
                articleRes['fileName'] = file.split(".")[0];
                if (err) {
                    console.log("File read failed:", err);
                } else {
                    toParse.forEach(parseKey => {
                        let re = new RegExp(`<${parseKey}>\n(.+)`);
                        let item = re.exec(res);
                        if (item) {
                            articleRes[parseKey] = item[1];
                        } else {
                            articleRes[parseKey] = "";
                        }
                    });
                    articles.push(articleRes);
                    if (articles.length === TOTAL_DOCS) {
                        console.log(`${articles.length} items parsed from data file`);
                        bulkIndex(INDEX_NAME, TYPE, articles);
                        // writeToFile(articles);
                    }
                }
            });
        });
    });
};

test();

module.exports = {
    bulkIndex
};