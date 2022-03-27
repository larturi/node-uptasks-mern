import User from '../models/User.js';
import generarHashUser from '../helpers/generarHashUser.js';
import generarJWT from '../helpers/generarJWT.js';

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

const loginUser = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Valido si existe el email
    if (!user) {
        const error = new Error('User or password incorrect');
        return res.status(400).json({ msg: error.message });
    }

    // Valido si el password es correcto
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const error = new Error('User or password incorrect');
        return res.status(400).json({ msg: error.message });
    }

    // Valido si esta confirmado
    if (!user.confirmed) {
        const error = new Error('Account not confirmed');
        return res.status(403).json({ msg: error.message });
    }

    return res.json({
        id: user._id,
        email: user.email,
        nombre: user.nombre,
        token: generarJWT(user._id),
    });

}

export {
    registerUser,
    loginUser,
}