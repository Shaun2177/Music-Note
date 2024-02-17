const Discord = require("discord.js")
const client = new Discord.Client({
	intents: Object.keys(Discord.GatewayIntentBits).map((a) => { return Discord.GatewayIntentBits[a] })
})
require("dotenv").config()
const fs = require("fs")

/**
 * TODO:
 * ADD BETTER ERROR HANDLER (USING THE ALT DISCORD DMS)
 * ? CHECK DISCORD.JS DOCS FOR RELOADING COMMANDS
 * 
 * ! IMPORTANT: AFTER FINISHING ALL OF THE ABOVE, MAKE SURE PREVIOUS CODE IS ACTUALLY LIKE THE PREVIOUS MUSIC NOTE
 */

fs.readdirSync("./handlers").forEach(handlerFile => {
	const handler = require(`./handlers/${handlerFile}`)
	if (typeof(handler) == "function") handler(client)
})

client.login(process.env.TOKEN)