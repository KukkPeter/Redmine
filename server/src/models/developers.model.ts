export = (sequelize: any, Sequelize: any) => {
    const Developer = sequelize.define("developers", {
        name:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        }
    });

    return Developer;
};