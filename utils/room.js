const {rooms} = require('./constant');

function notifyOtherRoomMembers(roomId, ws, message) {
    rooms[roomId].forEach((client) => {
        if (client !== ws) {
            client.send(message);
        }
    });
}

function createRoom(roomId, ws, peerId) {
    if (rooms[roomId]) {
        return false;
    }
    rooms[roomId] = [];
    ws['roomId'] = roomId;
    ws['peerId'] = peerId;
    rooms[roomId].push(ws);
    return true;
}

function joinRoom(roomId, ws, peerId) {
    if (!rooms[roomId]) {
        return false;
    }
    ws['roomId'] = roomId;
    ws['peerId'] = peerId;
    rooms[roomId].push(ws);
    notifyOtherRoomMembers(roomId, ws, JSON.stringify({
        message: "New member joined",
        err: false,
        peerId,
        meta:"join"
    }));
    return true;
}

function deleteEmptyRooms() {
    for (const roomId in rooms) {
        if (rooms[roomId].length === 0) {
            delete rooms[roomId];
        }
    }
}

function exitRoom(roomId, ws) {
    if (!rooms[roomId]) {
        return false;
    }
    notifyOtherRoomMembers(roomId, ws, JSON.stringify({
        message: "Member left",
        err: false,
        peerId: ws['peerId'],
        meta:"exit"
    }));
    rooms[roomId] = rooms[roomId].filter((client) => client !== ws);
    deleteEmptyRooms();
    return true;
}

function sendMessageToOther(ws, message) {
    const roomId = ws['roomId'];
    notifyOtherRoomMembers(roomId, ws, JSON.stringify({
        message,
        err: false
    }));
}

function getOtherRoomMembers(roomId, ws) {
    const ws_client = rooms[roomId].filter((client) => client !== ws);
    return ws_client.map((client) => client['peerId']);
}
module.exports = {
    createRoom,
    joinRoom,
    exitRoom,
    sendMessageToOther,
    getOtherRoomMembers
};