const mongoose = require('mongoose');
const eventSchema = require('./event');

const danceSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    countryOfOrigin:{
        type:String,
        required: true
    },
    imageurl:{
        type:String,
        require:true
    },
    events: {
        type: [eventSchema],
        default:[
            {
                name:"Default Event",
                date:Date.now()
            }
        ]
    }
});

mongoose.model(process.env.DANCE_MODEL_NAME,danceSchema, process.env.DANCE_COLLECTION);