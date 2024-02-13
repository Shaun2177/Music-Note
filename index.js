const Discord = require("discord.js")
const client = new Discord.Client({
    intents: Object.keys(Discord.GatewayIntentBits).map((a)=>{
        return Discord.GatewayIntentBits[a] 
    })
})

const { Player } = require("discord-music-player")
client.player = new Player(client, {
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    deafenOnJoin: true
})

