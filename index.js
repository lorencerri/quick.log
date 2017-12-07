// Require Packages
const app          = require('express')();
const showdown     = require('showdown');
const http         = require('http').Server(app);
const io           = require('socket.io')(http);
const events       = require('events');
const eventEmitter = new events.EventEmitter();
const converter    = new showdown.Converter();
const instance     = false;
const port         = 8080;

/*
/ Quick.log
/ Created By TrueXPixels
/ Persistent version coming soon...
*/

// Create index page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
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

// Front End
module.exports = {

    send: function (message) {
        // Markdown -> HTML
        message = converter.makeHtml(message)
        io.emit('output', message);
    }

}