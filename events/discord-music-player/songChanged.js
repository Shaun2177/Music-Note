const { Utils } = require("discord-music-player")
const embeds = require("../../handlers/embeds.js")
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js")
const keywords = require("../../handlers/keywords.js")
const emotes = require("../../handlers/emotes.js")

const repeatModes = [
    { label: "Off", emoji: emotes.LoopWithSlash },
    { label: "Song", emoji: emotes.Loop },
    { label: "Queue", emoji: emotes.Loop }
]

module.exports = {
    name: "songChanged",
    async execute(client, queue, newSong, oldSong) {
        // Ran when the first song ended but there's a song after it

        //* THIS IS USED FOR DISABLING BUTTONS AFTER THE SONG IS CHANGED
        await disableOldButtons(queue)








        
        //* THIS IS USED FOR SENDING THE NOW PLAYING MESSAGE
        let { interaction } = newSong.data
        queue.setData({ lastTrack: oldSong })

        //! IS REQUIRED, DO NOT CHANGE
        queue.isPlaying = true


        //* Have this here so the buttons reset after each song
        const volumedown = new ButtonBuilder().setCustomId("volume-down").setLabel("Down").setStyle(ButtonStyle.Secondary).setEmoji(emotes.VolumeDown)
        const queueback = new ButtonBuilder().setCustomId("queue-back").setLabel("Back").setStyle(ButtonStyle.Secondary).setEmoji(emotes.PreviousTrack)
        const pauseorresume = new ButtonBuilder().setCustomId("pause-or-resume").setLabel("Pause").setStyle(ButtonStyle.Secondary).setEmoji(emotes.Pause)
        const queueskip = new ButtonBuilder().setCustomId("queue-skip").setLabel("Skip").setStyle(ButtonStyle.Secondary).setEmoji(emotes.ForwardTrack)
        const volumeup = new ButtonBuilder().setCustomId("volume-up").setLabel("Up").setStyle(ButtonStyle.Secondary).setEmoji(emotes.VolumeUp)

        const queueshuffle = new ButtonBuilder().setCustomId("queue-shuffle").setLabel("Shuffle").setStyle(ButtonStyle.Secondary).setEmoji(emotes.Shuffle)
        const queueloop = new ButtonBuilder().setCustomId("queue-loop").setLabel("Off").setStyle(ButtonStyle.Secondary).setEmoji(emotes.LoopWithSlash)
        const queuestop = new ButtonBuilder().setCustomId("queue-stop").setLabel("Stop").setStyle(ButtonStyle.Secondary).setEmoji(emotes.Stop)
        const queueclear = new ButtonBuilder().setCustomId("queue-clear").setLabel("Clear").setStyle(ButtonStyle.Secondary).setEmoji(emotes.Trash)

        const row1 = new ActionRowBuilder().addComponents(volumedown, queueback, pauseorresume, queueskip, volumeup)
        const row2 = new ActionRowBuilder().addComponents(queueshuffle, queueloop, queuestop, queueclear)

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Now Playing`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle(newSong.name)
            .setURL(newSong.url)    
            .setThumbnail(newSong.thumbnail)
            .addFields(
                { name: "Channel", value: newSong.author, inline: true },
                //* Using Utils.msToTime instead of newSong.duration as it's 03:14 not 3:14
                { name: "Song Duration", value: Utils.msToTime(newSong.milliseconds), inline: true },
                { name: "Requested By", value: String(newSong.requestedBy), inline: true },
            )

        const mode = repeatModes[queue.repeatMode]
        queueloop.setLabel(mode.label).setEmoji(mode.emoji)

        pauseorresume.setLabel(queue.paused ? "Resume" : "Pause")
        pauseorresume.setEmoji(queue.paused ? emotes.Play : emotes.Pause)

        queueshuffle.setDisabled(!queue.songs[1])
        queueback.setDisabled(!queue.data?.lastTrack) // If there's no data or lastTrack (and no data) 
        queueclear.setDisabled(queue.songs.length == 1) // If there's only one song, disable the button

        const message = await interaction.channel.send({ embeds: [embed], components: [row1, row2] })
        queue.setData({
            playMessage: message
        })

        const collector = await message.createMessageComponentCollector({ componentType: ComponentType.Button })
        collector.on("collect", async (button) => {

            if (!queue) return interaction.reply({ embeds: [embeds.ErrorEmbed(keywords.NothingPlaying, emotes.X)] })

            switch (button.customId) {

                case "volume-down":
                    await button.deferUpdate()

                    if (queue.volume - 10 < 0) return
                    await queue.setVolume(queue.volume - 10)
                    break
                case "queue-back":
                    if (!queue.data?.lastTrack) return button.reply({ embeds: [embeds.ErrorEmbed("There are no previous songs in the queue", "❌")], ephemeral: true })

                    await queue.previous()
                    await button.reply({ embeds: [embeds.SuccessEmbed("Went back to the previous song", emotes.PreviousTrack)] })
                    break
                case "pause-or-resume":
                    await button.deferUpdate()

                    await queue.setPaused(!queue.paused) // If paused then set setPaused(false) !true = false

                    pauseorresume.setLabel(queue.paused ? "Resume" : "Pause")
                    pauseorresume.setEmoji(queue.paused ? emotes.Play : emotes.Pause)

                    await button.message.edit({ components: [row1, row2] })
                    break
                case "queue-skip":
                    await queue.skip()

                    row1.components.forEach(button => { button.setDisabled(true) })
                    row2.components.forEach(button => button.setDisabled(true))

                    await button.message.edit({ components: [row1, row2] })
                    await button.reply({ embeds: [embeds.SuccessEmbed(keywords.SkipSong, emotes.ForwardTrack)] })
                    breaks
                case "volume-up":
                    await button.deferUpdate()
                    
                    if (queue.volume + 10 > 200) return
                    await queue.setVolume(queue.volume + 10)
                    break
                case "queue-shuffle":
                    await queue.shuffle()
                    await button.reply({ embeds: [embeds.SuccessEmbed("Shuffled the queue", emotes.Shuffle)] })
                    break
                case "queue-loop":
                    await button.deferUpdate()

                    queue.setRepeatMode((queue.repeatMode + 1) % 3)

                    const mode = repeatModes[queue.repeatMode]
                    queueloop.setLabel(mode.label).setEmoji(mode.emoji)

                    await button.message.edit({ components: [row1, row2] })
                    break
                case "queue-stop":
                    await queue.stop()

                    row1.components.forEach(button => { button.setDisabled(true) })
                    row2.components.forEach(button => button.setDisabled(true))

                    await button.message.edit({ components: [row1, row2] })
                    await button.reply({ embeds: [embeds.SuccessEmbed("Stopped the queue", emotes.Stop)] })
                    break
                case "queue-clear": 
                    await queue.clearQueue()

                    await button.reply({ embeds: [embeds.SuccessEmbed("Cleared the queue", emotes.Trash)] })
            }
        })
    }
}

async function disableOldButtons(queue) {
    const oldMessage = queue.data.playMessage
        
    const oldRow1 = ActionRowBuilder.from(oldMessage.components[0])
    const oldRow2 = ActionRowBuilder.from(oldMessage.components[1])
    
    oldRow1.components.forEach(button => button.setDisabled(true))
    oldRow2.components.forEach(button => button.setDisabled(true))
    
    await oldMessage.edit({ components: [oldRow1, oldRow2] })
}