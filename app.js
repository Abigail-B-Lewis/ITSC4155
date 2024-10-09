//modules
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const sequelize = require('./models/index.js');
const db = require('./models');
const User = require('./models/user')
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

//create app
const app = express();

//configure app
const port = 3000;
app.set('view engine', 'ejs');

//Allows for CSS to be used from the Public folder
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//Index page rendering from User Routes
app.get('/', (req, res) => {
    res.render('login');
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

