const mongoose = require('mongoose');

const userSchma = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match:  [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchma);
module.exports = User;