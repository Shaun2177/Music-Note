const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const keywords = require("../handlers/keywords.js")
const { Utils } = require("discord-music-player")
const getQueue = require('../utils/getQueue.js')
const progressbar = require('string-progressbar')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("nowplaying")
        .setDescription("Shows the currently playing song"),
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return
        
        const currentTime = queue.connection?.player?._state?.resource?.playbackDuration || 0  
        const totalDuration = queue.songs[0].milliseconds

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Now Playing", iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`[${queue.songs[0].name}](${queue.songs[0].url})`)
            .setThumbnail(queue.songs[0].thumbnail)
            .setFooter({ text: keywords.MadeBy })
            .addFields(
                { name: "Progress Bar", value: `\`${Utils.msToTime(currentTime)}\`[${progressbar.splitBar(totalDuration, currentTime, 20)[0]}] \`${Utils.msToTime(totalDuration)}\``, inline: true },
            )

        return interaction.reply({ embeds: [embed] })
    }
}