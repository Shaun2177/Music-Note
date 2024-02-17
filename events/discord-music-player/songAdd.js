const { Utils } = require("discord-music-player")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "songAdd",
    execute(client, queue, song) {

        let { interaction, positionInQueue } = song.data
        
        const embed = new EmbedBuilder()
            .setAuthor({ name: `Added to Queue`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(song.name)
            .setURL(song.url)
            .setThumbnail(song.thumbnail)
            .addFields(
                //! Using Utils.msToTime instead of song.duration as it's 03:14 not 3:14
                { name: "Song Duration", value: Utils.msToTime(song.milliseconds), inline: true },
                { name: "Requested By", value: String(song.requestedBy), inline: true },
                { name: "Position in Queue", value: positionInQueue, inline: true }
            )

        interaction.editReply({ embeds: [embed] })
        
    }
}