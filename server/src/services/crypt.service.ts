import * as bcrypt from 'bcrypt';

export const Crypt = {
    encrypt: (password: string) => {
        return bcrypt.genSalt(10)
            .then((salt => bcrypt.hash(password, salt)))
            .then(hash => hash);
    },
    compare: (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword).then(resp => resp);
    }
};