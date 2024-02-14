module.exports = {
    name: "songAdd",
    execute(client, queue, song) {
        console.log("Song added")
        console.log(queue)
        console.log(song) 
    }
}