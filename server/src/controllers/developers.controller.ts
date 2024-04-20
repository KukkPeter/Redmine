import { Route, Get, Post, Delete, Path, Controller, SuccessResponse, Tags, Body, Security } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewDeveloper } from '../interfaces/newDeveloper.interface';
import DevelopersService from '../services/developers.service';

@Route('/developers')
@Tags('Developers')
@SuccessResponse(200, 'OK')
export class DevelopersController extends Controller {
    /**
     * Visszaadja a rendszerben tárolt fejlesztőket.
     */
    @Get('/')
    @Security('jwt')
    public async getDevelopers(): Promise<IResponse> {
        const developers = await DevelopersService.getAll();

        return {
            status: 200,
            message: "OK",
            data: developers
        };
    }

    /**
     * Visszaadja a megadott developerId alapján a rendszerben tárolt fejlesztőt, feltéve hogy létezik a megadott ID-val fejlesztő.
     */
    @Get('/{developerId}')
    @Security('jwt')
    public async getDeveloperById(@Path() developerId: number): Promise<IResponse> {
        const developer = await DevelopersService.getById(developerId);

        return {
            status: 200,
            message: "OK",
            data: developer
        };
    }

    /**
     * Új fejlesztőt ad hozzá a rendszerhez. Adminisztrátori jogosultság szükséges!
     */
    @Post('/new')
    @Security('jwt', ["admin"])
    public async addNewDeveloper(@Body() body: NewDeveloper): Promise<IResponse> {
        const developer = await DevelopersService.addNew(body);

        return {
            status: 200,
            message: "Fejlesztő sikeresen hozzáadva!",
            data: developer
        };
    }

    /**
     * Fejlesztőt töröl a rendszerből. Adminisztrátori jogosultság szükséges!
     */
    @Delete('/{developerId}')
    @Security('jwt', ["admin"])
    public async deleteDeveloperById(@Path() developerId: number): Promise<IResponse> {
        const response = await DevelopersService.deleteById(developerId);

        return {
            status: 200,
            message: "Fejlesztő törölve!",
            data: response
        };
    }

}