const meetController = require('../controller/meet');

const router = require('express').Router();

router.get('/:roomId', meetController.getMeet);

router.get('/checkRoomIdAvailability/:roomId', meetController.checkRoomIdAvailability);
module.exports = router;