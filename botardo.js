
/* Config */
const { prefix, token } = require("./config.json");

/* Libs */
const Discord = require("discord.js");
const ytdl = require('ytdl-core-discord');

/* Discord client */
const client = new Discord.Client();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
    if (!message.content.startsWith(prefix)) return;

    if (message.content === `${prefix}ping`) {
        return message.channel.send("pong")
    }

    if (message.content.startsWith(`${prefix}play`)) {
        play(message);
        return;
    }
    if (message.content.startsWith(`${prefix}skip`)) {
        skip(message);
        return;
    }
    if (message.content.startsWith(`${prefix}stop`)) {
        stop(message);
        return;
    }

    message.channel.send("You need to enter a valid command!");
});

async function play(message) {
    const SONG_URL = message.content.split(" ")[1];
    
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
    
    let connection = await voiceChannel.join();

    connection.play(await ytdl(SONG_URL), { type: "opus" })
    //const dispatcher = 

    //dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    message.channel.send(`Start playing: **tu musicarda**`);
}

client.login(token)