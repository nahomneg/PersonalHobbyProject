const express = require('express');
const router = express.Router();
const danceController = require('../controllers/danceController');
const eventController = require('../controllers/eventController');

router.route('/')
    .get(danceController.getAllDances)
    .post(danceController.addDance)


router.route('/:id')
    .get(danceController.getDanceById)
    .put(danceController.updateDance)
    .patch(danceController.patchDance)
    .delete(danceController.deleteDance);

router.route('/:id/events')
    .get(eventController.getAllEventsOfDance)
    .post(eventController.addEventToDance);

router.route('/:danceId/events/:eventId')
    .delete(eventController.deleteEventFromDance);

module.exports = router;