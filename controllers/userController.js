const jwt = require('jsonwebtoken');
const logout =  function () {

}

const mongoose = require('mongoose')
const bcrypt = require('bcrypt');


const User = mongoose.model(process.env.USER_MODEL_NAME);

const sendResponse = function (res, response) {
    res.status(response.status).json(response.body);
}

const genSalt = function (result,user, res) {
    user.password = bcrypt.hashSync(user.password, result);
    User.create(user).then(function (user) {
        console.log('user created')

    }).catch(function (err) {
        console.log('error creating user')
    }).finally(function () {
        res.status(200).send('success')
    });
}

const register = function (req, res) {
    const user = {
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
    }
    bcrypt.genSalt(10).then((result) => genSalt(result,user, res)).catch(function (err) {
        console.log(err);
    });
}
const sendJWT = function (success, user, res, response) {
        if (success){
            jwt.sign({name: user.name},'secret',function (err, token) {
                response.body = {
                    'success':true,
                    'token': token
                }
                sendResponse(res, response);
            });
        }
        else{
            console.log("password not correct");
        }
}
const authenticateUser =function (user,credentials, res, response){
        if (!user){
            console.log('user not found');
        }
        else{
            bcrypt.compare(credentials.password, user.password).then((success) => sendJWT(success,user, res, response)).catch(function (err) {
                console.log('problem checking password', err);
                response.body = err;
                response.status = process.env.STATUS_CODE_UNAUTHORIZED;
                sendResponse(res,response)
            });
        }
}

const login = function (req, res){
    const credentials = {
        username: req.body.username,
        password : req.body.password
    };
    const response = {
        body:'',
        status : 200
    }

    User.findOne({'username':credentials.username}).then((user) => authenticateUser(user,credentials, res, response)).catch(function (err) {
        console.log(err);
    }).finally(function () {
    });
}

const checkAuth = function (req, res, next) {
    const response = {
        body: {
            success: false,
            error: 'token is not valid'
        },
        status: process.env.STATUS_CODE_UNAUTHORIZED
    }
    if (req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, 'secret',function (err, result) {
            if (result){
                req.name = result.name;
                next();
            }
            else{
                response.status = process.env.STATUS_CODE_UNAUTHORIZED;
                response.body = {
                    success: false,
                    error: 'token is not valid'
                }
                sendResponse(res, response);
            }
        })
    }
    else{
        sendResponse(res, response);
    }
}

module.exports = {
    login,
    register,
    logout,
    checkAuth
}