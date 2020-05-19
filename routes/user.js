const _= require('lodash');
const { User } = require('../models/user');
var express = require('express');
var router=express.Router();
const bcrypt


router.post('/createNewUser', async (req, res) => {
    let user = new User(_.pick(req.body, ['name', 'password']));
    const salt= await bc
    user = await user.save();
    
    const token=user.generateAuthToken();
    res.header('x-auth-token', token);

    res.send(_.pick(user,['_id','name']));

});


module.exports=router;