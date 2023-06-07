const { getAllPlayers } = require("../modules/connection/player/players.js");
const log = require('../modules/log.js');
const fs = require("fs");

class Command {
	constructor(input) {
		this.input = input;
		this.args = input.split(' ');
		this.cmd = this.args[0];
		this.args.shift();

		if(typeof this[this.cmd] == "function") this[this.cmd](...this.args);
	};
	help() {
		console.log(server.helpmsg);
	};
	shutdown() {
		exit();
	};
	eval(code) {
		try {
            console.log(String(eval(code)));
        } catch (e) {
            console.log(e);
        };
	};
	setmodpass(world, password) {
		if(!password) {
			server.databases["modpasswords"].deleteKey(world);
			return;
		};
        server.databases["modpasswords"].setValue(password, world);
	};
	clean() {
		fs.rmSync("./chunkdata/", { recursive: true, force: true });
		fs.rmSync("./logs/", { recursive: true, force: true });
		fs.writeFileSync("./modules/server/modpasswords.json", "");
		fs.writeFileSync("./bans.json", "");
	};
	say(msg) {
		function sendToWorlds(D) {
            for (var gw in server.worlds) {
                var worldCurrent = server.worlds[gw];
                var clientsOfWorld = worldCurrent.clients;
                for (var s = 0; s < clientsOfWorld.length; s++) {
                    clientsOfWorld[s].send(D);
                };
            };
        };
        sendToWorlds("[Server]: " + msg);
	};
	pl() {
		let finalstring = [];
		for(let i in server.plugins) {
			let plugin = server.plugins[i];
			if(plugin.loaded) finalstring.push(server.chalk.green(plugin.name));
			else finalstring.push(server.chalk.red(plugin.name));
		};
		log(`Plugins (${finalstring.length}): ${finalstring.join(', ')}`);
	};
	setrank(id, rank) {
		if(!id || !rank) return;
		var destination = getAllPlayers().filter(item => item.id == id)[0];
		destination.setRank(rank);
	};
};

module.exports = Command;