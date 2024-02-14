const { Player } = require("discord-music-player")

module.exports = (client) => {
    client.player = new Player(client, {
        leaveOnEnd: true,
        leaveOnStop: true,
        leaveOnEmpty: true,
        deafenOnJoin: true
    })
}