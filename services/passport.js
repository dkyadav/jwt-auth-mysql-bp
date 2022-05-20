const passport = require('passport');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const db = require('./db');

const localLogin = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async(email, password, done)=>{
      try{
        console.log('inlocal strategy');
        const pool = await db.getPool();
        const emailres = await db.executeQuery(pool,`SELECT id_int,email_Vch as email,password_vch as password from test.user where email_vch='${email}'`);
        console.log(emailres[0][0]);
        
        if(emailres[0][0]){
          if(emailres[0][0].password === password)
            return done(null,emailres[0][0], {message:"successfully verified"});
          else
            return done(null, false, {message: "wrong password"});
        }
        else
          return done(null, false, {message: "wrong username or email"});
  
      }catch(e){
        console.error(e);
        return done(null, false, {message: "unexpected error"});
      }
        
    }   
);

passport.use(localLogin);


const jwtOptions = {
    //jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    //jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'config.secret'
};
  
const decodeJWT = new JwtStrategy(jwtOptions,function(payload,done){
    // console.log('inside JwtStrategy');
    // console.log(payload);
    // console.log('injwtLogin')
    return done(null, payload);
});

passport.use(decodeJWT);  