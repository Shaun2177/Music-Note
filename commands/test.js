const { SlashCommandBuilder } = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('add a bunch of random songs'),
	async execute(client, interaction) {
		await interaction.deferReply() // Used for addSong.js

		let queue = client.player.createQueue(interaction.guild.id)
		await queue.join(interaction.member.voice.channel)

		await queue.play("ishowspeed shake", { requestedBy: interaction.user, data: { interaction: interaction, positionInQueue: String(queue.songs.length) }}).catch(err => { return console.log(err) })
		await queue.play("fe!n", { requestedBy: interaction.user, data: { interaction: interaction, positionInQueue: String(queue.songs.length) }}).catch(err => { return console.log(err) })
		await queue.play("my eyes", { requestedBy: interaction.user, data: { interaction: interaction, positionInQueue: String(queue.songs.length) }}).catch(err => { return console.log(err) })
	}
}