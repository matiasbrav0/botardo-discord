const ytdl = require("ytdl-core-discord");
const ytsearch = require('youtube-search-without-api-key');

module.exports = {
    name: "play",

    description: "Play a song in your channel",

    play: async function (musicPlayer, guild, song) {
        const serverQueue = musicPlayer.queue.get(guild.id);

        if (!song) {
            //serverQueue.voiceChannel.leave();
            musicPlayer.queue.delete(guild.id);
            return null
            //return serverQueue.textChannel.send("Bye bye larva!");
        }

        try {
            const dispatcher = serverQueue.connection
                .play(await ytdl(song.url), { type: "opus" })
                .on("finish", () => {
                    serverQueue.songs.shift();
                    module.exports.play(musicPlayer, guild, serverQueue.songs[0]);
                })
                .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(1);

            serverQueue.textChannel.send(`Start playing: ${song.title}`);
        } catch (error) {
            throw (error);
        }
    },

    async execute(message, musicPlayer) {
        // Permissions and validations
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.channel.send(
                "You need to be in a voice channel to play music!"
            );
        }

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
            return message.channel.send(
                "I need the permissions to join and speak in your voice channel!"
            );
        }

        // If a song url or a song to search?
        let songURL
        if (!message.content.includes("://")) {
            let videoInfo = await ytsearch.search(message.content)
            songURL = videoInfo[0].url
        } else {
            songURL = message.content.split(" ")[1];
        }

        // Get info from youtube of my song
        const songInfo = (await ytdl.getInfo(songURL)).videoDetails;
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        }

        const serverQueue = musicPlayer.queue.get(message.guild.id);
        if (serverQueue) {
            serverQueue.songs.push(song);
            return message.channel.send(`${song.title} has been added to the queue!`)
        }

        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: []
        }

        musicPlayer.queue.set(message.guild.id, queueConstruct);

        queueConstruct.songs.push(song);

        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            module.exports.play(musicPlayer, message.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.log(error);
            return message.channel.send(error);
        }
    }
}
