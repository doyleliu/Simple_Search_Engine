# Program Guide Step

This is a basic search engine implemented in React.js and Node.js. The setup process is listed in the below.

1. Install all the packages 
    #### `npm install`
2. Copy and paste paper documents (grobid_processed) into `./Data` folder
3. Classify papers, results are stored in `./Data/output`
    #### `python36 classify.py`
4. Further pre-processing, results are stored in `./Data/preprocessed`
    ####  `python36 map_field_paper.py`
5. Index the documents
    #### `node --max-old-space-size=4096 background/indexPaper.js`
    ```
    40,367 items parsed from data file
    Successfully indexed 40,367 out of 40,367 items
    ```
    #### `node background/indicesPaper.js`
6. Run the backend
    #### `node app.js`
    ```console
    server running @50000
    ```
7. Run the frontend client
    #### `yarn start`