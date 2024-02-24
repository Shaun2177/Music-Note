const { SlashCommandBuilder } = require("discord.js")
const emotes = require("../handlers/emotes.js")
const getQueue = require('../utils/getQueue.js')
const embeds = require("../handlers/embeds")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the queue"),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        if (queue.paused) {
            return interaction.reply({ embeds: [embeds.ErrorEmbed(`The song is already paused`, emotes.X)] })
        } else {
            queue.setPaused(true)
            return interaction.reply({ embeds: [embeds.SuccessEmbed("Paused the song", emotes.Pause)] })
        }
    }
}