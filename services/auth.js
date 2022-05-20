const passport = require('passport');
var jwt = require('jsonwebtoken');

const generateToken = (req,res,next) =>{
    console.log('in generateToken')
    passport.authenticate('local', { session: false }, (err,user,info)=>{
        console.log('in call back gt--');
        console.log(err);
        console.log(user);
        console.log(info);
        if(!user){
            //const err = {};
            //err.status = 405;
            //err.message = err.message;
            
            return res.status(403).json(info);
        }
        else
            req.user = user;
        return next();
    })(req, res, next);
}

const signin = (req, res, next) => {
    // User has already had their email and password auth'd
    // We just need to give them a token
    console.log('below is req.user');
    console.log(req.user);
    res.send({ token: tokenForUser(req.user), expiresIn: '10000', message:"Successful login!" });
}  

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.sign({data:{ sub: user.id_int,email:user.email,iat: timestamp }}, 'config.secret', { expiresIn: '10000' }); //config.secret);
}


const requireAuth = (req,res,next) => {
    passport.authenticate('jwt', { session: false }, (err,user,info)=>{
        console.log('in call back requireAuth --')
        console.log(err);
        console.log(user);
        console.log(info);
        
        if(typeof info !== 'undefined' && 'expiredAt' in info){
            const err = {};
            err.status = 401;
            err.code = 'Token expired';
            
            return res.status(401).json(err);
        }
        if(err || !user){
            const err = {};
            err.status = 401;
            err.code = 'CP_SI_ValidationFailed';
            
            return res.status(401).json(err);
        }

        req.user = user;
        
        return next();
    })(req, res, next);
}


module.exports = {
    generateToken,
    signin,
    requireAuth
}