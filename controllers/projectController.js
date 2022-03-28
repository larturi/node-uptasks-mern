import Project from "../models/Project.js";

const getProjects = async(req, res) => {
    const projects = await Project.find();
    res.json(projects);
}

const newProject = async(req, res) => {

}

const getProject = async(req, res) => {

}

const editProject = async(req, res) => {

}

const deleteProject = async(req, res) => {

}

const addColaborator = async(req, res) => {

}

const deleteColaborator = async(req, res) => {

}

const getTasks = async(req, res) => {

}

export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addColaborator,
    deleteColaborator,
    getTasks,
}