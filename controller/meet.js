const meetController = {};
const { isEmpty } = require('lodash');
const {rooms} = require('../utils/constant');

meetController.getMeet = (req, res) => {
    try {
        console.log(req.params);
        const { roomId } = req.params;
        if (isEmpty(rooms[roomId])) {
            return res.status(404).json({error: true, message: 'Room does not exists'});
        }
        res.status(200).json({error: false, message: 'Room exists'});
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
}

meetController.checkRoomIdAvailability = (req, res) => {
    try {
        const { roomId } = req.params;
        if (isEmpty(rooms[roomId])) {
            return res.status(200).json({error: false, message: 'Room is available'});
        }
        res.status(302).json({error: true, message: 'Room is not available'});
    } catch (error) {
        res.status(500).json({error: 'Internal server error'});
    }
}
module.exports = meetController;