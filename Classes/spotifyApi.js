const axios = require('axios');
const qs = require('querystring')


class SpotifyApi {
    //Constructror client ID, secret Key and redirect URI must be set
    constructor(clientID, clientSecretKey, redirectUri) {
        this.clientID = clientID;
        this.clientSecretKey = clientSecretKey;
        this.redirectUri = redirectUri;
        this.authToken; //Auth Token for api
        this.accessToken;
        this.refreshToken;
        this.accesTokenTime; //Time whenn Acces is created acces is valid for 3600 seconds
    }

    //Easy Setter
    setAuthToken(authToken) {
        this.authToken = authToken;
    }

    getAuthToken() {
        return this.authToken;
    }


    //!Validation Functions
    //Function which returns acces Token, refresht Token, and expire Time as dictionary
    //Also automatically sets these for class
    //a valid auth Token must be set by the Application
    getAccesToken() {
        console.log("auth Token " + this.authToken);
        const requestBody = {
            grant_type: "authorization_code",
            code: this.authToken,
            redirect_uri: this.redirectUri,
            client_id: this.clientID,
            client_secret: this.clientSecretKey
        }
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        return new Promise((resolve, reject) => {
            axios.post('https://accounts.spotify.com/api/token', qs.stringify(requestBody), config)
                .then(async (result) => {
                    this.accessToken = result['data'].access_token;
                    this.refreshToken = result['data'].refresh_token;
                    const expires_in = result['data'].expires_in;
                    this.accesTokenTime = Date.now();
                    const dict = {
                        "acces_token": this.accessToken,
                        "refresh_token": this.refreshToken,
                        "expires_in": expires_in,
                    };
                    console.log("Authentification" + dict);
                    resolve(dict);
                })
                .catch((err) => {
                    console.log(err.message);
                })
        })
    }

    //Refresh the Token
    refreshTokenfunc() {
        /*let buff1=new Buffer(this.clientID);
        let buff2=new Buffer(this.clientSecretKey);
        let base641=buff1.toString('base64');
        let base6642=buff2.toString('base64');*/
        let help = this.clientID + ':' + this.clientSecretKey;
        let buff = new Buffer(help);
        help = buff.toString('base64');

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + help
            }
        }
        const requestBody = {
            grant_type: "refresh_token",
            refresh_token: this.refreshToken,
        }

        return new Promise((resolve, reject) => {
            axios.post("https://accounts.spotify.com/api/token", qs.stringify(requestBody), config)
                .then(async (result) => {
                    this.accessToken = result['data'].access_token;
                    this.accesTokenTime = Date.now();
                    resolve(this.accessToken);
                })
                .catch((err) => {
                    console.log(err.message);
                })
        })

    }

    //Can be used for authentification after First Time
    //Checks IF API key is still valid if not aks for new key
    authenticate() {
        console.log("Authenticate");
        return new Promise(async (resolve, reject) => {
            //Acces Token still valid
            if ((Date.now()- this.accesTokenTime) / 1000 < 3600) {
                console.log("Acces Token valid");
                resolve(this.accessToken);
            }
            //Acces Token invalid Need To Create New Acces Token from refreshToken
            else {
                await this.refreshTokenfunc();
                resolve(this.accessToken);
            }
        },
        )
    }

    //!Functions to Get Data
    //Function to Return all The Playlists of a user -> a valid auth Token must be set before calling
    getUserPlaylists() {
        console.log("Get User Playlist");
        const config = {
            headers: {
                'Authorization': "Bearer " + this.accessToken,
            }
        };
        return new Promise((resolve, reject) => {
            axios.get("https://api.spotify.com/v1/me/playlists", config)
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    console.log(err.message);
                })
        }
        );
    }
}



module.exports = SpotifyApi;