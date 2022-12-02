const express = require('express');
const Character = require('../models/Characters.js');
const isAuth = require('../utils/middlewares/auth.js');
const upload = require('../utils/middlewares/file.middleware.js');
const imageToUri = require('image-to-uri');
const fs = require('fs');
const uploadToCloudinary = require('../utils/middlewares/cloudinary.middleware.js');

const charactersRouter = express.Router();

charactersRouter.get('/', [isAuth], async (req, res, next) => {
    // Logica
    // return Character.find()
    //     .then(characters => {
    //         return res.status(200).json(characters);
    //     })
    //     .catch((err) => res.status(500).json(err));
    try {
        const characters = await Character.find();
        return res.status(200).json(characters);
    } catch (err) {
        next(err);
    }
});

charactersRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const character = await Character.findById(id, { alias: 1, age: 1, _id: 0 });
        if (character) {
            return res.status(200).json(character);
        } else {
            const err = new Error('No existe un personaje con el id indicado como parámetro');
            err.status = 404;
            next(err);
        }
    } catch (err) {
        next(err);
    }
});

charactersRouter.get('/age/:age', async (req, res, next) => {
    const age = req.params.age;
    try {
        const characters = await Character.find({ $and: [{ age: { $gt: age } }, { alias: { $nin: ['Tokio', 'Helsinki'] } }] }, { alias: 1, age: 1 });
        return res.status(200).json(characters);
    } catch (err) {
        next(err);
    }
});

charactersRouter.post('/create', [upload.single('picture'), uploadToCloudinary], async (req, res, next) => {
    try {
        const body = {...req.body};
        // body.picture = req.file ? req.file.filename : null;
        const filePath = req.file_url || null;
        // const image = imageToUri(filePath);
        body.picture = filePath;
        const newCharacter = new Character(body);
        const createdCharacter = await newCharacter.save();
        // await fs.unlinkSync(filePath);
        return res.status(201).json(createdCharacter);
    } catch (err) {
        next(err);
    }
});

charactersRouter.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const deletedCharacter = await Character.findByIdAndDelete(id);
        return res.status(200).json(deletedCharacter);
    } catch (err) {
        next(err);
    }
});

charactersRouter.put('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const modifiedCharacter = new Character(req.body);
        modifiedCharacter._id = id;
        const updatedCharacter = await Character.findByIdAndUpdate(id, modifiedCharacter);
        return res.status(200).json(updatedCharacter);
    } catch (err) {
        next(err);
    }
});

module.exports = charactersRouter;