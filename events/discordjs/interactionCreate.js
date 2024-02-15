const { Events } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.reply({ content: "This command is outdated", ephemeral: true })
            
            try {
                console.log(`\x1b[1m\x1b[32mSuccess \x1b[30m- \x1b[1m\x1b[35m${interaction.user.tag} used ${command.data.name} \x1b[30m- \x1b[2m\x1b[35m${interaction.guildId}\x1b[0m`)
                await command.execute(client, interaction)
            } catch (error) {
                console.error(error)
            }
        }

        if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName)
            if (!command) return console.log('Command was not found')

            if (!command.autocomplete) return console.error(`No autocomplete handler was found for the ${interaction.commandName} command`)
            
            try {
                await command.autocomplete(client, interaction)
            } catch (error) {
                console.error(error)
            }
        }
    }
}