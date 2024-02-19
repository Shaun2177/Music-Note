const embeds = require("../handlers/embeds.js")
const keywords = require("../handlers/keywords.js")
const emotes = require("../handlers/emotes.js")

module.exports = async function getQueue(client, interaction) {
    if (!client) return console.log("[GETQUEUE]: Client is undefined")
    if (!interaction) return console.log("[GETQUEUE]: Interaction is undefined")

    let queue
    try {
        queue = client.player.getQueue(interaction.guild.id)
    } catch (e) {
        return console.log(`[GETQUEUE]: There was an error getting the queue:\n${e}`)
    }

    if (!queue?.songs || queue.songs.length == 0) { 
        //! Don't move the return to the same line
        try {
            await interaction.reply({ embeds: [embeds.ErrorEmbed(keywords.NothingPlaying, emotes.X)], ephemeral: true })
        } catch (e) {
            console.log(`[GETQUEUE]: There was an error trying to reply:\n${e}`)
        }
        return
    }

    return queue
}