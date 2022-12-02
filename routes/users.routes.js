const express = require('express');
const passport = require('passport');
const User = require('./models/User.js');
const getJWT = require('./utils/authentication/jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = express.Router();

userRouter.post('/register', (req, res, next) => {
    const done = (err, user) => {
        if (err) {
           return next(err);
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(201).json(user);
        });
    };

    passport.authenticate('register', done)(req);
});

userRouter.post('/login', (req, res, next) => {
    const done = (err, user) => {
        if (err) {
           return next(err);
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).json(user);
        });
    };

    passport.authenticate('login', done)(req);
});

userRouter.post('/login-jwt', async (req, res, next) => {
    const { email, password } = req.body;
    const currUser = await User.findOne({ email });

    if (!currUser) { return done(new Error('Este usuario no existe!')); }
    const isValidPassword = await bcrypt.compare(password, currUser.password);
    if (!isValidPassword) { return done(new Error('La contraseña introducida es incorrecta')); }

    currUser.password = null;
    const token = getJWT(currUser);

    return res.status(200).json({
        user: currUser,
        token
    });
});

userRouter.post('/logout', (req, res, next) => {
    if (req.user) {
        req.logout((err) => {
            if (err) { return next(err); }
            req.session.destroy(() => {
                res.clearCookie('connect.sid');
                return res.status(200).json('Hasta pronto!');
            });
        });
    } else {
        return res.sendStatus(304);
    }
});

module.exports = userRouter;