import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewTask } from '../interfaces/newTask.interface';

// Statikus adat
let projects = [
    { id: 0, name: 'testProject0', type_id: 0, description: 'test Description 0'},
    { id: 1, name: 'testProject1', type_id: 1, description: 'test Description 1'},
    { id: 2, name: 'testProject2', type_id: 2, description: 'test Description 2'},
    { id: 3, name: 'testProject3', type_id: 3, description: 'test Description 3'}
];

let tasks = [
    { id: 0, name: 'task0', description: 'description 0', project_id: 0, user_id: 0, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 0)) },
    { id: 1, name: 'task1', description: 'description 1', project_id: 0, user_id: 1, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 1)) },
    { id: 2, name: 'task2', description: 'description 2', project_id: 1, user_id: 0, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 2)) },
    { id: 3, name: 'task3', description: 'description 3', project_id: 1, user_id: 1, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 0)) },
    { id: 4, name: 'task4', description: 'description 4', project_id: 2, user_id: 2, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 4)) },
    { id: 5, name: 'task5', description: 'description 5', project_id: 2, user_id: 0, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 0)) },
    { id: 6, name: 'task6', description: 'description 6', project_id: 3, user_id: 2, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 8)) },
    { id: 7, name: 'task7', description: 'description 7', project_id: 3, user_id: 1, deadline: (Date.now() + (1000 * 60 * 60 * 24 * 0)) },
];

let project_developers = [
    { developer_id: 0, project_id: 0 }, 
    { developer_id: 1, project_id: 1 }, 
    { developer_id: 2, project_id: 2 }, 
    { developer_id: 3, project_id: 3 }
];

@Route('/projects')
@Tags('Projects')
export class ProjetsController extends Controller {
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

    @Get('/{projectId}/developers')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDevelopersForProject(@Path() projectId: number): Promise<IResponse> {
        try {
            let index = projects.findIndex(x => x.id == projectId);

            if(index != -1) {
                let project = projects[index];
                let prjctDevelopers = project_developers.filter(x => x.project_id == project.id);
    
                return {
                    message: 'OK',
                    status: '200',
                    data: prjctDevelopers
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
            let index = projects.findIndex(x => x.id == projectId);
            if(index != -1) {
                // Feladat hozzáadása
                let project = projects[index];
                let today = Date.now() + 1000 * 60 * 60 * 24 * 7; // +7 nap a határidő

                let task = { 
                    id: Math.floor(Math.random() * (100 - 10 + 1) + 10), // Random szám 10 és 100 között
                    name: body.name, 
                    description: body.description, 
                    project_id: project.id, 
                    user_id: body.manager_id, 
                    deadline: today
                };
                tasks.push(task);
                
                // Fejlesztő hozzáadása a projekthez
                if(project_developers.find(x => x.developer_id == body.developer_id && x.project_id == projectId) == undefined) {
                    project_developers.push({ developer_id: body.developer_id, project_id: projectId});
                }
                
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
}