import express from 'express';

import {
    registerUser,
    loginUser,
    confirmUser,
    recoveryPassword,
    verifyToken,
    newPassword,
    profile,
} from '../controllers/userController.js';

import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// CRUD Users
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/confirm/:token', confirmUser);
router.post('/recovery-password', recoveryPassword);
router.route('/recovery-password/:token').get(verifyToken).post(newPassword);

router.get('/profile', checkAuth, profile);

export default router;