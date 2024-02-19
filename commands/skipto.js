const embeds = require("../handlers/embeds.js")
const emotes = require("../handlers/emotes.js")
const getQueue = require("../utils/getQueue.js")
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription('Skip the a certain song in the queue')
        .addIntegerOption((option) => 
            option.setName("song")
                .setDescription("Index or name of the song in the queue")
                .setRequired(true)
				.setAutocomplete(true)),
    async autocomplete(client, interaction) {
        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue?.songs || queue.songs.length == 0) return

		const choice = []
        try {
            queue.songs.forEach((x, index) => {                 
                if (index == 0 || index > 24) return // If it's the current song or more than 25 songs
                let positionInQueue = String(index)
                choice.push({ name: `${positionInQueue}. ${x.name}`, value: positionInQueue })
            })
            await interaction.respond(choice)
        } catch (error) {
            console.error(error)
        }
    },
    async execute(client, interaction) {
        const queue = await getQueue(client, interaction)
        if (!queue) return

        const songIndex = interaction.options.getInteger("song")
        if (songIndex <= 0 || songIndex >= queue.songs.length) return interaction.reply({ embeds: [embeds.ErrorEmbed("Enter a valid song index", emotes.X)], ephemeral: true })
    
        const songToSkipTo = queue.songs[songIndex]
        await queue.skip(songIndex)
        return interaction.reply({ embeds: [embeds.SuccessEmbed(`Skipped to \`${songToSkipTo}\``, emotes.ForwardTrack)] })
    }
}