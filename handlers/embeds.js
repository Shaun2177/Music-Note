const { EmbedBuilder } = require("discord.js")
const keywords = require("../handlers/keywords.js")

function createEmbed(color, description, emoji) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setFooter({ text: keywords.MadeBy })
        .setDescription(`${emoji ? `${emoji} | ` : ""}${description}`)

    return embed
}

module.exports = {
    ErrorEmbed: (description, emoji) => createEmbed("FC3838", description, emoji),
    SuccessEmbed: (description, emoji) => createEmbed("33FF5C", description, emoji),
    BlurpleEmbed: (description, emoji) => createEmbed("5865F2", description, emoji),
    CustomColor: (description, emoji) => createEmbed(color, description, emoji)
}