const _= require('lodash');
const { User } = require('../models/user');
var express = require('express');
var router=express.Router();
const bcrypt=require('bcryptjs')


router.post('/createNewUser', async (req, res) => {
    let user = new User(_.pick(req.body, ['name', 'password']));
    const salt= await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password, salt);
    user = await user.save();
    
    const token=user.generateAuthToken();
    res.header('x-auth-token', token);

    res.send(_.pick(user,['_id','name']));

});

router.post('/login', async (req,res)=>{
    let user= await User.findOne({name: req.body.name});
    if(!user) return res.status(400).send("Invalid User or Password");

    //Validate User
    const validPassword=await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Invalid User or Password");

    //Return JsonWebToken
    const token=user.generateAuthToken();
    res.send(token);
})

module.exports=router;