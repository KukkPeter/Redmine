export = (sequelize: any, Sequelize: any) => {
    const Project = sequelize.define("projects", {
        name:{
            type:Sequelize.STRING
        },
        type_id:{
            type:Sequelize.INTEGER
        },
        description:{
            type:Sequelize.STRING
        }
    });

    return Project;
};