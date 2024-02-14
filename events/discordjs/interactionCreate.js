const { Events } = require("discord.js")
const embeds = require("../../handlers/embeds.js")
const keywords = require("../../handlers/keywords")

module.exports = {
    name: Events.InteractionCreate,
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName)

            try {
                console.log(`\x1b[1m\x1b[32mSuccess \x1b[30m- \x1b[1m\x1b[35m${interaction.user.tag} used ${command.name} \x1b[30m- \x1b[2m\x1b[35m${interaction.guildId}\x1b[0m`)
                return await command.execute(client, interaction)
            } catch (error) {
                console.error(error)
                try {
                    return await interaction.reply({ embeds: [embeds.ErrorEmbed(keywords.ExecuteError, "❌")], ephemeral: true })
                } catch (error) {
                    console.error(`Failed to reply to interaction in interactionCreate.js: ${error}`)
                }
            }
        }
    }
}