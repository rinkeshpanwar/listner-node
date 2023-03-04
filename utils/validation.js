const allowedMeta = new Set(['create', 'join', 'exit', 'message']);

function validateWebsocketJSON(message) {
    try {
        const data = JSON.parse(message);
        // check if room is present or not
        if (data.meta && allowedMeta.has(data.meta)) {
            return true;
        } else {
            return false;
        }
    }
    catch (e) {
        return false;
    }
}

function createRoomValidation(data) {
    try {
        if (data.meta === 'create' && data.roomId) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function joinRoomValidation(data) {
    try {
        if (data.meta === 'join' && data.roomId) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

function sendMessageValidation(data) {
    try {
        if (data.meta === 'message' && data.message) {
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}

module.exports = {
    validateWebsocketJSON,
    createRoomValidation,
    joinRoomValidation,
    sendMessageValidation
};