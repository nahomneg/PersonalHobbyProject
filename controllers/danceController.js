const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Dance = mongoose.model(process.env.DANCE_MODEL_NAME);

const sendResponse = function (res, status, body){
    res.status(status).json(body);
}
const getAllDances = function (req, res) {
    let offset = 0;
    let count = 5;
    const maxCount = parseInt(process.env.MAX_COUNT);

    if (req.query && req.query.offset) {

        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }
    if (isNaN(count) || isNaN(offset)){
        sendResponse(res, process.env.STATUS_CODE_BAD_INPUT, {"error": "count and offset should"});
        return;
    }
    if (count > maxCount ){
        sendResponse(res, process.env.STATUS_CODE_BAD_INPUT, {"error": "count cannot be greater than 20"});
        return;
    }

    let query = {};
    if (req.query && req.query.lat && req.query.lon) {
        const lat = parseInt(req.query.lat);
        const lon = parseInt(req.query.lon);
        if (isNaN(lat) || isNaN(lon)){

            sendResponse(res, process.env.STATUS_CODE_BAD_INPUT, {"error": "both latitude and longitude should be valid"});
            return;
        }
        query = {
            'events.location': {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [lon, lat]
                    },
                    $maxDistance: 100000000
                }
            }
        }
    }
    Dance.find(query).skip(offset).limit(count).exec(function (err, dances) {
        if (err){
            console.log('error getting dances', err);
            sendResponse(res, process.env.STATUS_SERVER_ERR, {"error":"error getting dances"});
        }
        else{
            sendResponse(res, process.env.STATUS_CODE_OK, dances);
        }

    });

};

const getDanceById = function (req, res) {
    const danceId = req.params.id;
    const isValid = mongoose.Types.ObjectId.isValid(danceId);
    if (!isValid){
        sendResponse(res, process.env.STATUS_CODE_BAD_INPUT,{"error":"dance ID is not valid"});
        return;
    }
    const response = {status: process.env.STATUS_CODE_CREATED, body: null};
    Dance.findById(danceId).exec(function (err, dance) {
        if (err) {
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.body = err;
        }
        else if (!dance){
            response.status = process.env.STATUS_CODE_NOT_FOUND;
            response.body = {"error": "No dance found with this id"};
        }
        else {
            response.body = dance;
        }
        sendResponse(res,response.status,response.body)
    });
};

const addDance = function (req, res) {
    const newDance = {
        name: req.body.name,
        countryOfOrigin: req.body.countryOfOrigin,
        events: []
    }
    const salt = bcrypt.genSaltSync(10);
    newDance.name = bcrypt.hashSync(newDance.name, salt);


    Dance.create(newDance, function (err, dance) {
        const response = {status: process.env.STATUS_CODE_CREATED, message: dance};
        if (err) {
            console.log("Error creating dance", err);
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    });
};

const _partialUpdate = function (req, dance, res, response) {
    if (req.body.name)
        dance.name = req.body.name;
    if (req.body.countryOfOrigin)
        dance.countryOfOrigin = req.body.countryOfOrigin;
    saveDance(dance, res, response);
}

const _fullUpdate = function (req, dance, res, response) {
    dance.name = req.body.name;
    dance.countryOfOrigin = req.body.countryOfOrigin;
    saveDance(dance, res, response);
};

const saveDance = function (dance, res, response) {
    dance.save(function (err, updatedDance) {
        if (err) {
            response.status = parseInt(process.env.STATUS_CODE_BAD_INPUT);
            response.message = err;
        }


        res.status(response.status).json(response.message);
    });
}


const _update = function (req, res, updateCallback) {
    const danceId = req.params.id;
    Dance.findById(danceId).exec(function (err, dance) {
        const response = {status: parseInt(process.env.STATUS_CODE_OK), message: dance};
        if (err) {
            response.status = parseInt(process.env.STATUS_SERVER_ERR);
            response.message = err;
        } else if (!dance) {
            response.status = parseInt(process.env.STATUS_CODE_NOT_FOUND);
            response.message = "Dance ID not valid";
        }
        if (err || !dance) {
            res.status(response.status).json(response.message);
        } else {
            updateCallback(req, dance, res, response);
        }

    });
}

const updateDance = function (req, res) {
    _update(req, res, _fullUpdate);
};

const patchDance = function (req, res) {
    _update(req, res, _partialUpdate);

};

const deleteDance = function (req, res) {
    const danceId = req.params.id;
    Dance.findByIdAndDelete(danceId).exec(function (err, deletedDance) {
        const response = {status: 204, message: deletedDance};
        if (err) {
            console.log("Error finding dance");
            response.status = 500;
            response.message = err;

        } else if (!deletedDance) {
            console.log("Dance id not found");
            response.status = 404;
            response.message = {
                "message": "Dance ID not found"
            };
        }
        res.status(response.status).json(response.message);
    });
};

module.exports = {
    getAllDances,
    getDanceById,
    addDance,
    updateDance,
    deleteDance,
    patchDance
};