const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./config');

exports.getToken = (user) => {
    return jwt.sign({
        id:user.id,
        fullname:user.fullname,
        email:user.email,
        isAdmin:user.isAdmin
    },SECRET_KEY,{
        expiresIn:'24h'
    })
}

exports.isAuth = (req,res,next) =>{
    const token = req.headers.authorization;
    if(token){ 
        jwt.verify(token,SECRET_KEY,(err,decode) =>{
            if(err){
                return res.status(401).send({
                    message:'Invalid token'
                })
            }
            req.user = decode;
            next();
            return
        })
    }else{
        return res.status(401).send({
            message:`Access Denied.`
        })
    }
}

exports.isAdmin = (req,res,next) =>{
      if(req.user && req.user.isAdmin){
          return next()
      }
      return res.status(401).send({
          message:`restricted access,only admin allowed.`
      })
}
