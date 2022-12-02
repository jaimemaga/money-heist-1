const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        const error = new Error("Unauthorized")
        error.status = 401;
        return next(error);
    }

    const splits = authorization.split(" ");
    if (splits.length != 2 || splits[0] != "Bearer") {
        const error = new Error("Bad request")
        error.status = 400;
        return next(error);
    }

    const token = splits[1];

    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'miSecreto');
    } catch (err) {
        return next(err);
    }

    req.authority = {
        id: payload.id,
        name: payload.name
    };
    next();
};

module.exports = isAuth;