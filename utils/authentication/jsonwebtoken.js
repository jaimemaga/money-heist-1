const jwt = require('jsonwebtoken');

const getJWT = (userInfo) => {
    console.log('CLAVE: ', process.env.JWT_SECRET_KEY);
    return jwt.sign(
        {
            id: userInfo._id,
            name: userInfo.email
        },
        process.env.JWT_SECRET_KEY || 'miSecreto',
        { expiresIn: 60 }
    );
}

module.exports = getJWT;