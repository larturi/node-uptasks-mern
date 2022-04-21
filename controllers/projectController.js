import Project from '../models/Project.js';
import User from '../models/User.js';

const getProjects = async(req, res) => {
    const projects = await Project.find({
            $or: [
                { colaboradores: { $in: req.user } },
                { creador: { $in: req.user } },
            ],
        })
        .select('-tareas')
        .sort({ createdAt: -1 })
        .exec();
    res.json(projects);
};

const newProject = async(req, res) => {
    const project = new Project(req.body);
    project.creador = req.user._id;

    try {
        const projectSaved = await project.save();
        res.json(projectSaved);
    } catch (error) {
        console.error(error);
    }
};

const getProject = async(req, res) => {
    const id = req.params.id;

    if (id.length !== 24) {
        const error = new Error('invalid_id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id)
        .populate({
            path: 'tareas',
            populate: { path: 'completedBy', select: 'nombre email id' },
            options: { sort: { fechaEntrega: 1 } },
        })
        .populate('colaboradores', 'nombre email')
        .exec();

    if (!project) {
        const error = new Error('project_not_found');
        return res.status(404).json({ msg: error.message });
    }

    if (
        project.creador.toString() !== req.user._id.toString() &&
        !project.colaboradores.some((colaborador) => {
            return colaborador._id.toString() === req.user._id.toString();
        })
    ) {
        const error = new Error('not_authorized');
        return res.status(401).json({ msg: error.message });
    }

    res.json(project);
};

const editProject = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('invalid_id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id);

    if (!project) {
        const error = new Error('project_not_found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creador.toString() !== req.user._id.toString()) {
        const error = new Error('not_authorized');
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
};

const deleteProject = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('invalid_id');
        return res.status(404).json({ msg: error.message });
    }

    const project = await Project.findById(id);

    if (!project) {
        const error = new Error('project_not_found');
        return res.status(404).json({ msg: error.message });
    }

    if (project.creador.toString() !== req.user._id.toString()) {
        const error = new Error('not_authorized');
        return res.status(401).json({ msg: error.message });
    }

    await project.remove();

    res.json({ msg: 'Project deleted' });
};

const searchCollaborator = async(req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email }).select('email nombre _id');

    if (!user) {
        const error = new Error('user_not_found');
        return res.status(404).json({ msg: error.message });
    } else {
        res.json(user);
    }
};

const addCollaborator = async(req, res) => {
    const proyecto = await Project.findById(req.params.id);

    if (!proyecto) {
        const error = new Error('project_not_found');
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.user._id.toString()) {
        const error = new Error('not_authorized');
        return res.status(401).json({ msg: error.message });
    }

    const { email } = req.body;
    const user = await User.findOne({ email }).select('email nombre _id');

    if (!user) {
        const error = new Error('user_not_found');
        return res.status(404).json({ msg: error.message });
    }

    // El colaborador no es el creador del proyecto
    if (proyecto.creador.toString() === user._id.toString()) {
        const error = new Error('user_is_creator');
        return res.status(400).json({ msg: error.message });
    }

    // El colaborador ya está en el proyecto
    if (proyecto.colaboradores.includes(user._id)) {
        const error = new Error('user_already_in_project');
        return res.status(400).json({ msg: error.message });
    }

    proyecto.colaboradores.push(user._id);
    await proyecto.save();
    res.json({ msg: 'collaborator_added' });
};

const deleteCollaborator = async(req, res) => {
    const proyecto = await Project.findById(req.params.id);

    if (!proyecto) {
        const error = new Error('project_not_found');
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.user._id.toString()) {
        const error = new Error('not_authorized');
        return res.status(401).json({ msg: error.message });
    }

    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    res.json({ msg: 'collaborator_removed' });
};

export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollaborator,
    deleteCollaborator,
    searchCollaborator,
};