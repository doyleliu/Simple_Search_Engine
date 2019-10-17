var express = require('express');
var router = express.Router();
const elasticsearch = require('elasticsearch');

const esClient = new elasticsearch.Client({
    host: '127.0.0.1:9200',
    log: 'error'
  });

router.post('/', function(req, res, next) {
    query = req.body.query
    // The port of the search engine running in the background   
    search_engine_port = 26000;
    // TO_DO : implement a function which can retrieve the infomation that we need

    // results = sei.search(query)
    titles = []
    abstracts = []
    urls = []
    ids = []
    // docs_content = sei.search_engine.getContent(results)
    // for(single_dict in docs_content) {
    //     abstracts += [sei.boldface_query(single_dict['abstract'], query)]
    //     titles += [single_dict['title']]
    //     urls += [sei.get_pdf_url(single_dict['paper_id'])]
    //     ids += ['paperid' + str(single_dict['paper_id'].encode('utf-8')).replace(" ", "")]
    // }

    // example
    titles.push("One");
    abstracts.push("One");
    urls.push("www.google.com");
    ids.push("One");
       
    return_result = [{'titles': titles, 'abstracts': abstracts, 'urls': urls, 'ids': ids}]
    

    res.json(return_result);
})
module.exports = router;