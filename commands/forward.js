const { SlashCommandBuilder } = require("discord.js")
const getQueue = require("../utils/getQueue")
const embeds = require("../handlers/embeds")
const emotes = require("../handlers/emotes")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("forward")
        .setDescription("Forward the song by either 10 seconds or a given amount of seconds")
        .addIntegerOption((option) => 
            option.setName("amount")
                .setDescription("Amount of time to skip forward in seconds")
                .setMinValue(1)),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        // Get the skip amount in seconds then convert it to milliseconds
        const skipAmount = (interaction.options.getInteger("amount") || 10) * 1000
        const song = queue.nowPlaying
        
        // Get the current playback duration
        const playbackDuration = queue.connection?.player?._state?.resource?.playbackDuration
        if (!playbackDuration) return interaction.reply({ embeds: [embeds.ErrorEmbed("Unable to get the playback duration", emotes.X)] })
        
        // Check if the skip amount will exceed the song length
        if (playbackDuration + skipAmount > song.milliseconds) {
            return interaction.reply({ embeds: [embeds.ErrorEmbed("This will exceed the song length", emotes.X)] })
        }

        // If it won't exceed the song length
        await queue.seek(playbackDuration + skipAmount)
        return interaction.reply({ embeds: [embeds.SuccessEmbed(`Forwarded the song by \`${skipAmount / 1000}\` seconds`, emotes.ForwardSong)] })
    }
}