export = (sequelize: any, Sequelize: any) => {
    const Project_type = sequelize.define("project_types", {
        name:{
            type:Sequelize.STRING
        }
    });

    return Project_type;
};