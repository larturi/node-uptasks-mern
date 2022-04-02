import User from '../models/User.js';
import generarHashUser from '../helpers/generarHashUser.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegister } from '../helpers/emails.js';

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

        emailRegister({
            email: newUser.email,
            nombre: newUser.nombre,
            token: newUser.token,
        });

        // Remove password from response
        newUser.password = undefined;
        newUser.token = undefined;
        newUser.__v = undefined;

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

const confirmUser = async(req, res) => {
    const { token } = req.params;
    const userConfirmed = await User.findOne({ token });
    if (!userConfirmed) {
        const error = new Error('Invalid token');
        return res.status(400).json({ msg: error.message });
    }

    try {
        userConfirmed.confirmed = true;
        userConfirmed.token = '';
        await userConfirmed.save();
        res.json({ msg: 'Account confirmed' });
    } catch (error) {
        console.error(error)
    }
}

const recoveryPassword = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error('User not found');
        return res.status(400).json({ msg: error.message });
    }

    try {
        user.token = await generarHashUser();
        await user.save();
        res.json({ msg: 'Email sent' });
    } catch (error) {
        console.error(error);
    }
}

const verifyToken = async(req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error('Invalid token');
        return res.status(400).json({ msg: error.message });
    }

    res.json({ msg: 'Token valid' });
}

const newPassword = async(req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ token });
    if (!user) {
        const error = new Error('Invalid token');
        return res.status(400).json({ msg: error.message });
    }

    user.password = password;
    user.token = '';

    try {
        user.save();
        res.json({ msg: 'Password changed' });
    } catch (error) {
        console.error(error);
    }
}

const profile = async(req, res) => {
    const { user } = req;
    res.json(user);
}

export {
    registerUser,
    loginUser,
    confirmUser,
    recoveryPassword,
    verifyToken,
    newPassword,
    profile,
}