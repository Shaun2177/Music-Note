const { ActionRowBuilder } = require("discord.js")

module.exports = {
    name: "queueEnd",
    async execute(client, queue) {
        // Ran when the first song ended and there's no song after it or when every song ended

        const message = queue.data.playMessage
        
        const row1 = ActionRowBuilder.from(message.components[0])
        const row2 = ActionRowBuilder.from(message.components[1])
        
        row1.components.forEach(button => button.setDisabled(true))
        row2.components.forEach(button => button.setDisabled(true))
        
        await message.edit({ components: [row1, row2] })
    }
}