import { FieldErrors, ValidateError } from "tsoa";
import { NewType } from "../interfaces/newType.interface";

const db = require('../models').project_types;

class TypesService {
    constructor() {}

    async getAll(): Promise<any> {
        try {
            const types = await db.findAll();

            return types;
        } catch(err) {
            throw new Error(`Ismeretlen hiba történt.\n${err}`);
        }
    }

    async getById(id: number): Promise<any> {
        try {
            const type = await db.findByPk(id);

            if(type != null) {
                return type;
            } else {
                throw new Error("Nincs projekt típus ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TypesService:getById");
        }
    }

    async newType(body: NewType): Promise<any> {
        try {
            const type = await db.findOne({
                where: {
                    name: body.name
                }
            });

            if(type != null) {
                throw new Error("Már létezik ilyen nevű projekt típus!");
            } else {
                const newType = await db.create({
                    name: body.name
                });

                return newType;
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TypesService:newType");
        }
    }

    async deleteById(id: number): Promise<any> {
        try {
            const type = await db.findByPk(id);

            if(type != null) {
                await db.destroy({
                    where: {
                      id: type.id,
                    },
                });
                return "Projekt típus törölve!";
            } else {
                throw new Error("Nincs típus ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "TypesService:deleteById");
        }
    }
}

export default new TypesService();