//modules
const express = require('express');
const mysql = require('mysql2');
const db = require('./models');
const courseRoutes = require('./routes/courseRoutes');

//create app
const app = express();

//configure app
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World! This is your first sample web application.');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/courses', courseRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

