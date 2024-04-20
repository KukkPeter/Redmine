import * as jwt from "jsonwebtoken";
import { FieldErrors, ValidateError } from "tsoa";
import { Crypt } from './crypt.service';
import { LoginUser } from '../interfaces/loginUser.interface';
import { RegisterUser } from '../interfaces/registerUser.interface';

const db = require('../models').managers;

class UserService {
    constructor() {}

    async login(body: LoginUser): Promise<any> {
        try {
            const manager = await db.findOne({
                where: {
                    email: body.email
                }
            });
            if(manager === null) {
                throw new Error('Nincs regisztrált felhasználó ezzel az email címmel!');
            } else {
                if(await Crypt.compare(body.password, manager.password)) {
                    const token = this.generateToken(manager);

                   return token;
                } else {
                    throw new Error('Hibás jelszó!');
                }
            }
        } catch(err: unknown) {
            throw new ValidateError(err as FieldErrors, "ManagerService:login");
        }
    }

    async register(body: RegisterUser): Promise<any> {
        try {
            const manager = await db.findOne({
                where: {
                    email: body.email
                }
            });

            if(manager != null) {
                throw new Error("Ez az email cím már regisztrálva van!");
            } else {
                if(body.password == body.passwordAgain) {
                    let encryptedPwd = await Crypt.encrypt(body.password);

                    const user = await db.create({
                        name: body.name,
                        email: body.email,
                        password: encryptedPwd
                    });

                    return user;
                } else {
                    throw new Error("A megadott jelszavak nem egyeznek!");
                }
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ManagerService:register");
        }
    }

    async getUserFromToken(user: any): Promise<any> {
        try {
            const manager = await db.findByPk(user.id);
            
            if(manager != null) {
                manager.roles = manager.roles.split('|');
                
                return manager;
            } else {
                throw new Error("A bejelentkezett felhasználó nem létezik!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ManagerService:getUserFromToken");
        }
    }

    async getById(id: number): Promise<any> {
        try {
            const manager = await db.findByPk(id);

            if(manager != null) {
                manager.roles = manager.roles.split('|');
                
                return manager;
            } else {
                throw new Error("Nincs felhasználó ezzel az ID-val!");
            }
        } catch(err) {
            throw new ValidateError(err as FieldErrors, "ManagerService:getById");
        }
    }

    generateToken(user: any): string {
        const payload = { 
            id: user.id, 
            email: user.email, 
            roles: user.roles.split('|') 
        };

        return jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });
    }
}

export default new UserService();