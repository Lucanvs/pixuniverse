module.exports = (()=>{
	const name = "Per-World PlaceBucket";
	const version = "1.0.0";
    
    let config = new server.ConfigManager(name, {
		main: {
            p: "100",
            s: "2"
        }
	}).config;

    server.pwbucket = config;

	function install() {
		server.events.on("join", function(client) {
			if(client.rank <= 2 && typeof server.pwbucket[client.world] !== 'undefined') client.setPixelBucket(parseInt(server.pwbucket[client.world].p), parseInt(server.pwbucket[client.world].s));
		});
	};
	return {
		install: install,
		name: name,
		version: version
	};
})();