import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body, Query } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewTask } from '../interfaces/newTask.interface';

// Statikus adat
let projects = [
    { id: 0, name: 'testProject0', type_id: 0, description: 'test Description 0'},
    { id: 1, name: 'testProject1', type_id: 1, description: 'test Description 1'},
    { id: 2, name: 'testProject2', type_id: 2, description: 'test Description 2'},
    { id: 3, name: 'testProject3', type_id: 3, description: 'test Description 3'}
];

let project_types = [
    {id: 0, name: "Teszt Tipus 0"},
    {id: 1, name: "Teszt Tipus 1"},
    {id: 2, name: "Teszt Tipus 2"},
    {id: 3, name: "Teszt Tipus 3"},
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
                data: err.message
            };
        }
    }

    @Tags('Projects')
    @Get('/{projectId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectByID(@Path() projectId: number): Promise<IResponse> {
        try {
            let index = projects.findIndex(x => x.id == projectId);
            if(index != -1) {
                let project = projects[index];
                return {
                    message: 'OK',
                    status: '200',
                    data: project
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

    @Tags('Projects')
    @Get('/{projectId}/tasks')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getTasksForProject(@Path() projectId: number): Promise<IResponse> {
        try {
            let index = projects.findIndex(x => x.id == projectId);

            if(index != -1) {
                let project = projects[index];
                let projectTasks = tasks.filter(x => x.project_id == project.id);
    
                return {
                    message: 'OK',
                    status: '200',
                    data: projectTasks
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

    @Tags('Projects')
    @Post('/{projectId}/newTask')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async newTaskForProject(@Path() projectId: number, @Body() body: NewTask): Promise<IResponse> {
        try {
            let index = projects.findIndex(x => x.id == projectId);
            if(index != -1) {
                // Fejlesztőhöz hozzákell majd rendelni az adatbázisban a feladatot (Majd a 2.beadandonál)
                let project = projects[index];
                let task = { 
                    id: Math.floor(Math.random() * (100 - 10 + 1) + 10), // Random szám 10 és 100 között
                    name: body.name, 
                    description: body.description, 
                    project_id: project.id, 
                    user_id: body.manager_id, 
                    deadline: '2024-04-04' 
                };
                tasks.push(task);
                
                return {
                    message: 'OK',
                    status: '200',
                    data: 'Feladat hozzáadva a projekthez!'
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

    @Tags('Projects')
    @Get('/types')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypes(): Promise<IResponse> {
        try {
            return {
                message: 'OK',
                status: '200',
                data: project_types
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

    @Tags('Projects')
    @Get('/types/{typeId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypeById(@Path() typeId: number): Promise<IResponse> {
        try {
            let index = project_types.findIndex(x => x.id == typeId);
            if(index != -1) {
                let project_type = project_types[index];
                return {
                    message: 'OK',
                    status: '200',
                    data: project_type
                };
            } else {
                throw new Error("Nincs projekt típus ezzel az ID-val!");
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