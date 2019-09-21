import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as WebSocket from 'ws';
import * as bodyParser from 'body-parser';


import * as RouterService from './services/RouterService';

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.use('/', express.static(path.join(__dirname,'ui')));
app.use('/', express.static(path.join(__dirname,'public')));

RouterService.addRoutes(app, router);

const server: any = http.createServer(app);

// Need to check if websocket is required or not
// const wss = new WebSocket.Server({ server });

// wss.on('connection', (connection: WebSocket) => {

//     //connection is up, let's add a simple simple event
//     connection.on('message', (message: string) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         connection.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection    
//     connection.send('Hi there, I am a WebSocket server');
// });

server.listen(process.env.PORT || 8000, () => {
    console.log(`Server started on port http://localhost:${server.address().port} `);
});