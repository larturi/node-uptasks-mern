import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
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
    cliente: {
        type: String,
        required: true,
        trim: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    colaboradores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }, ]
}, {
    timestamps: true
});

const Project = mongoose.model("Project", projectSchema);
export default Project;