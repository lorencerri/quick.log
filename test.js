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
    let flow = true;
    let func = setInterval(function () {
        var d = new Date();
        // Change Title
        log.title(`Last log: ${d.getHours()}:${d.getMinutes()}.${d.getMilliseconds()}`)

        // This right here switches the flow every time a message is sent
        if (flow) log.flow('up'), flow = false;
        else log.flow('down'), flow = true;

         // Send Message
        log.send(`**${i}** | *Random #* = \`${Math.random()}\``)

        i++
    }, 500)


}, 1500)