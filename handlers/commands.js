const fs = require("fs")
const Discord = require("discord.js")

module.exports = (client) => {
    client.commands = new Discord.Collection()
    const arrayOfCommands = []

    fs.readdirSync("./commands").forEach(commandFile => {
        const command = require(`../commands/${commandFile}`)
        client.commands.set(command.name, command)
        arrayOfCommands.push(command)
    })

    client.once("ready", async () => {
        await client.application.commands.set(arrayOfCommands)
    })

    console.log("Commands Registered Globally")
}  