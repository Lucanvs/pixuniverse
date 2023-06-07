module.exports = (() => {
	const name = "Admin Panel";
	const version = "1.0.0";

    let config = new server.ConfigManager(name, {
        
    }).config;

	function install() {
		var app = server.api;

		app.get('/admin', (req, res) => {
			return res.sendFile('./scripts/Admin Panel/admin.html', {
                root: '.'
            });
		});
	};
	return {
		install: install,
		name: name,
		version: version
	};
})();