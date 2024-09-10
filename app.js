//modules
const express = require('express');
const mysql = require('mysql2');

//create app
const app = express();

//configure app
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World! This is your first sample web application.');
});

let server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//connecting to a db
/*
 - make sure mysql is installed on your laptop and mysql workbench is what 
 I used to run these commands. Make sure you adjust your username and password to be yours.
DROP DATABASE IF EXISTS officeq;
CREATE DATABASE officeq;
USE officeq;
uncomment the below code to test your connection
*/
/* var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "PASSWORD!",
    database: "officeq"
});
  
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
}); */
