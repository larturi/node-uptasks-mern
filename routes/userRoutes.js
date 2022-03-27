import express from 'express';
const router = express.Router();
import { registerUser, loginUser, confirmUser } from '../controllers/userController.js';

// CRUD Users
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/confirm/:token', confirmUser);

export default router;