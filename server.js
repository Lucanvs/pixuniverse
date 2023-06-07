let starttime = Date.now();
console.log('Loading libraries, please wait...');
const CryptedJSONdb = require("cryptedjsondb");
const log = require('./modules/log.js');
const chalk = require("chalk");
const fs = require("graceful-fs");
const ws = require("ws");
const express = require("express");
const EventEmitter = require("events");
const http = require("http");
log('Loading properties');
var config = require("./config.json");

const app = express();
const httpserver = http.createServer(app);

const fetch = (...args) => import('node-fetch').then(({
    default: fetch
}) => fetch(...args));
log('Loading server modules');
const Plugin = require('./modules/Plugin.js');
const Connection = require('./modules/Connection.js');
const UpdateClock = require("./modules/server/UpdateClock.js");
const manager = require("./modules/server/manager.js");
const ConfigManager = require("./modules/server/ConfigManager.js");
const BansManager = require("./modules/server/BansManager.js");
const proxy_check = require('proxycheck-node.js');
const Command = require("./modules/command.js");
var wss;
var terminatedSocketServer = false;

log('Starting OWOP server on *:' + config.port);

global.server = {
    cbans: {},
    chalk,
	bans: require("./bans.json"),
    worlds: [],
    config,
    updateClock: new UpdateClock(),
    manager,
    events: new EventEmitter(),
    plugins: [],
    ConfigManager,
    bansManager: new BansManager(),
    players: require("./modules/connection/player/players.js"),
    antiProxy: new proxy_check({
        api_key: process.env.antiProxyKey
    }),
    api: app,
    loadtook: 0,
	databases: {}
};

const modpasswords = new CryptedJSONdb('./modules/server/modpasswords.json', process.env.databaseKey);
server.databases["modpasswords"] = modpasswords;

setInterval(() => {
    config = require("./config.json");
    server.config = config;
}, 2500);

server.helpmsg = `/shutdown - Closes the server
/eval <code> - Evaluates the given code
/setmodpass <world> <pass> - Per world mod logins
/say <msg> - Say message globally
/pl - List of plugins
/setrank <id> <rank> - Set player rank`;

if(config.ignoreErrors) {
    process.on('uncaughtException', function(ex) {
        console.log(ex)
    });
};

function followSyntax(plugin) {
    if(typeof plugin.name == "string" &&
        typeof plugin.version == "string" &&
        typeof plugin.install == "function") return true;
    else return false;
};
function timeConverter(seconds) {
    let minutes = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);
    let hours = Math.floor(minutes / 60);
    minutes %= 60;
    let days = Math.floor(hours / 24);
    hours %= 24;
    let milliseconds = Math.floor((seconds % 1) * 1000);

    return `${days ? `${days}d ` : ""}${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${sec}s${milliseconds ? ` ${milliseconds}ms` : ""}`;
};
function loadPlugins() {
    let folder = 'plugins';
    fs.readdirSync(`./${folder}/`).forEach(file => {
		if(!file.endsWith(".js")) return;
        if(!file.startsWith("-")) {
            let plugin = require(`./${folder}/` + file);
            log(`[${plugin.name}] Loading ${plugin.name} v${plugin.version}`);
            plugin.loaded = true;
            plugin.filename = file;
            if(followSyntax(plugin)) {
                let start = Date.now();
                plugin.install();
                let end = Date.now();
                plugin.took = end - start;
                log(`[${plugin.name}] Enabling ${plugin.name} v${plugin.version} took ${timeConverter(plugin.took / 1000)}`);

                if(typeof plugin.onload == 'function') plugin.onload();
                server.plugins.push(new Plugin(plugin));
            } else {
                plugin.filename = file;
                plugin.loaded = false;
                let ex = 'Doesn\'t follow syntax';
                log(`Could not load '${folder}/${plugin.filename}' in folder '${folder}'\n${ex}`, 1);
                server.plugins.push(new Plugin(plugin));
            };
        } else {
            let plugin = require(`./${folder}/` + file);
            plugin.loaded = false;
            server.plugins.push(new Plugin(plugin));
		};
    });
};
loadPlugins();
function createWSServer() {
    wss = new ws.Server({
        server: httpserver
    });
    wss.on("connection", async function(ws, req) {
        let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress).split(",")[0].replace('::ffff:', '');
        if(config.AntiBanBypass && !req.headers['origin'].startsWith("https://ywop.scar17off.repl.co")) {
            ws.close();
        };
        if(terminatedSocketServer) {
            ws.send(config.closeMsg)
            ws.close();
        };
        if(server.bansManager.checkIfIsBanned(ip)) {
            let ban = server.bansManager.bans[ip]
            if(!isNaN(ban.duration)) {
                let banString = server.bansManager.generateString(server.bansManager.banEndsAfter(ip))
                ws.send(`You are temporarily banned! \nReason: ${ban.reason}\n${server.config.messages.unbanMessage}`);
            } else {
                ws.send(`You are permanently banned!\nReason: ${ban.reason}\n${server.config.messages.unbanMessage}`);
            }
            ws.close();
            return;
        };
        if(server.config.maxConnections > 0) {
            if(server.players.getAllPlayers().length >= server.config.maxConnections) {
                ws.send("Reached max connections limit")
                ws.close();
                return;
            };
        };
        if(server.config.maxConnectionsPerIp > 0) {
            if(server.players.getAllPlayersWithIp(ip).length >= server.config.maxConnectionsPerIp) {
                ws.send("Reached max connections per ip limit")
                ws.close();
                return;
            };
        };
        if(config.antiProxy.status == "on" || config.antiProxy.status == false) {
            let result = await server.antiProxy.check(ip, {
                vpn: server.config.antiProxy.vpnCheck,
                limit: server.config.antiProxy.limit
            });
            if(result.status == "denied" && result.message[0] == "1") {
                console.log(server.chalk.red("Check your dashboard the queries limit reached!"))
            };
            if(result.error || !result[ip]) return;
            if(result[ip].proxy == "yes") {
                ws.close();
            };
        };
        if(config.CountryBan) {
            let cbans = server.cbans;
            fetch('https://ipapi.co/' + ip + '/json/').then(i => i.json()).then(i => {
                if(cbans.hasOwnProperty(i.country_name) == true) {
                    server.bansManager.addBanIp(ip, "Banned by CB", 60);
                    ws.close();
                };
            });
        };

        new Connection(ws, req);
    });

    httpserver.listen(config.port, () => {
        server.loadtook = Date.now() - starttime;
        log(`Done loading in ${timeConverter(server.loadtook / 1000)}! For help, type "/help"`);
        log('Query running on 0.0.0.0:' + config.port);
    });
};
var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

if(process.platform === "win32") {
    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
};
async function exit() {
    console.log("Exiting...");
    for(var w in server.worlds) {
        var world = server.worlds[w];
        for(var c = 0; c < world.clients.length; c++) {
            var client = world.clients[c];
            client.send(config.messages.closeMsg);
        };
    };
    await server.manager.close_database();
    process.exit();
};
process.on("SIGINT", exit)
process.on("beforeExit", exit);
rl.on("line", function(d) {
    var msg = d.toString().trimLeft().trimRight();
    if(terminatedSocketServer) return;
	if(msg.startsWith('/')) msg = msg.replace('/', '');
    new Command(msg);
});
createWSServer(); // old: beginServer();