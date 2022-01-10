module.exports = {
    name: "skip",

    description: "Skip the current song",

    async execute(message, musicPlayer) {
        if (!message.member.voice.channel) {
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        }

        const serverQueue = musicPlayer.queue.get(message.guild.id);

        if (!serverQueue) return

        serverQueue.connection.dispatcher.end()
    }
}