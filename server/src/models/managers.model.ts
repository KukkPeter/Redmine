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
        },
        roles: {
            type:Sequelize.STRING,
            defaultValue: "manager"
        }
    });

    return Manager;
};