import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const checkAuth = async(req, res, next) => {

    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId)
                .select('-password -confirmed -token -createdAt -updatedAt -__v');
            return next();
        } catch (error) {
            return res.status(401).json({ msg: 'Error to authenticate' });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    next();
}

export default checkAuth;