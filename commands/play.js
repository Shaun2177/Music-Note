const { SlashCommandBuilder } = require('discord.js')
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
		//* discord-music-player comes with search function, it just takes 3 seconds which is the maximum for an autocomplete
		const query = await interaction.options.getFocused(true).value.replace(/&t=\d+s?(&|$)/g, '')
		if (query == "") return //* Still needed if .setRequired(true)

		const choice = []
		try {
			const result = await yt.search(query, { safeSearch: false, limit: 5 })
			result.forEach(x => { choice.push({ name: x.title, value: x.url }) })
			await interaction.respond(choice)
		} catch (error) {
			console.error(error)
		}
	},
	async execute(client, interaction) {
		await interaction.deferReply() // Used for addSong.js

		// Check if the user is in a a voice channel
		//* If autocomplete was used will be a URL
		const query = interaction.options.getString("query")

		let queue = client.player.createQueue(interaction.guild.id)
		await queue.join(interaction.member.voice.channel)

		await queue.play(query, { requestedBy: interaction.user, data: { interaction: interaction, positionInQueue: String(queue.songs.length) }}).catch(err => { return console.log(err) })
	}
}