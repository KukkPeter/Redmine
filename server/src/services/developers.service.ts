import { FieldErrors, ValidateError } from "tsoa";
import { NewDeveloper } from "../interfaces/newDeveloper.interface";

const db = require('../models').developers;

class DevelopersService {
    constructor() {}

    async getAll(): Promise<any> {
        try {
            const developers = await db.findAll();

            return developers;
        } catch(err) {
            throw new Error(`Ismeretlen hiba történt.\n${err}`);
        }
    }

    async getById(id: number): Promise<any> {
        try {
            const developer = await db.findByPk(id);
            
            if(developer != null) {
                return developer;
            } else {
                throw new Error("Nincs fejlesztó ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "DevelopersService:getById");
        }
    }

    async addNew(body: NewDeveloper): Promise<any> {
        try {
            const developer = await db.findOne({
                where: {
                    email: body.email
                }
            });

            if(developer === null) {
                const developer = await db.create({
                    email: body.email,
                    name: body.name
                });

                return developer;
            } else {
                throw new Error("Ezzel az email címmel már van fejlesztő!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "DevelopersService:addNew");
        }
    }

    async deleteById(id: number): Promise<any> {
        try {
            const developer = await db.findByPk(id);

            if(developer != null) {
                await db.destroy({
                    where: {
                      id: developer.id,
                    },
                });
                return "Fejlesztő törölve!";
            } else {
                throw new Error("Nincs fejlesztó ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "DevelopersService:deleteById");
        }
    }
}

export default new DevelopersService();