const express = require('express');
const router = express.Router();
const danceController = require('../controllers/danceController');
const eventController = require('../controllers/eventController');
const usersController = require('../controllers/userController');
const multer  = require('multer');
const {checkAuth} = require("../controllers/userController");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const fileUploader = multer({ storage: storage });

router.route('/')
    .get(usersController.checkAuth, danceController.getAllDances)
    .post(fileUploader.single('image'),danceController.upload, danceController.addDance)


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