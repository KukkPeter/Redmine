import * as dotenv from 'dotenv';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import * as db from './models/index';
import { RegisterRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { Server } from 'socket.io';
import { RegisterSocketEndpoints } from './socket';

db.sequelize.sync().then(() => {
    console.log('Database synced.');
});

dotenv.config();
const corsOptions = {
    origin: (origin: any, callback: any) => {
        if(process.env.CORS_WHITELIST && process.env.CORS_WHITELIST.indexOf(origin) !== -1) callback(null, true);
        else callback('Not allowed by CORS');
    },
    allowedHeaders: ['Content-Type', 'Bearer', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], 
    optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
let http = require('http').Server(app);

RegisterRoutes(app);

app.use(errorHandler);

try {
    const swaggerDocument = require('../swagger.json');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch(err) {
    console.log('Unable to load swagger.json', err);
}

const io = new Server(http, {cors: corsOptions });
RegisterSocketEndpoints(io);

const port = process.env.API_PORT || 8000;
http.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
});

export = app;