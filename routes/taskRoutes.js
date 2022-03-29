import express from 'express';

import {
    getTasks,
    newTask,
    getTask,
    editTask,
    deleteTask,
    changeState,
} from "../controllers/taskController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
    .route('/')
    .get(checkAuth, getTasks)
    .post(checkAuth, newTask);

router
    .route('/:id')
    .get(checkAuth, getTask)
    .put(checkAuth, editTask)
    .delete(checkAuth, deleteTask);

router.post('/estado/:id', checkAuth, changeState);

export default router;