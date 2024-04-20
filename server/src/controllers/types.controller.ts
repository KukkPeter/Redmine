import { Route, Get, Path, Controller, SuccessResponse, Tags, Security, Delete, Post, Body } from 'tsoa';
import { IResponse } from '../interfaces/IResponse.interface';
import { NewType } from '../interfaces/newType.interface';
import TypesService from '../services/types.service';

@Route('/types')
@Tags('Types')
@SuccessResponse(200, 'OK')
export class TypesController extends Controller {
    /**
     * Visszaadja a rendszerben tárolt projekt típusokat.
     */
    @Get('/')
    @Security('jwt')
    public async getProjectTypes(): Promise<IResponse> {
        const types = await TypesService.getAll();

        return {
            status: 200,
            message: "OK",
            data: types
        };
    }

    /**
     * Visszaadja a megadott typeId alapján a rendszerben tárolt projekt típust, feltéve hogy létezik a megadott ID-val projekt típus.
     */
    @Get('/{typeId}')
    @Security('jwt')
    public async getProjectTypeById(@Path() typeId: number): Promise<IResponse> {
        const type = await TypesService.getById(typeId);

        return {
            status: 200,
            message: "OK",
            data: type
        };
    }

    /**
     * Új projekt típust ad hozzá a rendszerhez. Adminisztrátori jogosultság szükséges!
     */
    @Post('/new')
    @Security('jwt', ["admin"])
    public async newProjectType(@Body() body: NewType): Promise<IResponse> {
        const type = await TypesService.newType(body);

        return {
            status: 200,
            message: "Projekt típus felvéve!",
            data: type
        };
    }

    /**
     * Projekt típust töröl a rendszerből. Adminisztrátori jogosultság szükséges!
     */
    @Delete('/{typeId}')
    @Security('jwt', ["admin"])
    public async deleteTypeById(@Path() typeId: number): Promise<IResponse> {
        const type = await TypesService.deleteById(typeId);

        return {
            status: 200,
            message: "Projekt típus törölve!",
            data: type
        };
    }
}