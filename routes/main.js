
const mainRoute = require('express').Router();
const mainController = require('../controllers/info');
const auth = require('../services/auth');
const info = require('../controllers/info');

mainRoute.get('/health', (req,res)=>res.send({'msg':'OK'}));

mainRoute.post('/getToken', 
    auth.generateToken,
    auth.signin
    //(req,res)=>res.send({'msg':req.user})
);

//Protected Route
mainRoute.post('/api/userinfo', 
    auth.requireAuth, 
    info.userinfo
);

module.exports = mainRoute;