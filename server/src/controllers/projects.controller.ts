import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Security, Body, Delete } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewTask } from '../interfaces/newTask.interface';
import { NewProject } from '../interfaces/newProject.interface';
import ProjectsService from '../services/projects.service';

@Route('/projects')
@Tags('Projects')
@SuccessResponse(200, 'OK')
export class ProjetsController extends Controller {
    /**
     * Visszaadja a rendszerben tárolt projekteket.
     */
    @Get('/')
    @Security('jwt')
    public async getProjects(): Promise<IResponse> {
        const projects = await ProjectsService.getAll();

        return {
            status: 200,
            message: "OK",
            data: projects
        };
    }

    /**
     * Új projektet ad hozzá a rendszerhez. Adminisztrátori jogosultság szükséges!
     */
    @Post('/new')
    @Security('jwt', ["admin"])
    public async newProject(@Body() body: NewProject): Promise<IResponse> {
        const project = await ProjectsService.newProject(body);

        return {
            status: 200,
            message: "Projekt felvéve!",
            data: project
        };
    }

    /**
     * Visszaadja a megadott projectId alapján a rendszerben tárolt projektet, feltéve hogy létezik a megadott ID-val projekt.
     */
    @Get('/{projectId}')
    @Security('jwt')
    public async getProjectByID(@Path() projectId: number): Promise<IResponse> {
        const project = await ProjectsService.getById(projectId);

        return {
            status: 200,
            message: "OK",
            data: project
        };
    }

    /**
     * Projekt törlése a rendszerből. Adminisztrátori jogosultság szükséges!
     */
    @Delete('/{projectId}')
    @Security('jwt', ["admin"])
    public async deleteProjectByID(@Path() projectId: number): Promise<IResponse> {
        const project = await ProjectsService.deleteById(projectId);

        return {
            status: 200,
            message: "A projekt és a hozzátartozó feladatok törölve!",
            data: "A projekt és a hozzátartozó feladatok törölve!"
        };
    }

    /**
     * Visszaadja a megadott projectId alapján a rendszerben tárolt projekthez tartozó feladatokat, feltéve hogy létezik a megadott ID-val projekt.
     */
    @Get('/{projectId}/tasks')
    @Security('jwt')
    public async getTasksForProject(@Path() projectId: number): Promise<IResponse> {
        const tasks = await ProjectsService.getTasks(projectId);
        
        return {
            status: 200,
            message: "OK",
            data: tasks
        };
    }

    /**
     * Visszaadja a megadott projectId alapján a rendszerben tárolt projekthez tartozó fejlesztőket, feltéve hogy létezik a megadott ID-val projekt.
     */
    @Get('/{projectId}/developers')
    @Security('jwt')
    public async getDevelopersForProject(@Path() projectId: number): Promise<IResponse> {
        const developers = await ProjectsService.getDevelopers(projectId);

        return {
            status: 200,
            message: "OK",
            data: developers
        };
    }

    /**
     * A projectId alapján új feladatot ad hozzá a projekthez, feltéve hogy létezik projekt a projectId-ban megadott ID-val.
     */
    @Post('/{projectId}/newTask')
    @Security('jwt')
    public async newTaskForProject(@Path() projectId: number, @Body() body: NewTask): Promise<IResponse> {
        const task = await ProjectsService.newTask(projectId, body);

        return {
            status: 200,
            message: "Feladat és fejlesztő hozzáadva a projekthez!",
            data: task
        };
    } 

    /**
     * Feladat törlése a rendszerből. Adminisztrátori jogosultság szükséges!
     */
    @Delete('deleteTask/{taskId}')
    @Security('jwt', ["admin"]) 
    public async deleteTaskById(@Path() taskId: number): Promise<IResponse> {
        const response = await ProjectsService.deleteTask(taskId);

        return {
            status: 200,
            message: "Feladat törölve!",
            data: "Feladat törölve!"
        };
    }
}