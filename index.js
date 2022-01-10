// System libs 
const fs = require("fs");

// External libs
const Client = require("./client/Client.js")

// Config 
const { prefix, token } = require("./config.json");

// Discord client
const musicPlayer = new Client();

// Load my commands and then add to my map
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    musicPlayer.commands.set(command.name, command);
}

musicPlayer.on("ready", () => {
    console.log(`Logged in as ${musicPlayer.user.tag}!`);
    console.log(musicPlayer.commands);
});

musicPlayer.on("message", async message => {
    if (!message.content.startsWith(prefix)) return; // Ignore messages that don't have the prefix 

    const rawCommand = message.content.slice(1).split(" ")[0]
    const command = musicPlayer.commands.get(rawCommand) // Search If command exist in the commands map

    try {
        if (command) {
            return command.execute(message, musicPlayer)
        }

        message.channel.send(`Enter a valid command. \nCommands: [${[...musicPlayer.commands.keys()]}]`)
    } catch (error) {
        console.error(error)
        message.channel.send("There was an error trying to execute that command.")
    }
});

musicPlayer.login(token)
