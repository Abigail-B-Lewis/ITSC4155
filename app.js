//modules
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const sequelize = require('./models/index.js');
const db = require('./models');
const User = require('./models/user')
const methodOverride = require('method-override');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const flash = require('connect-flash');
const http = require('http')
const WebSocket = require('ws');

//create app
const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const broadcast = (data) => {
    console.log("broadcast data:", data);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

// Event listener for new WebSocket connections
wss.on('connection', (ws) => {
    console.log('A new client has connected.');
    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.log('WebSocket error:', error);
    });
});

//configure app  
const port = 3000;
app.set('view engine', 'ejs');
   
app.use(session({
    secret: '1342534634534534',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60 * 60 * 1000}
}));

app.use(flash());

app.use((req, res, next) => {
    req.broadcast = broadcast;
    res.locals.user = req.session.user||null;
    res.locals.role = req.session.role||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

//Allows for CSS to be used from the Public folder
app.use(express.static('public'));
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);


//Index page rendering from User Routes
app.get('/', (req, res) => {
    res.render('login');
});


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

//error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

//should always be last in my routes
app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }
    res.status(err.status);
    res.render('error', {error: err});
});

// app.set('broadcast', broadcast);
// module.exports = app;