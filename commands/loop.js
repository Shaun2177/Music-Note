const { SlashCommandBuilder } = require("discord.js")
const embeds = require("../handlers/embeds.js")
const getQueue = require('../utils/getQueue.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Loop the currently playing song/queue")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Turn off the loop or activate it for the song or queue")
                .setRequired(true)
                .addChoices(
                    { name: "Disable", value: "0" },
                    { name: "Song", value: "1" },
                    { name: "Queue", value: "2" }
                )
        ),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        const mode = queue.setRepeatMode(Number(interaction.options.getString("mode")))
        const isQueue = mode == 2
        const message = mode ? (isQueue ? "Loop set to queue" : "Loop set to song") : "Loop disabled"
        const emoji = mode ? "🔁" : "<:repeatwithslash:1088924810945503353>"

        return interaction.reply({ embeds: [embeds.SuccessEmbed(message, emoji)] })
    }
}