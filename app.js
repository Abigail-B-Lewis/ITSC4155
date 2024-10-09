//modules
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const sequelize = require('./models/index.js');
const db = require('./models');
const userRoutes = require('./routes/userRoutes.js')
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
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);

app.use(session({
    secret: '1342534634534534',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 10000}
}));

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

