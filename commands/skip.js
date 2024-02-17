const embeds = require("../handlers/embeds.js")
const keywords = require("../handlers/keywords.js")
const emotes = require("../handlers/emotes.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription('Skip the currently playing song'),
    async execute(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id)
        // If there's no queue or no songs
        if (!queue?.songs || queue.songs.length == 0) return interaction.reply({ embeds: [embeds.ErrorEmbed(keywords.NothingPlaying, emotes.X)], ephemeral: true })

        await queue.skip()
        await interaction.reply({ embeds: [embeds.SuccessEmbed(keywords.SkipSong, emotes.ForwardTrack)] })
    }
}