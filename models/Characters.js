const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const charactersSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        age: { type: Number, max: 100, min: [10, 'Eres demasiado pequeño para ser atracador'] },
        alias: { type: String, required: true },
        picture: String
    },
    {
        timestamps: true
    }
);

const Character = mongoose.model('Character', charactersSchema);

const juan = new Character({ name: 'Juan', alias: 'Pamplona', age: 2 });
// const error = juan.validateSync();
//console.log(error)

module.exports = Character;