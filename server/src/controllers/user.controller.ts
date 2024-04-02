import { Route, Post, Body, Controller, SuccessResponse, Tags, Response } from 'tsoa';
import { IResponse } from '../models/IResponse.interface';
import { LoginUser } from '../models/loginUser.interface';
import { RegisterUser } from '../models/registerUser.interface';

@Route('/user')
export class UserController extends Controller {
    @Tags('User')
    @Post('/login')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        try {
            const user = {
                email: body.email,
                password: body.password
            };

            return {
                message: 'OK',
                status: '200',
                data: user
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

    @Tags('User')
    @Post('/register')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async registerUser(@Body() body: RegisterUser): Promise<IResponse> {
        try {
            if(body.password == body.passwordAgain) {
                const user = {
                    email: body.email,
                    password: body.password
                };

                return {
                    message: 'OK',
                    status: '200',
                    data: user
                };
            } else throw Error('A jelszavak nem egyeznek!');
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