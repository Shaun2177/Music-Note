const { SlashCommandBuilder } = require("discord.js")
const emotes = require("../handlers/emotes.js")
const getQueue = require('../utils/getQueue.js')
const embeds = require("../handlers/embeds")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the queue"),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        if (!queue.paused) {
            return interaction.reply({ embeds: [embeds.ErrorEmbed(`The song is already resumed`, emotes.X)] })
        } else {
            queue.setPaused(false)
            return interaction.reply({ embeds: [embeds.SuccessEmbed("Resumed the song", emotes.Pause)] })
        }
    }
}