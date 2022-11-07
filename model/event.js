const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: String,
    date: Date
});

module.exports = eventSchema;