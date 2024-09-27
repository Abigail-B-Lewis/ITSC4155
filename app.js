//modules
const express = require('express');
const mysql = require('mysql2');
const db = require('./models');
const User = require('./models/user')

//create app
const app = express();

//configure app
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World! This is your first sample web application.');
});

// db.sequelize.sync({force: false}).then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });
// });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

