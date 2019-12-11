# Program Guide Step

This is a basic search engine implemented in React.js and Node.js. The setup process is listed in the below.

1. Install all the packages 
    #### `npm install`
2. Copy and paste paper documents (grobid_processed) into Data folder
3. Index the documents
    #### `node --max-old-space-size=4096 background/indexPaper.js`
    ```
    8541 items parsed from data file
    Successfully indexed 8541 out of 8541 items
    ```
    #### `node background/indicesPaper.js`
4. Run the backend
    #### `node app.js`
    ```console
    server running @50000
    ```
5. Run the frontend client
    #### `yarn start`