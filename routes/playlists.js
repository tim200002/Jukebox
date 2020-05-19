//Important for Environmet Variables -> when not in Production load important variables from file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var NewSpotifyApi=require('../Classes/newSpotifyApi')
var express = require('express');
var router = express.Router();
var auth=require('../Middleware/auth');
const { User } = require('../models/user');

var newSpotifyApi= new NewSpotifyApi(
    process.env.client_Id,
    process.env.client_secret_key,
    process.env.redirect_uri
)

router.get('/allPlaylists',auth,async(req,res)=>{
    try{
    var user=await User.findById(req.user._id);
    var accessToken=await user.isAccessValid();
    console.log(accessToken);
    var play = await newSpotifyApi.getUserPlaylists(accessToken);
    console.log(play.data);
    res.send(play.data);
    }
    catch (err){
        console.log(err.message);
    }
});

module.exports=router;

