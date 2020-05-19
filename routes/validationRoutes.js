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

const scopes = 'user-read-private user-read-email playlist-read-private';

//Login User -> Used when User not logged in to spotify
router.get('/LoginUser', auth,(req,res)=>{
    res.send('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.client_Id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(process.env.redirect_uri)+
        '&state='+req.user._id);
})


router.get('/login', (req, res) => {
    var state="1234"
    res.send('https://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + process.env.client_Id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent(process.env.redirect_uri)+
        '&state='+state);

});


//Route which is called after succesfull validation
router.get('/callback', async (req, res) => {
    const  authToken  = req.query.code;
    const state =req.query.state;
    const codes=await newSpotifyApi.getAccesToken(authToken);
    const user=await User.findById(state);
    const helper={
        authToken: state,
        accessToken: codes.acces_token,
        refreshToken: codes.refresh_token,
        issueTime: codes.issue_time

    }
    var temp=await user.update(helper);
    console.log(codes);


    /*
    
    const user=await User.findById(state);
    console.log(state);
    spotifyApi.setAuthToken(code);
    console.log(spotifyApi);
    spotifyApi.getAccesToken(); //Get new acces token 
*/

    res.send(temp);
})

//Whe Database finish somewhere else

router.get('/playlists', async (req, res) => {
    try{
    var code = await spotifyApi.authenticate();
    console.log(code);
    var play = await spotifyApi.getUserPlaylists();
    console.log("Playlist");
    console.log(play.data);
    res.send(play.data);
    }
    catch(err){
        console.log(err);
    }

})



module.exports = router;
