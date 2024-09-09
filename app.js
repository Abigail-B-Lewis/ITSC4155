//modules
const express = require('express');
const mysql = require('mysql');

//create app
const app = express();

//configure app
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

let server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//dummy data to show testing functionality - delete later
function sum(a, b) {
    return a + b;
};

module.exports = sum;
