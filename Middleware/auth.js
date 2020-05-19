const jwt = require('jsonwebtoken');
//Important for Environmet Variables -> when not in Producation load important variables from file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


function auth(req,res,next){
    const token=req.header('x-auth-token');

    //no Token
    if(!token) return res.status(401).send("No Token");

    try{
        const decoded=jwt.verify(token, process.env.jwt_private_key);
        req.user=decoded; //Gives object {_id} weiter
        next();
    }
    catch(err){
        res.status(400).send("Invalid Token");
    }
}

module.exports=auth;