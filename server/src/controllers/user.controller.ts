import { Route, Post, Body, Controller, SuccessResponse, Tags, OperationId, Response } from 'tsoa';
import { IResponse } from '../models/IResponse.interface';
import { LoginUser } from '../models/loginUser.interface';

@Route('/user')
export class UserController extends Controller {
    @Post('/login')
    @Tags('User')
    @Response<IResponse>('400', 'Bad Request')
    @SuccessResponse('200', 'OK')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        try {
            const user = {
                email: body.email,
                password: body.password
            };

            return {
                message: 'success',
                status: '200',
                data: user
            };
        } catch(err) {
            this.setStatus(400);

            return {
                message: 'fail',
                status: '400',
                data: err
            };
        }
    }
}