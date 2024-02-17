const { Player } = require("discord-music-player")

module.exports = (client) => {
    client.player = new Player(client, {
        leaveOnEnd: false, // Leave when no more songs
        leaveOnStop: true,
        leaveOnEmpty: true, // Leave when there are no more users in the channel
        deafenOnJoin: true
    })
}