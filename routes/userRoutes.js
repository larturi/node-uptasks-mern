import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/userController.js';

// CRUD Users
router.post('/', registerUser);

export default router;