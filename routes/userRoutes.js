import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    confirmUser,
    recoveryPassword,
    verifyToken,
    newPassword,
} from '../controllers/userController.js';

// CRUD Users
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/confirm/:token', confirmUser);
router.post('/recovery-password', recoveryPassword);
router.route('/recovery-password/:token')
    .get(verifyToken)
    .post(newPassword);

export default router;