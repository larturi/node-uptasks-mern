import Project from "../models/Project.js";
import Task from "../models/Task.js";

const getProjects = async(req, res) => {
    const projects = await Project.find().where('creador').equals(req.user._id).exec();
    res.json(projects);
}

const newProject = async(req, res) => {
    const project = new Project(req.body);
    project.creador = req.user._id;

    try {
        const projectSaved = await project.save();
        res.json(projectSaved);
    } catch (error) {
        console.error(error);
    }
}

const getProject = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id);

    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creador.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    const tasks = await Task.find().where('proyecto').equals(project._id).exec();

    const response = {
        project,
        tasks
    }

    res.json(response);
}

const editProject = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id);

    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creador.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    project.nombre = req.body.nombre || project.nombre;
    project.descripcion = req.body.descripcion || project.descripcion;
    project.fechaEntrega = req.body.fechaEntrega || project.fechaEntrega;
    project.cliente = req.body.cliente || project.cliente;

    try {
        const projectSaved = await project.save();
        res.json(projectSaved);
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
}

const deleteProject = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id);

    if (!project) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creador.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    await project.remove();

    res.json({ msg: 'Project deleted' });
}

const addColaborator = async(req, res) => {

}

const deleteColaborator = async(req, res) => {

}

export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addColaborator,
    deleteColaborator,
}