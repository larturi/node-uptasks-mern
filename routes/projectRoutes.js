import express from 'express';

import {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addColaborator,
    deleteColaborator,
} from "../controllers/projectController.js";

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
    .route('/')
    .get(checkAuth, getProjects)
    .post(checkAuth, newProject);

router
    .route('/:id')
    .get(checkAuth, getProject)
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject);

router.post('/:id/add-colaborator/:id', checkAuth, addColaborator);
router.post('/:id/delete-colaborator/:id', checkAuth, deleteColaborator);

export default router;