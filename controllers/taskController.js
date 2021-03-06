import Task from '../models/Task.js';
import Project from '../models/Project.js';

const newTask = async(req, res) => {
    const { proyecto } = req.body;

    if (proyecto.length != 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const projectExists = await Project.findById(proyecto);

    if (!projectExists) {
        const error = new Error('Project not found');
        return res.status(404).json({ msg: error.message });
    }

    if (projectExists.creador.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    const task = new Task(req.body);
    task.creador = req.user._id;

    try {
        const taskSaved = await task.save();
        // Almacenar el ID en el Proyecto
        projectExists.tareas.push(taskSaved._id);
        await projectExists.save();
        res.json(taskSaved);
    } catch (error) {
        console.error(error);
    }
};

const getTask = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const task = await Task.findById(id).populate('proyecto');

    if (!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    res.json(task);
};

const editTask = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const task = await Task.findById(id).populate('proyecto');

    if (!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    task.nombre = req.body.nombre || task.nombre;
    task.descripcion = req.body.descripcion || task.descripcion;
    task.prioridad = req.body.prioridad || task.prioridad;
    task.fechaEntrega = req.body.fechaEntrega || task.fechaEntrega;

    try {
        const taskSaved = await task.save();
        res.json(taskSaved);
    } catch (error) {
        console.error(error);
    }
};

const deleteTask = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const task = await Task.findById(id);

    if (!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    if (task.creador.toString() !== req.user._id.toString()) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    const project = await Project.findById(task.proyecto);
    project.tareas.pull(task._id);

    await Promise.allSettled([await project.save(), await task.remove()]);

    res.json({ msg: 'Task deleted' });
};

const changeState = async(req, res) => {
    const id = req.params.id;

    if (id.length < 24) {
        const error = new Error('Invalid id');
        return res.status(404).json({ msg: error.message });
    }

    const task = await Task.findById(id)
        .populate('proyecto')
        .populate('completedBy');

    if (!task) {
        const error = new Error('Task not found');
        return res.status(404).json({ msg: error.message });
    }

    if (
        task.creador.toString() !== req.user._id.toString() &&
        !task.proyecto.colaboradores.some(
            (colaborador) => colaborador._id.toString() === req.user._id.toString()
        )
    ) {
        const error = new Error('Not authorized');
        return res.status(401).json({ msg: error.message });
    }

    task.estado = !task.estado;
    task.completedBy = req.user._id;
    await task.save();

    const taskUpdated = await Task.findById(id)
        .populate('proyecto')
        .populate('completedBy');

    res.json(taskUpdated);
};

export { newTask, getTask, editTask, deleteTask, changeState };