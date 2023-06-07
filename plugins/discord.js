module.exports = (() => {
    const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
    let name = "Discord Gateway";
    let version = "1.0.5";

    function install() {
        let config = new server.ConfigManager(name, {
            guildId: "1052691436384026655",
            channelId: {
                "1069763467537551381": "main"
            },
            prefix: "y!",
			allowPings: false
        }).config;

        let fs = require("fs");

        const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
        server.discord = bot;

        function onlyLetters(str) {
            let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            let newString = "";

            for(let i in numbers) {
                newString = str.replaceAll(numbers[i], "");
            };

            return newString;
        };

        function getKeyByValue(object, value) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    if (object[prop] === value)
                        return prop;
                };
            };
            return false;
        };

        function strToBool(str) {
            if(str == "false") return false;
            if(str == "true") return true;
            if(str == "1") return true;
            if(str == "0") return false;
            if(str == "on") return true;
            if(str == "off") return false;
        };

        bot.once("ready", () => {
            console.log('Ready!');
        });

		server.events.on("chat", function(client, msg) {
      		var channelId = getKeyByValue(config.channelId, client.world);
      		if(!channelId) return;
      		let before = client.before.replace(/<(?:alt=("|')(.+?)\1|.|\n)+>/gm, "$2");
			if(!config.allowPings) before = client.before.replace(/<@([0-9]+)>/g, "{ping}");
      		bot.channels.cache.get(channelId).send(`**${before}:** ${msg}`);
    	});
        
        bot.on("messageCreate", async (message) => {
            if(message.author.bot) return;
            if(message.channel.type === "dm") return;
            let msget = message.toString();
            let args = msget.split(" ");
            if(message.channel.id == getKeyByValue(config.channelId, "main")) {
                server.players.sendToWorld(config.channelId[message.channel.id], `[D] ${message.author.username}: ${message.content}`);
            };
        });
        bot.login(process.env.token);
    }
    return {
        install,
        name,
        version
    }
})()