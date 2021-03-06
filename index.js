// Require Packages
const express      = require("express");
const app          = require('express')();
const showdown     = require('showdown');
const http         = require('http').Server(app);
const io           = require('socket.io')(http);
const events       = require('events');
const eventEmitter = new events.EventEmitter();
const converter    = new showdown.Converter();
const instance     = false;
const port         = 8080;
const baseApiUrl   = "https://discordapp.com/api/";
const snekfetch    = require("snekfetch");
const cookieParser = require("cookie-parser");
const ClientOauth  = require("client-oauth2");
const url          = require("url");
let discord;
let access;
let title;
let flow = 'up';
let host;

/*
/ Quick.log
/ Created By TrueXPixels
/ Persistent version coming soon...
*/

// Make express use cookies
app.use(cookieParser());

// Create index page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get("/callback", (req, res) => {
    if (!discord) return;
    discord.code.getToken(req.originalUrl).then(user => {
        let bearer = user.accessToken;
        res.cookie("bearer", bearer);
        res.redirect('/');
    }).catch(e => {
        res.status(401)
            .send(e.body.error);
    });
});

// Listen to port
http.listen(port, function () {
    console.log('Log created on localhost:' + port);
});

// Markdown > HTML Options
converter.setOption('underline', true)
converter.setOption('strikethrough', true)
converter.setOption('smoothLivePreview', true)
converter.setOption('simplifiedAutoLink', true)
converter.setOption('openLinksInNewWindow', true)

// Events from the front End
io.on("connection", socket => {
    socket.on("getUri", () => {
        if (discord) socket.emit("getUri", discord.code.getUri());
    });

    socket.emit('output', { message: '', access: access })

    socket.on("getAllUserInfo", bearer => {
        if (!bearer) return;
        snekfetch.get(`${baseApiUrl}users/@me`)
            .set("Authorization", "Bearer " + bearer).then(user => {
                snekfetch.get(`${baseApiUrl}users/@me/guilds`)
                    .set("Authorization", "Bearer " + bearer).then(guilds => {
                        let results = {
                            "user": user.body,
                            "guilds": guilds.body
                        };
                        console.log(`${results.user.username}#${results.user.discriminator} (ID: ${results.user.id}) logged into quick.log, they are connected to ${results.guilds.length} guilds.`)
                        socket.emit("getAllUserInfo", results);
                    }).catch(console.log);
            }).catch(console.log);
    });

});

// Front End
module.exports = {

    send: function (message) {
        // Markdown -> HTML
        message = converter.makeHtml(message)
        io.emit('output', { message: message, access: access, title: title, flow: flow });
    },
    options: function (ops) {
        if (!ops.clientId || !ops.clientSecret) throw new Error("Missing options, clientId or clientSecret");
        ops.accessTokenUri = 'https://discordapp.com/api/oauth2/token';
        ops.authorizationUri = 'https://discordapp.com/api/oauth2/authorize';
        ops.redirectUri = ops.redirectUri || 'http://127.0.0.1:8080/callback';
        ops.scopes = ["identify", "guilds"]

        discord = new ClientOauth(ops);
        host = url.parse(ops.redirectUri).host;
    },
    access: function (array) {
        if (typeof array == 'object') access = array, console.log(`Giving access to ${array.length} ID(s)`)
        else return console.log('.access parameter is not an array...')
    },
    title: function (string) {
        title = string
    },
    flow: function (string) {
        if (string.toLowerCase() == 'up') flow = 'up'
        else if (string.toLowerCase() == 'down') flow = 'down'
        else console.log('.flow please set "up" or "down"...')
    }

}
