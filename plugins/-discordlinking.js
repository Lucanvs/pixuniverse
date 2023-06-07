module.exports = (() => {
    const name = "Discord Linking";
    const version = "1.0.0";

    let config = new server.ConfigManager(name, {

    }).config;

    function install() {
		var app = server.api;
        const path = require('path');

        app.get('/auth/discord', (req, res) => {
            return res.sendFile('./scripts/Discord Linking/dashboard.html', {
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