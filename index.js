//Entry Poit for the Application

var express = require('express');
var app = express();
const mongoose = require('mongoose');
var http = require('http');

//Require Routes
var validationRoutes=require('./routes/validationRoutes');
var userRoutes=require('./routes/user');
var playlistRoutes=require('./routes/playlists');
var searchRoutes= require('./routes/search')
//Important for Environmet Variables -> when not in Producation load important variables from file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


mongoose.connect('mongodb+srv://tim200002:'+process.env.database_Password+'@cluster0-jmtc0.mongodb.net/Jukebox?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log("Error Connecting to DB"));
var scopes = 'user-read-private user-read-email playlist-read-private';

app.use(express.json());
app.use('/user', userRoutes);
app.use('/playlist', playlistRoutes);
app.use('/search', searchRoutes);
app.use(validationRoutes);

const port = process.env.PORT || 8080;
app.listen(port,  () =>console.log("Webserver started on port "+ port));

