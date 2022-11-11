const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    location:{
        type: [Number],
        index: '2dshpere',
        required:true
    }
});

module.exports = eventSchema;