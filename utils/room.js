const {rooms} = require('./constant');

function notifyOtherRoomMembers(roomId, ws, message) {
    rooms[roomId].forEach((client) => {
        if (client !== ws) {
            client.send(message);
        }
    });
}

function createRoom(roomId, ws) {
    if (rooms[roomId]) {
        return false;
    }
    rooms[roomId] = [];
    rooms[roomId].push(ws);
    ws['roomId'] = roomId;
    return true;
}

function joinRoom(roomId, ws) {
    if (!rooms[roomId]) {
        return false;
    }
    rooms[roomId].push(ws);
    ws['roomId'] = roomId;
    notifyOtherRoomMembers(roomId, ws, JSON.stringify({
        message: "New member joined",
        err: false
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
        err: false
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

module.exports = {
    createRoom,
    joinRoom,
    exitRoom,
    sendMessageToOther
};