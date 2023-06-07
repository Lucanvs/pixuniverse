// needs to be fixed
/*
    const compress_data_to = require("./compressData.js");
const templates = require("./templates.json");
let a = 0;

function getTile(worldName, tileX, tileY) {
	var tile = server.manager.get_chunk(worldName, tileX, tileY);
	if (!tile) {
		tile = new Uint8Array(16 * 16 * 3);
		for (var i = 0; i < 16 * 16 * 3; i++) {
            if(!templates[worldName]) tile[i] = 255;
            else {
                tile[i + a] = templates[worldName][a];
            };
            a++;
            if(a == 3) a = 0;
		};
	};
	var tileProtect = server.manager.chunk_is_protected(worldName, tileX, tileY);
	return compress_data_to(tile, tileX, tileY, tileProtect);
};
module.exports = getTile;
*/
const compress_data_to = require("./compressData.js")
function getTile(worldName, tileX, tileY) {
	var tile = server.manager.get_chunk(worldName, tileX, tileY);
	if (!tile) {
		tile = new Uint8Array(16 * 16 * 3);
		for (var i = 0; i < 16 * 16 * 3; i++) {
			tile[i] = 255;
		}
	}
	var tileProtect = server.manager.chunk_is_protected(worldName, tileX, tileY)
	return compress_data_to(tile, tileX, tileY, tileProtect)
}
module.exports = getTile