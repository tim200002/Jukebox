//Important for Environmet Variables -> when not in Production load important variables from file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const _= require('lodash');
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

router.get('/', auth, async(req,res)=>{
    try{
        var user=await User.findById(req.user._id);
        var accessToken=await user.isAccessValid();
        console.log(accessToken);
        var search = await newSpotifyApi.search(accessToken, req.body.query);
        //Format Result
        var tracks=search.tracks.items;
        var result=[]
        tracks.forEach((item)=>{result.push({
            artist: item.artists[0].name,
            id: item.id,
            title: item.name,
            albumArt:item.album.images[2].url //Not Sure index 1 or 2 1 is bigger
        })})
        console.log(result);

        res.send(result);
        }
        catch (err){
            console.log(err.message);
        }
});

module.exports=router;