import { Route, Get, Path, Controller, SuccessResponse, Tags, Response } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';

let types = [
    {id: 0, name: "Teszt Tipus 0"},
    {id: 1, name: "Teszt Tipus 1"},
    {id: 2, name: "Teszt Tipus 2"},
    {id: 3, name: "Teszt Tipus 3"},
];

@Route('/types')
@Tags('Types')
export class TypesController extends Controller {
    @Tags('Projects')
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypes(): Promise<IResponse> {
        try {
            return {
                message: 'OK',
                status: '200',
                data: types
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
    @Get('/{typeId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypeById(@Path() typeId: number): Promise<IResponse> {
        try {
            let index = types.findIndex(x => x.id == typeId);
            if(index != -1) {
                let project_type = types[index];
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