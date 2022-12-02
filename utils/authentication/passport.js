const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../../models/User.js');

passport.use(
    'register',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const previousUser = await User.findOne({ email });
            if (previousUser) {
                const error = new Error('Ya hay un usuario registrado con este email');
                return done(error);
            }
            const encriptedPw = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password: encriptedPw
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
        } catch (err) {
            return done(err);
        }
    })
);

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        const currUser = await User.findOne({ email });

        if (!currUser) { return done(new Error('Este usuario no existe!')); }
        const isValidPassword = await bcrypt.compare(password, currUser.password);
        if (!isValidPassword) { return done(new Error('La contraseña introducida es incorrecta')); }
        currUser.password = null;
        return done(null, currUser);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
   return done(null, user._id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const currUser = await User.findById(userId);
        return done(null, currUser);
    } catch (err) {
        return done(err);
    }
});