import { Route, Get, Post, Body, Controller, SuccessResponse, Tags, Response, Path } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';
const db = require('../models');

// Statikus adat
let userss = [
    { id: 0, name: "Teszt Elek", email: "teszt@elek.hu", password: "tesztelek0"},
    { id: 1, name: "Teszt Tamás", email: "teszt@tamas.hu", password: "teszttamas1"},
    { id: 2, name: "Teszt Béla", email: "teszt@bela.hu", password: "tesztbela2"}
];

@Route('/user')
@Tags('User')
export class UserController extends Controller {
    @Post('/login')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        try {
            const manager = await db.managers.findOne({
                where: {
                    email: body.email
                }
            });

            if(manager === null) {
                throw new Error('Nincs regisztrált felhasználó ezzel az email címmel!');
            } else {
                if(manager.password == body.password) {
                    return {
                        message: 'OK',
                        status: '200',
                        data: manager
                    };
                } else {
                    throw new Error('Hibás jelszó!');
                }
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

    @Post('/logout')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async logoutUser(): Promise<IResponse> {
        try {
            return {
                message: 'OK',
                status: '200',
                data: 'Kijelentkezve'
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

    @Get('/{userId}')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async getUserById(@Path() userId: number): Promise<IResponse> {
        try {
            const manager = await db.managers.findByPk(userId);

            if(manager != null) {                
                return {
                    message: 'OK',
                    status: '200',
                    data: manager
                };
            } else {
                throw new Error("Nincs felhasználó ezzel az ID-val!");
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

    @Post('/register')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async registerUser(@Body() body: RegisterUser): Promise<IResponse> {
        try {
            const manager = await db.managers.findOne({
                where: {
                    email: body.email
                }
            });

            if(manager != null) {
                throw new Error("Ez az email cím már regisztrálva van!");
            } else {
                if(body.password == body.passwordAgain) {
                    const user = await db.managers.create({
                        name: body.name,
                        email: body.email,
                        password: body.password
                    });

                    return {
                        message: 'OK',
                        status: '200',
                        data: user
                    }
                } else {
                    throw new Error("A megadott jelszavak nem egyeznek!");
                }
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