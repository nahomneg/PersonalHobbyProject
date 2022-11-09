require('dotenv').config();
const express = require('express');
const app = express();

require('./db/dbconnection');
const danceRoute = require('./routes/danceRoutes');

app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use("/", function (req, res,next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept');
    next();
});

app.use('/dances',danceRoute);




const server = app.listen(process.env.SERVER_PORT,function () {
    console.log(process.env.SERVER_START_MSG, server.address().port)
});
