import { describe } from "node:test";

export = (sequelize: any, Sequelize: any) => {
    const Task = sequelize.define("tasks", {
        name:{
            type:Sequelize.STRING
        },
        description:{
            type:Sequelize.STRING
        },
        project_id:{
            type:Sequelize.INTEGER
        },
        user_id:{
            type:Sequelize.INTEGER
        },
        deadline:{
            type:Sequelize.STRING
        }
    });

    return Task;
};