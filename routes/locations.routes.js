const express = require('express');
const Location = require('../models/locations.js');

const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res, next) => {
    try {
        const locations = await Location.find().populate('characters');
        return res.status(200).json(locations);
    } catch (err) {
        next(err);
    }
});

locationsRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const location = await location.findById(id).populate('characters');
        if (location) {
            return res.status(200).json(location);
        } else {
            const err = new Error('No existe un lugar con el id indicado como parámetro');
            err.status = 404;
            next(err);
        }
    } catch (err) {
        next(err);
    }
});

locationsRouter.post('/create', async (req, res, next) => {
    try {
        const body = {...req.body};
        const newLocation = new Location(body);
        const createdLocation = await newLocation.save();
        return res.status(201).json(createdLocation);
    } catch (err) {
        next(err);
    }
});

locationsRouter.put('/add-character', async (req, res, next) => {
    try {
        const { characterId, locationId } = req.body;
        const updatedLocation = await Location.findByIdAndUpdate(
            locationId,
            { $push: { characters: characterId } },
            { new: true }
        );
        return res.status(200).json(updatedLocation);
    } catch (err) {
        next(err);
    }
});

module.exports = locationsRouter;