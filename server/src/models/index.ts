import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    "Team_3_Redmine",       // Adatbázis neve
    "root",                 // Felhasználó név
    "",                     // Jelszó az adatbázishoz
    {
        host: "localhost",  // Adatbázis elérési útja
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    managers: require('./managers.model')(sequelize, Sequelize),
    developers: require('./developers.model')(sequelize, Sequelize),
    projects: require('./projects.model')(sequelize, Sequelize),
    project_types: require('./project_types.models')(sequelize, Sequelize),
    tasks: require('./tasks.model')(sequelize, Sequelize)
};

db.managers.hasMany(db.tasks, {
    sourceKey: 'id',
    foreignKey: 'user_id',
    onDelete: 'cascade', 
    hooks: true
});
db.tasks.belongsTo(db.managers, { 
    foreignKey: 'user_id' 
});

db.projects.hasMany(db.tasks, {
    sourceKey: 'id',
    foreignKey: 'project_id',
    onDelete: 'cascade',
    hooks: true
});
db.tasks.belongsTo(db.projects, {
    foreignKey: 'project_id'
});

db.project_types.hasMany(db.projects, {
    sourceKey: 'id',
    foreignKey: 'type_id',
    onDelete: 'cascade',
    hooks: true
});
db.projects.belongsTo(db.project_types, {
    foreignKey: 'type_id'
});

db.developers.belongsToMany(db.projects, { 
    through: 'project_developers'
});
db.projects.belongsToMany(db.developers, {
    through: 'project_developers'
});

export = db;