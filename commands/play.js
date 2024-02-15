const { SlashCommandBuilder } = require('discord.js')
const { Utils } = require("discord-music-player")
const yt = require("youtube-sr").default

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Play a song from a query or URL')
		.addStringOption((option) =>
			option.setName('query')
				.setDescription('Enter the song name or URL')
				.setRequired(true)
				.setAutocomplete(true)),
	async autocomplete(client, interaction) {
		//! discord-music-player comes with search function, it just takes 3 seconds which is the maximum for an autocomplete
		const query = await interaction.options.getFocused(true).value.replace(/&t=\d+s?(&|$)/g, '')
		if (query == "") return // Still needed if .setRequired(true)

		const choice = []
		try {
			const result = await yt.search(query, { safeSearch: false, limit: 5 })
			result.forEach(x => {
				choice.push({ name: x.title, value: x.url })
			})
			await interaction.respond(choice)
		} catch (error) {
			console.error(error)
		}
	},
	async execute(client, interaction) {
		// console.log(focusedOption)
		// let queue = client.player.createQueue(interaction.guild.id)
		// await queue.join(interaction.member.voice.channel)
		// console.log(interaction.member.voice.channel)
		// let song = await queue.play(args.join('eminem godzilla')).catch(err => {
		//     console.log(err)
		//     if(!guildQueue)
		//         queue.stop()
		// })

		// console.log(await Utils.search("eminem godzilla", { requestedBy: interaction.user }, queue, 10))
	}
}