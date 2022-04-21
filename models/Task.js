import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
    },
    fechaEntrega: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: Boolean,
        default: false,
    },
    prioridad: {
        type: String,
        required: true,
        enum: ['Alta', 'Media', 'Baja'],
    },
    proyecto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);
export default Task;