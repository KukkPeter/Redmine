export = (sequelize: any, Sequelize: any) => {
    const Manager = sequelize.define("managers", {
        name:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        }
    });

    return Manager;
};