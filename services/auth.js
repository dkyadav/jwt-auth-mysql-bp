const passport = require('passport');
var jwt = require('jsonwebtoken');

const generateToken = (req,res,next) =>{
    passport.authenticate('local', { session: false }, (err,user,info)=>{
        if(!user){
            return res.status(403).json(info);
        }
        else
            req.user = user;
        return next();
    })(req, res, next);
}

const signin = (req, res, next) => {
    res.send({ token: tokenForUser(req.user), expiresIn: '30000', message:"Successful login!" });
}  

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.sign({data:{ sub: user.id_int,email:user.email,iat: timestamp }}, 'config.secret', { expiresIn: '30000' }); //config.secret);
}


const requireAuth = (req,res,next) => {
    passport.authenticate('jwt', { session: false }, (err,user,info)=>{
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