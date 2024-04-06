import { Route, Get, Post, Path, Controller, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewDeveloper } from '../interfaces/newDeveloper.interface';

const developers = [
    { id: 0, name: 'dev 0', email: '0@dev.com' },
    { id: 1, name: 'dev 1', email: '1@dev.com' },
    { id: 2, name: 'dev 2', email: '2@dev.com' },
    { id: 3, name: 'dev 3', email: '3@dev.com' }
];

@Route('/developers')
@Tags('Developers')
export class DevelopersController extends Controller {
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
                data: err.message
            };
        }
    }

    @Get('/{developerId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getDeveloperById(@Path() developerId: number): Promise<IResponse> {
        try {
            let index = developers.findIndex(x => x.id == developerId);
            
            if(index != -1) {
                let developer = developers[index];

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
            if(developers.find(x => x.email == body.email) == undefined) {
                developers.push({
                    id: Math.floor(Math.random() * (100 - 10 + 1) + 10), // Random szám 10 és 100 között
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