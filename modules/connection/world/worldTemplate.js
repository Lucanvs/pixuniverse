class WorldTemplate {
	constructor(name) {
		this.name = name;
		this.latestId = 1;
		this.motd = "";
		this.maxPlayers = 256;
		this.clients = [];
		this.pixelBucket = server.config.bucket.pixel["user"];
        this.chatBucket = server.config.bucket.chat["user"];
	};
	isFull() {
		return this.clients.length > this.maxPlayers;
	};
	kickAll() {
		for(let i in this.clients) this.clients[i].ws.close();
	};
	setProp(key, value) {
    	this[key] = value;
  	};
};

module.exports = WorldTemplate;