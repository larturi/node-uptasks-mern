import User from '../models/User.js';
import generarHashUser from '../helpers/generarHashUser.js';

const registerUser = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        const error = new Error('User already exists');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = await generarHashUser();
        const newUser = await user.save();
        res.json(newUser);
    } catch (error) {
        console.error(error);
    }
};

export {
    registerUser,
}