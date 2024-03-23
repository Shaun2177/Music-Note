const { SlashCommandBuilder, ComponentType, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const embeds = require("../handlers/embeds.js")
const emotes = require("../handlers/emotes.js")

const Genius = require("genius-lyrics")
const GeniusClient = new Genius.Client()

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("sadasdasdasd")
        .addStringOption((option) =>
            option.setName("query")
                .setDescription("song name you want to view lyrics for")
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(client, interaction) {
        //* discord-music-player comes with search function, it just takes 3 seconds which is the maximum for an autocomplete
        const query = await interaction.options.getFocused(true).value.replace(/&t=\d+s?(&|$)/g, '')
        if (query == "") return //* Still needed if .setRequired(true)

        const choice = []

        try {
            const result = await GeniusClient.songs.search(query)

            result.forEach(async x => { choice.push({ name: x.fullTitle, value: x.fullTitle }) })
            await interaction.respond(choice)
        } catch (error) {
            console.error(error)
        }
    },
    async execute(client, interaction) {
        // Check if the user is in a a voice channel
        //* If autocomplete was used will be a URL
        const query = interaction.options.getString("query")

        const results = await GeniusClient.songs.search(query)

        const song = results[0]
        if (!song) return interaction.reply({ embeds: [embeds.ErrorEmbed(`There is no song for: \`${query}\``, emotes.X)] })

        const lyrics = await song.lyrics()
        if (!lyrics) return interaction.reply({ embeds: [embeds.ErrorEmbed(`There are no lyrics for song: \`${query}\``, emotes.X)] })

        let currentPage = 0

        const pages = []
        let temp = ''

        lyrics.split(' ').forEach(word => {
            if ((temp + word).length < 1000) {
                temp += ' ' + word
            } else {
                pages.push(temp)
                temp = word
            }
        })

        pages.push(temp)


        const previousButton = new ButtonBuilder().setCustomId('previous').setLabel('Previous').setDisabled(currentPage === 0).setStyle(ButtonStyle.Primary)
        const deleteButton = new ButtonBuilder().setCustomId('delete').setLabel('Delete').setStyle(ButtonStyle.Danger)
        const nextButton = new ButtonBuilder().setCustomId('next').setLabel('Next').setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(
                previousButton,
                deleteButton,
                nextButton
            )

        const embed = new EmbedBuilder()
            .setTitle(song.fullTitle)
            .setDescription(pages[currentPage])

        const message = await interaction.reply({ embeds: [embed], components: [row] })
        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button })

        collector.on('collect', async (interaction) => {
            if (interaction.customId === 'previous') {
                if (currentPage !== 0) {
                    currentPage--
                    embed.setDescription(pages[currentPage])
                    previousButton.setDisabled(currentPage === 0)
                    nextButton.setDisabled(currentPage === pages.length - 1)
                    await interaction.update({ embeds: [embed], components: [new ActionRowBuilder().addComponents(previousButton, deleteButton, nextButton)] })
                }
            } else if (interaction.customId === 'next') {
                if (currentPage < pages.length - 1) {
                    currentPage++
                    embed.setDescription(pages[currentPage])
                    previousButton.setDisabled(currentPage === 0)
                    nextButton.setDisabled(currentPage === pages.length - 1)
                    await interaction.update({ embeds: [embed], components: [new ActionRowBuilder().addComponents(previousButton, deleteButton, nextButton)] })
                }
            } else if (interaction.customId === 'delete') {
                await interaction.message.delete()
                collector.stop()
            }
        })
    }
}