import express from 'express';
const router = express.Router();
import { registerUser, loginUser } from '../controllers/userController.js';

// CRUD Users
router.post('/', registerUser);
router.post('/login', loginUser);

export default router;