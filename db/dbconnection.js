const mongoose = require('mongoose');
require('../model/dance');


mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected',function () {
    console.log(process.env.MONGO_CONNECION_SUCCESS_MSG);
});


process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log(process.env.SIGINT_MESSAGE);
        process.exit(0);
    });
});

process.on("SIGTERM", function() {
    mongoose.connection.close(function() {
        console.log(process.env.SIGTERM_MESSAGE);
        process.exit(0);
    });
});

process.once("SIGUSR2", function() {
    mongoose.connection.close(function() {
        console.log(process.env.SIGUSR2_MESSAGE);
        process.kill(process.pid, "SIGUSR2");
    });
});
