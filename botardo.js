const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();

var dict = {};

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    try {
        if (!message.content.startsWith(prefix)) return;

        if (message.member.voice.channel == null) {
            message.reply("Conectate PELOTUDO")
            return;
        }

        const commandBdy = message.content.slice(prefix.length);
        const args = commandBdy.split(' ');
        const command = args.shift().toLocaleLowerCase(); //shift revoca el primer item del array

        console.log(args)

        if (command === "ping") {
            for (let a = 0; a < 7; a++) {
                const tiempoTomado = Date.now() - message.createdTimestamp;
                message.reply(`QUE PASA PUT4 QUERÉS QUE TE LA PONGA? ${tiempoTomado} ms`);
            }
            return
        }

        if (command === "add") {
            const numArgs = args.map(x => parseFloat(x)).reduce((counter, v) => counter += v);
            message.reply(`Resultado de la suma: ${numArgs} - pajin`);
            return
        }

        if (command === "button") {
            message.channel.send(`https://es.stackoverflow.com/search?q=${args}`.replace(/,/g, '+'));
            return
        }

        if (command === "song") {
            message.member.voice.channel.join();
            message.channel.send(`https://www.youtube.com/results?search_query=${args}`.replace(/,/g, '+'));
            return
        }

        if (command === "darmoneda") {
            let id = message.member.user.id;

            let money = parseFloat(args[0])
            if (isNaN(money)) {
                message.reply("Pone un numero PELOTUDO")
                return
            }

            if (!(id in dict)) {
                dict[id] = money
                message.reply(`Tienes ${dict[id]} monedas!`);
                return
            }

            dict[id] += money
            message.reply(`Tienes ${dict[id]} monedas!`);
            return
        }

        if (command === "apostar") {
            let id = message.member.user.id;
            
            let money = parseFloat(args[0])
            if (isNaN(money)) {
                message.reply("Pone un numero PELOTUDO")
            }
            
            dict[id] -= money

            message.channel.send(`Apostaste! Te quedan ${dict[id]} monedas!`);
            return
        }

    } catch (err) {
        console.log(err);
    }
});

client.login(token)