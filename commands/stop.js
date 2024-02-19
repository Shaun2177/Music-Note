const { SlashCommandBuilder } = require("discord.js")
const embeds = require("../handlers/embeds.js")
const keywords = require("../handlers/keywords.js")
const emotes = require("../handlers/emotes.js")
const getQueue = require('../utils/getQueue.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop the queue"),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return
        
        await queue.stop()
        return interaction.reply({ embeds: [embeds.SuccessEmbed(keywords.StopQueue, emotes.Stop)] })
    }
}