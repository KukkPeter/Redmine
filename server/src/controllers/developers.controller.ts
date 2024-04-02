import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { IResponse } from '../models/IResponse.interface';
import { ProjectDevelopers } from '../models/projectDevelopers.interface';

const developers = [
    { id: 0, name: 'dev0', email: '0@dev.com' },
    { id: 1, name: 'dev1', email: '1@dev.com' },
    { id: 2, name: 'dev2', email: '2@dev.com' }
];

@Route('/developers')
export class DevelopersController extends Controller {
    @Tags('Developers')
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDevelopers(): Promise<IResponse> {
        try {
            return {
                message: 'OK',
                status: '200',
                data: developers
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

    @Tags('Developers')
    @Post('/addToProject')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async addToProject(@Body() body: ProjectDevelopers): Promise<IResponse> {
        try {
            // Business logic majd ide kerül ha lesz adatbázis
            // TODO: Fejlesztó hozzáadása a project_developers táblába projekt_id-val
            return {
                message: 'OK',
                status: '200',
                data: 'Hozzáadva!'
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