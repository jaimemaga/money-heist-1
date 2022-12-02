const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const connect = () => {
    mongoose.connect(DB_URL)
    .then((value) => {
        console.log('Base de datos conectada');
    })
    .catch((err) => console.log(err));
};

module.exports = connect;