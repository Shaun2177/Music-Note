const { SlashCommandBuilder } = require("discord.js")
const getQueue = require("../utils/getQueue")
const embeds = require("../handlers/embeds")
const emotes = require("../handlers/emotes")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rewind")
        .setDescription("Rewind the song by either 10 seconds or a given amount of seconds")
        .addIntegerOption((option) => 
            option.setName("amount")
                .setDescription("Amount of time to rewind in seconds")
                .setMinValue(1)),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        // Get the rewind amount in seconds then convert it to milliseconds
        const rewindAmount = (interaction.options.getInteger("amount") || 10) * 1000
        const song = queue.nowPlaying
        
        // Get the current playback duration
        const playbackDuration = queue.connection?.player?._state?.resource?.playbackDuration
        if (!playbackDuration) return interaction.reply({ embeds: [embeds.ErrorEmbed("Unable to get the playback duration", emotes.X)] })
        
        // Check if the rewind amount will exceed the song length
        if (playbackDuration - rewindAmount < 0) {
            return interaction.reply({ embeds: [embeds.ErrorEmbed("This will exceed the song length", emotes.X)] })
        }

        // If it won't exceed the song length
        await queue.seek(playbackDuration - rewindAmount)
        return interaction.reply({ embeds: [embeds.SuccessEmbed(`Rewinded the song by \`${rewindAmount / 1000}\` seconds`, emotes.RewindSong)] })
    }
}