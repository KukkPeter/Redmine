import { Route, Get, Path, Controller, SuccessResponse, Tags, Response } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
const db = require('../models');

@Route('/types')
@Tags('Types')
export class TypesController extends Controller {
    @Get('/')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypes(): Promise<IResponse> {
        try {
            const types = await db.project_types.findAll();
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

    @Get('/{typeId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getProjectTypeById(@Path() typeId: number): Promise<IResponse> {
        try {
            const type = await db.project_types.findByPk(typeId);

            if(type != null) {
                return {
                    message: 'OK',
                    status: '200',
                    data: type
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