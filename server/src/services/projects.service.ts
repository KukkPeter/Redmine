import { FieldErrors, ValidateError } from "tsoa";
import { NewTask } from "../interfaces/newTask.interface";
import { NewProject } from "../interfaces/newProject.interface";

const db = require('../models');

class ProjectsService {
    constructor() {}

    async getAll(): Promise<any> {
        try {
            const projects = await db.projects.findAll();
            
            return projects;
        } catch(err) {
            throw new Error(`Ismeretlen hiba történt.\n${err}`);
        }
    }

    async newProject(body: NewProject): Promise<any> {
        try {
            const project = await db.projects.findOne({
                where: {
                    name: body.name
                }
            });

            const type = await db.project_types.findByPk(body.type_id);

            if(project == null) {                
                if(type != null) {
                    const newProject = await db.projects.create({
                        name: body.name,
                        description: body.description,
                        type_id: body.type_id
                    });

                    return newProject;
                } else {
                    throw new Error("Nincs ilyen projekt típus ezzel az ID-val!");
                }
            } else {
                throw new Error("Már van ilyen projekt ezzel a névvel!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:newProject");
        }
    }

    async getById(project_id: number): Promise<any> {
        try {
            const project = await db.projects.findByPk(project_id);

            if(project === null) {
                throw new Error("Nincs projekt ezzel az ID-val!");
            } else {
                return project;
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:getById");
        }
    }

    async deleteById(project_id: number): Promise<any> {
        try {
            const project = await db.projects.findByPk(project_id);

            if(project === null) {
                throw new Error("Nincs projekt ezzel az ID-val!");
            } else {
                await db.projects.destroy({
                    where: {
                      id: project.id,
                    },
                });
                return "Projekt törölve!";
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:deleteById");
        }
    }

    async getTasks(project_id: number): Promise<any> {
        try {
            const { count, rows } = await db.tasks.findAndCountAll({
                where: {
                    project_id: project_id
                }
            });

            if(count == 0) {
                throw new Error("Nincs projekt ezzel az ID-val!");
            } else {    
                return rows;
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:getTasks");
        }
    }

    async getDevelopers(project_id: number): Promise<any> {
        try {
            const result = await db.projects.findOne({
                where: {
                    id: project_id
                },
                include: db.developers
            });

            if(result != null) {    
                return result.developers;
            } else {
                throw new Error("Nincs projekt ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:getDevelopers");
        }
    }

    async newTask(project_id: number, body: NewTask): Promise<any> {
        try {
            const project = await db.projects.findOne({
                where: {
                    id: project_id
                },
                include: db.developers
            });

            const developer = await db.developers.findOne({
                where: {
                    id: body.developer_id
                }
            });

            const manager = await db.managers.findOne({
                where: {
                    id: body.manager_id
                }
            });

            if(project != null) {                
                if(developer != null) {
                    if(manager != null) {
                        let today = Date.now() + 1000 * 60 * 60 * 24 * 7; // +7 nap a határidő
                        const task = await db.tasks.create({
                            name: body.name,
                            description: body.description,
                            project_id: project.id,
                            user_id: body.manager_id,
                            deadline: today.toString()
                        });
    
                        await project.addDeveloper(developer);
    
                        return task;             
                    } else {
                        throw new Error('Nincs menedzser ezzel az ID-val!');
                    }
                } else {
                    throw new Error('Nincs fejlesztő ezzel az ID-val!');
                }
            } else {
                throw new Error("Nincs projekt ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:newTask");
        }
    }

    async deleteTask(task_id: number): Promise<any> {
        try {
            const task = await db.tasks.findByPk(task_id);

            if(task != null) {
                await db.tasks.destroy({
                    where: {
                      id: task.id,
                    },
                });
                return "Feladat törölve!";
            } else {
                throw new Error("Nincs feladat ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ProjectsService:deleteTask");
        }
    }
}

export default new ProjectsService();