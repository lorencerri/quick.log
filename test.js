const log = require('./index.js')

log.options({
    "clientId": "388486349667172355",
    "clientSecret": "client Secret Here"
});

setTimeout(function () {

    log.send('#Supports Markdown!')
    log.send('##Updates in real-time!')
    log.send('###Viewable from any browser!')

    // Counter
    let i = 0

    let func = setInterval(function () {

        // Send Message
        //log.send(`**${i}** | *Random #* = \`${Math.random()}\``)

        i++
    }, 500)

}, 1500)
