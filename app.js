//modules
const express = require('express');
const mysql = require('mysql2');
const db = require('./models');
const User = require('./models/user')
const userRoutes = require('./routes/userRoutes');

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

//Rendering for other pages with userRoutes
app.use('/', userRoutes);

// db.sequelize.sync({force: false}).then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });  
// });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

