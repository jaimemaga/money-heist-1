require('dotenv').config();

const express = require('express');
const cors = require('cors');
const charactersRouter = require('./routes/characters.routes.js');
const locationsRouter = require('./routes/locations.routes.js');
const connect = require('./utils/db-connect.js');
const passport = require('passport');
const userRouter = require('./routes/users.routes.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const cloudinary = require('cloudinary');


connect();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

const server = express();

// server.set("secretKey", "nodeRestApi");

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET
});

require('./utils/authentication/passport.js');

server.use(session({
    secret: process.env.SESSION_SECRET_KEY || 'miSecreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: MongoStore.create({
        mongoUrl: DB_URL
    })
}));
server.use(passport.initialize());
server.use(passport.session());

server.get('/api', (req, res) => {
    res.json("Bienvenido a mi API REST");
});

server.use('/api/user', userRouter);
server.use('/api/characters', charactersRouter);
server.use('/api/locations', locationsRouter);

server.use('*', (req, res, next) => {
    const err = new Error('La ruta no existe');
    err.status = 404;
    next(err);
});

server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

server.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`);
});