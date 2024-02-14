module.exports = {
	name: "play",
	description: "this is a test command",
	async execute(client, interaction) {
		let queue = client.player.createQueue(interaction.guild.id)
		await queue.join(interaction.member.voice.channel)
		let song = await queue.play("ishowspeed shake")
		console.log(song)
	}
}