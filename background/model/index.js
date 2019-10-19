const mysql = require('mysql');

// Connect to local database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CS411!!!",
    database: "CS510",
    port: "3306"
});

connection.connect(function(err){
    if(err) {
        console.log("Database not connected!");
        throw err;
    }
    console.log('Database connected!');
});

let queryDocRelevance = "create table if not exists queryDocRelevance (" +
    "qdr_id int NOT NULL AUTO_INCREMENT," +
    "query char(255)," +
    "document_title char(255)," +
    "relevance boolean," +
    "PRIMARY KEY (qdr_id)" +
    ");";

connection.query(queryDocRelevance, function(err){
    if (err) {
        console.log("Error when creating table queryDocRelevance. " + err);
    }
});

module.exports = connection;