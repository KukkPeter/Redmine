import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body, Query } from 'tsoa';
import { IResponse } from '../models/IResponse.interface';
import { NewTask } from '../models/newTask.interface';

// Statikus adat
let projects = [
    { id: 0, name: 'testProject0', type_id: 0, description: 'test Description 0'},
    { id: 1, name: 'testProject1', type_id: 1, description: 'test Description 1'},
    { id: 2, name: 'testProject2', type_id: 2, description: 'test Description 2'},
    { id: 3, name: 'testProject3', type_id: 3, description: 'test Description 3'}
];

let tasks = [
    { id: 0, name: 'task0', description: 'description 0', project_id: 0, user_id: 0, deadline: '2024-04-04' },
    { id: 1, name: 'task1', description: 'description 1', project_id: 0, user_id: 1, deadline: '2024-04-04' },
    { id: 2, name: 'task2', description: 'description 2', project_id: 1, user_id: 0, deadline: '2024-04-04' },
    { id: 3, name: 'task3', description: 'description 3', project_id: 1, user_id: 0, deadline: '2024-04-04' },
    { id: 4, name: 'task4', description: 'description 4', project_id: 2, user_id: 0, deadline: '2024-04-04' },
    { id: 5, name: 'task5', description: 'description 5', project_id: 2, user_id: 0, deadline: '2024-04-04' },
    { id: 6, name: 'task6', description: 'description 6', project_id: 3, user_id: 0, deadline: '2024-04-04' },
    { id: 7, name: 'task7', description: 'description 7', project_id: 3, user_id: 0, deadline: '2024-04-04' },
];

@Route('/projects')
export class ProjetsController extends Controller {
    @Tags('Projects')
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjects(): Promise<IResponse> {
        try {
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
                data: err
            };
        }
    }

    @Tags('Projects')
    @Get('/{projectId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectByID(@Path() projectId: number): Promise<IResponse> {
        let index = projects.findIndex(x => x.id == projectId);

        try {
            let project = projects[index];
            return {
                message: 'OK',
                status: '200',
                data: project
            };
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: {
                    err: err,
                    msg: 'Nincs projekt ezzel az ID-val!'
                }
            };
        }
    }

    @Tags('Projects')
    @Get('/{projectId}/tasks')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getTasksForProject(@Path() projectId: number): Promise<IResponse> {
        let index = projects.findIndex(x => x.id == projectId);

        try {
            let project = projects[index];
            let projectTasks = tasks.filter(x => x.project_id == project.id);

            return {
                message: 'OK',
                status: '200',
                data: projectTasks
            };
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: {
                    err: err,
                    msg: 'Nincs projekt ezzel az ID-val!'
                }
            };
        }
    }

    @Tags('Projects')
    @Post('/{projectId}/newTask')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async newTaskForProject(@Path() projectId: number, @Body() body: NewTask): Promise<IResponse> {
        let index = projects.findIndex(x => x.id == projectId);

        try {
            // Fejleszőhöz hozzákell majd rendelni az adatbázisban a feladatot (Majd a 2.beadandonál)
            let project = projects[index];
            let task = { id: Math.random() * 10, name: body.name, description: body.description, project_id: project.id, user_id: body.manager_id, deadline: '2024-04-04' };
            tasks.push(task);
            
            return {
                message: 'OK',
                status: '200',
                data: 'Feladat hozzáadva a projekthez!'
            };
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'Error',
                status: '400',
                data: err
            };
        }
    }
}