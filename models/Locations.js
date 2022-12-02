const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: String,
    loot: String,
    characters:[{ type: mongoose.Types.ObjectId, ref: 'Character' }]
}, {
    timestamps: true
});

const Location = mongoose.model('Location', locationSchema)

module.exports = Location;