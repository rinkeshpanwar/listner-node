// create a express server for serving html files
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 4000;
const convertor = require('./route/convertor');
const server = require('http').createServer(app);
const ws = require('ws');
const { validateWebsocketJSON, createRoomValidation, joinRoomValidation, sendMessageValidation } = require('./utils/validation');
const { createRoom, joinRoom, exitRoom, sendMessageToOther } = require('./utils/room');


// create a websocket server
const wss = new ws.Server({ server });
// ping ponf for checking connection

wss.on('connection', (ws) => {
    ws.on('close', () => {
        exitRoom(ws.roomId, ws);
    });
    ws.on('message', (message) => {
        if (validateWebsocketJSON(message)) {
            const data = JSON.parse(message);

            switch (data.meta) {
                case 'create':
                    // create room
                    if (createRoomValidation(data)) {
                        const isRoomCreated = createRoom(data.roomId, ws);
                        if (isRoomCreated) {
                            ws.send(JSON.stringify({
                                message: "Room created",
                                err: false
                            }));
                        } else {
                            ws.send(JSON.stringify({
                                message: "Room already exists",
                                err: true
                            }));
                        }
                    } else {
                        ws.send(JSON.stringify({
                            message: "Invalid data",
                            err: true
                        }));
                    }
                    break;
                case 'join':
                    if (joinRoomValidation(data)) {
                        const isRoomJoined = joinRoom(data.roomId, ws);
                        if (isRoomJoined) {
                            ws.send(JSON.stringify({
                                message: "Room joined",
                                err: false
                            }));
                        } else {
                            ws.send(JSON.stringify({
                                message: "Room does not exists",
                                err: true
                            }));
                        }
                    } else  {
                        ws.send(JSON.stringify({
                            message: "Invalid data",
                            err: true
                        }));
                    }
                    break;
                case 'message':
                    if (sendMessageValidation(data)) {
                        sendMessageToOther(ws, data.message);
                    } else {
                        ws.send(JSON.stringify({
                            message: "Invalid data",
                            err: true
                        }));
                    }
                default:
                    break;
            }
        } else {
            ws.send(JSON.stringify({
                message: "invalid json",
                err: true
            }));
        }
    });
});

// serve static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set express cors for all domain
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/", (req, res) => {
    res.status(200).send("Backend working");
})

app.use("/convert", convertor);


// start server
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
})