const mongoose = require('mongoose');
const Dance = mongoose.model(process.env.DANCE_MODEL_NAME);


const getAllDances = function (req, res) {
    let offset = 0;
    let count = 5;
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        offset = parseInt(req.query.count, 10);
    }
    Dance.find().skip(offset).limit(count).exec(function (err, dances) {
        console.log("Found dances", dances.length);
        res.json(dances);
    });
}
const getDanceById = function (req, res) {
    const danceId = req.params.id;
    const response = {status: process.env.STATUS_CODE_CREATED, message: null};
    Dance.findById(danceId).exec(function (err, dance) {
        if (err) {
            response.status = 404
            response.message = err;
        } else {
            response.message = dance;
        }
        res.status(response.status).json(response.message);
    });


}

const addDance = function (req, res) {
    const newDance = {
        name: req.body.name,
        countryOfOrigin: req.body.countryOfOrigin,
        events: []
    }
    Dance.create(newDance, function (err, dance) {
        const response = {status: process.env.STATUS_CODE_CREATED, message: dance};
        if (err) {
            console.log("Error creating dance");
            response.status = 500;
            response.message = err;
        }
        res.status(response.status).json(response.message);
    });
}
const patchDance = function (req, res) {
    const danceId = req.params.id;
    Dance.findById(danceId).exec(function (err, dance) {
        const response = {status: parseInt(process.env.STATUS_CODE_OK), message: dance};
        if (err) {
            response.status = parseInt(process.env.STATUS_SERVER_ERR);
            response.message = err;
        }
        else if (!dance) {
            response.status = parseInt(process.env.STATUS_CODE_NOT_FOUND);
            response.message = "Dance ID not valid";
        }
        if (err || !dance ) {
            res.status(response.status).json(response.message);
        }
        else {
            if(req.body.name)
                dance.name = req.body.name;
            if(req.body.countryOfOrigin)
                dance.countryOfOrigin = req.body.countryOfOrigin;

            dance.save(function (err, updatedDance) {
                if(err){
                    response.status = parseInt(process.env.STATUS_CODE_BAD_INPUT);
                    response.message = err;
                }


                res.status(response.status).json(response.message);
            });
        }

    });
}

const updateDance = function (req, res) {
    const danceId = req.params.id;
    Dance.findById(danceId).exec(function (err, dance) {
        const response = {status: parseInt(process.env.STATUS_CODE_OK), message: dance};
        if (err) {
            response.status = parseInt(process.env.STATUS_SERVER_ERR);
            response.message = err;
        }
        else if (!dance) {
            response.status = parseInt(process.env.STATUS_CODE_NOT_FOUND);
            response.message = "Dance ID not valid";
        }
        if (err || !dance ) {
            res.status(response.status).json(response.message);
        }
        else {
            dance.name = req.body.name;
            dance.countryOfOrigin = req.body.countryOfOrigin;
            dance.save(function (err, updatedDance) {
                if(err){
                    response.status = parseInt(process.env.STATUS_CODE_BAD_INPUT);
                    response.message = err;
                }


                res.status(response.status).json(response.message);
            });
        }

    });
}

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
}

module.exports = {
    getAllDances,
    getDanceById,
    addDance,
    updateDance,
    deleteDance,
    patchDance
};