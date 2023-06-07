### To clean cache and chunkdata type `clean` in the console.
### If you're about to modify or host this server, please follow this requirements:

## ENV Variables:
adminlogin / password for /adminlogin command
<br>
antiProxyKey / get key here: proxycheck.io
<br>
captchaBypass / bypass password for captcha
<br>
captchaKey / get key here https://www.google.com/recaptcha/about/
<br>
modlogin / global modlogin
<br>
token / token for discord gateway bot
<br>
databaseKey / Secret key for every database in the server. (bans)
## Plugins
plugins with '-' on start or without '.js' at end will be ignored
<br>
antiproxy-chatmode.js / antiproxy chatmode
<br>
api.js / hosts /api page on your server
<br>
discord.js / discord gateway
<br>
pwbucket.js / per-world placebucket
<br>
discordlinking.js /	discord integration system
<br>

## CHANGE THIS (IMPORTANT!):
<br>
/client/index.html:837 (Origin)
<br>
/client/app.js:2433 (WS URL)
<br>
/plugins/Discord Gateway/config.json (CHANNEL ID, GUILD ID)
<br>

## Plugin API
### The server has a plugin system and a special API for it.
#### Server events
`requestChunk` [Client, x, y]
<br>
`protectChunk` [Client, tileX, tileY, protected]
<br>
`chat` [Client, message]
<br>
`newWorld` [WorldTemplate]
<br>
`savedWorlds` []
<br>
`command` [Client, command, args]

## Screenshots
![Console](https://i.imgur.com/yKhiGcI.png)
<br>
![Game](https://i.imgur.com/KyUFrez.png)