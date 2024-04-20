import { Request, Security, Route, Get, Post, Body, Controller, SuccessResponse, Tags, Path } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';
import UserService from '../services/user.service';

@Route('/user')
@Tags('User')
@SuccessResponse(200, "OK")
export class UserController extends Controller {
    /**
     * Bejelentkezés során megkell adni egy email címet ami regisztrálva van a rendszerben és egy hozzá tartozó jelszót.
     */
    @Post('/login')
    public async loginUser(@Body() body: LoginUser): Promise<IResponse> {
        const token = await UserService.login(body);
        return {
            status: 200,
            message: "Sikeres bejelentkezés!",
            data: token
        };
    }

    /**
     * Regisztráció során megkell adni egy email címet ami még nincs regisztrálva a rendszerben, egy nevet illetve egy jelszót és a hozzá tartozó jelszó megerősítőt.
     */
    @Post('/register')
    public async registerUser(@Body() body: RegisterUser): Promise<IResponse> {
        const manager = await UserService.register(body);

        return {
            status: 200,
            message: "Sikeres regisztráció! Mostmár betudsz jelentkezni.",
            data: manager
        }
    }

    /**
     * Kijelentkezés a rendszerből.
     */
    @Post('/logout')
    @Security('jwt')
    public async logoutUser(): Promise<IResponse> {
        return {
            status: 200,
            message: 'OK',
            data: 'Sikeres kijelentkezés!'
        };
    }

    /**
     * A headerben megadott JsonWebToken-ből vissza adja a felhasználót.
     */
    @Get('/myself')
    @Security('jwt')
    public async getMyself(@Request() request: any): Promise<IResponse> {
        const user = await UserService.getUserFromToken(request.user);

        return {
            status: 200,
            message: "OK",
            data: user
        };
    }

    /**
     * A megadott userId alapján kikeresi a rendszerben tárolt felhasználót, feltéve hogy létezik ilyen ID-val felhasználó.
     */
    @Get('/{userId}')
    @Security('jwt')
    public async getUserById(@Path() userId: number): Promise<IResponse> {
        const userById = await UserService.getById(userId);
        return {
            status: 200,
            message: "OK",
            data: userById
        }
    }
}