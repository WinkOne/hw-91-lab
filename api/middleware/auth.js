const User = require('../model/User');

const auth = async (req, res, next) => {
    const authorizationHeader = req.get('Authorization');

    if (authorizationHeader === 'anonim') {
        req.user = 'anonim';
        return next();
    }
    if (!authorizationHeader) {
        return res.status(401).send({error: 'Not authorization'});
    }

    const [type, token] = authorizationHeader.split(' ');

    if (type !== "Token" || !token) {
        return res.status(401).send({error: 'Not authorization'})
    }

    const user = await User.findOne({token});

    if (!user) {
        return res.status(401).send({error: 'Not authorization'})
    }

    req.user = user;

    next();
};

module.exports = auth;