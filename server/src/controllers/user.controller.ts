import { Route, Post, Body, Controller, SuccessResponse, Tags, Response } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';

// Statikus adat
let users = [
    { id: 0, name: "Teszt Elek", email: "teszt@elek.hu", password: "tesztelek0"},
    { id: 1, name: "Teszt Tamás", email: "teszt@tamas.hu", password: "teszttamas1"},
    { id: 2, name: "Teszt Béla", email: "teszt@bela.hu", password: "tesztbela2"}
];

@Route('/user')
export class UserController extends Controller {
    @Tags('User')
    @Post('/login')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        try {
            let user = users.find(x => x.email == body.email);

            if(user) {
                if(user.password == body.password) {
                    return {
                        message: 'OK',
                        status: '200',
                        data: user
                    }
                } else {
                    throw new Error('Hibás jelszó!');
                }
            } else {
                throw new Error('Nincs regisztrált felhasználó ezzel az email címmel!');
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

    @Tags('User')
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

    @Tags('User')
    @Post('/register')
    @SuccessResponse('200', 'OK')
    @Response<IResponse>('400', 'Bad Request')
    public async registerUser(@Body() body: RegisterUser): Promise<IResponse> {
        try {
            if(users.find(x => x.email == body.email) == undefined) {
                if(body.password == body.passwordAgain) {
                    let user = {
                        id: users[users.length - 1].id + 1,
                        name: body.name,
                        email: body.email,
                        password: body.password
                    }

                    return {
                        message: 'OK',
                        status: '200',
                        data: user
                    }
                } else {
                    throw new Error("A megadott jelszavak nem egyeznek!")
                }
            } else {
                throw new Error("Ez az email cím már regisztrálva van!");
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