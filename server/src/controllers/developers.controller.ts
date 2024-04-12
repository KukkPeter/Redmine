import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewDeveloper } from '../interfaces/newDeveloper.interface';
const db = require('../models');

@Route('/developers')
@Tags('Developers')
export class DevelopersController extends Controller {
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDevelopers(): Promise<IResponse> {
        try {
            const developers = await db.developers.findAll();
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
                data: err.message
            };
        }
    }

    @Get('/{developerId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDeveloperById(@Path() developerId: number): Promise<IResponse> {
        try {
            const developer = await db.developers.findByPk(developerId);
            
            if(developer != null) {
                return {
                    message: 'OK',
                    status: '200',
                    data: developer
                };
            } else {
                throw new Error("Nincs fejlesztó ezzel az ID-val!");
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

    @Post('/new')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async addNewDeveloper(@Body() body: NewDeveloper): Promise<IResponse> {
        try {
            const developer = await db.developers.findOne({
                where: {
                    email: body.email
                }
            });

            if(developer === null) {
                const developer = await db.developers.create({
                    email: body.email,
                    name: body.name
                });

                return {
                    message: 'OK',
                    status: '200',
                    data: 'Fejlesztő hozzáadva!'
                };
            } else {
                throw new Error("Ezzel az email címmel már van fejlesztő!");
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