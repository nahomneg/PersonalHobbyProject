require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const multer  = require('multer');

const app = express();



app.use('/a',express.static('/b'));


app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));



require('./db/dbconnection');
const danceRoute = require('./routes/danceRoutes');
const usersRoute = require('./routes/usersRoute');



app.use(express.urlencoded({extended:true}));
app.use(express.json());

const allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header('Access-Control-Allow-Headers', 'Origin, XRequested-With, Content-Type, Accept, Authorization');
    next();
}


app.use("/", allowCors);

app.use('/dances',danceRoute);
app.use('/users',usersRoute);

const listenServer = function () {
    console.log(process.env.SERVER_START_MSG, server.address().port)
};



const server = app.listen(process.env.SERVER_PORT,listenServer);
