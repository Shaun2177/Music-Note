const fs = require("fs")

module.exports = (client) => {

    fs.readdirSync("./events").forEach(eventFolder => {

        fs.readdirSync(`./events/${eventFolder}`).forEach(eventFile => {
            
            const event = require(`../events/${eventFolder}/${eventFile}`)

            switch(eventFolder) {
                case "discordjs":
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(client, ...args))
                    } else {
                        client.on(event.name, (...args) => event.execute(client, ...args))
                    }
                    break
                case "discord-music-player":
                    client.player.on(event.name, (...args) => event.execute(client, ...args))
                    break
            }
            
        })

    })

}