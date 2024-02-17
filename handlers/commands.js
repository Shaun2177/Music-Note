const fs = require("fs")
const Discord = require("discord.js")

module.exports = (client) => {
    const arrayOfCommands = []
    client.commands = new Discord.Collection()

    fs.readdirSync("./commands").forEach(commandFile => {
        const command = require(`../commands/${commandFile}`)
        if ('data' in command && 'execute' in command) {
            arrayOfCommands.push(command.data.toJSON())
            client.commands.set(command.data.name, command)
        } else {
            console.log(`[WARNING] The command at /commands/${commandFile} is missing a required "data" or "execute" property.`)
        }
    })

    client.once("ready", async () => {
        await client.application.commands.set(arrayOfCommands)
    })

    console.log("Commands Registered Globally")
}