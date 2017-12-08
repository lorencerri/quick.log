const log = require('./index.js')

log.options({
    "clientId": "388486349667172355",
    "clientSecret": ""
});

log.access(['144645791145918464'])

setTimeout(function () {

    log.send('#Supports Markdown!')
    log.send('##Updates in real-time!')
    log.send('###Viewable from any browser!')

    // Counter
    let i = 0

    let func = setInterval(function () {
        var d = new Date();
        // Change Title
        log.title(`Last log: ${d.getHours()}:${d.getMinutes()}.${d.getMilliseconds()}`)

         // Send Message
        log.send(`**${i}** | *Random #* = \`${Math.random()}\``)

        i++
    }, 500)

}, 1500)