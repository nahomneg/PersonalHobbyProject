const mongoose = require('mongoose');
const Dance = mongoose.model(process.env.DANCE_MODEL_NAME);

const getAllEventsOfDance = function (req, res){
    const danceId = req.params.danceId;
    const response={};
    Dance.findById(danceId).select('events').exec(function (err,dances){
        if(err){
            response.body = err;
            response.status = process.env.EVENT_SUBDOCUMENT;
        }
        else{
            response.body = dances;
            response.status = process.env.STATUS_CODE_OK;
        }
        res.status(response.status).send(response.body);
    });
}
const addEvent= function (req, res, dance) {
    const event = {
        name:req.body.name,
        date:Date.now()
    }
    dance.events.push(event);
    dance.save(function(err, updatedDance) {
        const response= { status: 200, message: [] };
        if (err) {
            response.status= 500;
            response.message= err;
        } else {
            response.status= 201;
            response.message= updatedDance.events;
        }

        res.status(response.status).json(response.message);
    });

}

const deleteEventFromDance= function (req, res, dance) {
    const eventId = req.params.eventId;
    const danceId = req.params.danceId;
    Dance.updateOne({ _id: danceId }, {
        $pull: {
            events: {_id: eventId},
        },
    },{},function (err, dance) {
        res.send('hi')
    });
};
const updateEventOfDance = function(req,res){
    const danceId = req.params.danceId;
    const eventId = req.params.eventId;

    Dance.findById(danceId).select('events').exec(function (err, dance) {
        const response= { status:process.env.STATUS_CODE_CREATED, message: dance };
        if (err) {
            console.log("Error finding dance");
            response.status= 500;
            response.message= err;
        } else if (!dance) {
            console.log("Error finding dance");
            response.status= 404;
            response.message= {"message": "dance ID not found "+danceId};
        }
        if (dance) {
            const event = dance.events;

        } else {
            res.status(response.status).json(response.message);
        }
    });
}

const addEventToDance= function(req, res) {
    const danceId= req.params.id;
    Dance.findById(danceId).select("events").exec(function(err, dance) {
        const response= { status:process.env.STATUS_CODE_CREATED, message: dance };
        if (err) {
            console.log("Error finding dance");
            response.status= 500;
            response.message= err;
        } else if (!dance) {
            console.log("Error finding dance");
            response.status= 404;
            response.message= {"message": "dance ID not found "+danceId};
        }
        if (dance) {
            addEvent(req, res, dance);
        } else {
            res.status(response.status).json(response.message);
        }
    });
}

module.exports = {
    addEventToDance,
    deleteEventFromDance,

    getAllEventsOfDance
};