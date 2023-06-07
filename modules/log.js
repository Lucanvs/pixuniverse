const chalk = require('chalk');
const fs = require('graceful-fs');
const config = require('../config.json');
if(!config.isReplit) {
    chalk.blue = chalk.blueBright;
    chalk.red = chalk.redBright;
    chalk.green = chalk.greenBright;
    chalk.yellow = chalk.yellowBright;
    chalk.magenta = chalk.magentaBright;
};

Date.prototype.today = function () { 
    return ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ this.getFullYear();
};
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

function checkForFile(fileName, callback) {
    fs.exists(fileName, function(exists) {
        if(exists) {
            callback();
        } else {
            fs.writeFile(fileName, '', {flag: 'wx'}, function(err, data) {
                callback();
            });
        };
    });
};

function writeLog(msg) {
	let dt = new Date();
	let path = './logs/' + dt.today() + '.log';
	msg = msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
	checkForFile(path, () => {
		fs.appendFileSync(path, msg + '\n');
	});
};

function log(message, level) {
	if(!level) level = 0;
	let dt = new Date();
	let msg = '';
	switch(level) {
		case 0:
			msg = chalk.blue('[' + dt.timeNow() + ' INFO]: ') + chalk.white(message);
			break;
		case 1:
			msg = chalk.red('[' + dt.timeNow() + ' ERROR]: ') + chalk.white(message);
			break;
		case 2:
			msg = chalk.green('[' + dt.timeNow() + ' MSG]: ') + chalk.white(message);
			break;
		case 3:
			msg = chalk.yellow('[' + dt.timeNow() + ' WARN]: ') + chalk.white(message);
			break;
		case 4:
			msg = chalk.magenta('[' + dt.timeNow() + ' CMD]: ') + chalk.white(message);
			break;
	};
	msg = msg.replaceAll(process.env.adminlogin, "***");
	console.log(msg);
	// writeLog(msg);
};

module.exports = log;