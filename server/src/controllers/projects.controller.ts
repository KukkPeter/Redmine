import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewTask } from '../interfaces/newTask.interface';
const db = require('../models');

@Route('/projects')
@Tags('Projects')
export class ProjetsController extends Controller {
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjects(): Promise<IResponse> {
        try {
            const projects = await db.projects.findAll();
            return {
                message: 'OK',
                status: '200',
                data: projects
            };
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err.message
            };
        }
    }

    @Get('/{projectId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectByID(@Path() projectId: number): Promise<IResponse> {
        try {
            const project = await db.projects.findByPk(projectId);

            if(project === null) {
                throw new Error("Nincs projekt ezzel az ID-val!");
            } else {
                return {
                    message: 'OK',
                    status: '200',
                    data: project
                };
            }
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err.message
            };
        }
    }

    @Get('/{projectId}/tasks')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getTasksForProject(@Path() projectId: number): Promise<IResponse> {
        try {
            const { count, rows } = await db.tasks.findAndCountAll({
                where: {
                    project_id: projectId
                }
            });

            if(count == 0) {
                throw new Error("Nincs projekt ezzel az ID-val!");
            } else {    
                return {
                    message: 'OK',
                    status: '200',
                    data: rows
                };
            }
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err.message
            };
        }
    }

    @Get('/{projectId}/developers')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDevelopersForProject(@Path() projectId: number): Promise<IResponse> {
        try {
            const result = await db.projects.findOne({
                where: {
                    id: projectId
                },
                include: db.developers
            });

            if(result != null) {    
                return {
                    message: 'OK',
                    status: '200',
                    data: result.developers
                };
            } else {
                throw new Error("Nincs projekt ezzel az ID-val!");
            }
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err.message
            };
        }
    }

    @Post('/{projectId}/newTask')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async newTaskForProject(@Path() projectId: number, @Body() body: NewTask): Promise<IResponse> {
        try {
            const project = await db.projects.findOne({
                where: {
                    id: projectId
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
    
                        return {
                            message: 'OK',
                            status: '200',
                            data: "Feladat hozzáadva a projekthez!"
                        };                    
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
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err.message
            };
        }
    } 
}