

var tilechar = [" ", "░░▒▒", "██", "◉", "◌", "◔", "◑", "◕", "▒▒", "▒▒", "  "];
//var tilechar = ["",   "⬛", "🔲", "⏹", "✴", "🕓", "🕒", "🕑", "🕐", "💥", "🔥"];
var textures = [
  ["vanilla", " ", "░░▒▒", "██", "◉", "◌", "◔", "◑", "◕", "▒▒", "▒▒", "  "],
  ["ASCII",   " ", ".'"  , "[]", "4", "4", "3", "2", "1", "00", "de", "  "],
  ["beta mode",   "⬛", "🔲", "⏹", "✴", "🌑🕓", "🌘🕒", "🌗🕑", "🌖🕐", "💥", "🔥"],
  ["CONFUSION",   " ", "??", "??", "??", "!!", "!?", "??", "!!", "  ", "  "],
];

var ePack = "🌽 🍎 😄 🤔 🍐 🅰 🍌 🍇 🍈 🍒 🍑 ⏸ 🅱 🔲 ⚒ 🍅 🍋 🍍"
.split(' ');
var next = 0;

var gmap = [];
var mapToken = Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+"&"+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10);
var preToken = Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+"$"+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10);
var autodelete = false;
var targetChannel = "";
var mapDisplay = "";
var players = [];
var playerData = [];
var started = false;
var logs = [];

var globalMult = 1;
var rVer = "v3.1 α";
var GM_ID = "188350841600606209";//"235565253952405504";
var cNerf = 4;
var updateGS = null;

var hECkYes = false;

function Player(x, y, disp){
  this.x = x;
  this.y = y;
  this.i = disp;
  this.dir = "";
  this.dirB = "";
  this.e = ePack[next];
  this.draw = function(e){
    return e ? this.e : disp;
  }
}
function pData(uID, uNA, uNI, userD_ID){
  this.ID = uID;
  this.NA = uNA;
  this.PT = 0;
  this.DIR = "";
  this.NI = uNI;
  this.uID = userD_ID;
  this.e = ePack[next];
  next = (next + 1) % ePack.length;
}
function listPlayers(sort){
  var output = "";
  switch(sort){
    case 1:
      for(var i = 0; i < playerData.length; i ++){
        output += playerData[i].e + " - " + playerData[i].NI + " : " + playerData[i].NA + "\n";
      }
      break;
    case 2:

      break;
  }
  return output;
}
function Tile(t){
  this.type = t;
  this.dmg = 0;
  this.player = "";
  this.draw = function(){
    return tilechar[t];
  }
  this.solid = function(){
    return (this.type !== 0 && this.player === "");
  }
}
function bTile(k, placerID){
  this.type = 4;
  this.dmg = 0;
  this.player = "";
  this.pNA = k;
  this.pow = data.users.pow[placerID];
  this.p_uID = placerID;
  this.draw = function(){
    this.dmg ++;
    if(this.dmg > 2){
      this.type ++;
    }
    return tilechar[this.type];
  }
  this.solid = function(){
    return true;
  }
}
function dTile(k, placerID){
  this.type = 9;
  this.dmg = 0;
  this.player = "";
  this.pNA = k;
  this.p_uID = placerID;
  this.draw = function(){
    this.dmg ++;
    if(this.dmg > 2){
      this.type ++;
    }
    return tilechar[9];
  }
  this.solid = function(){
    return true;
  }
}
function replaceD(i, j, k, kID, override){
	if(i < 1 || i > gmap.length-2 || j < 1 || j > gmap[i].length-2){
		return;
	}
  if(gmap[i][j].type !== 2 || override){
    if(gmap[i][j].type === 4 && !override) return;
    gmap[i][j] = new dTile(k, kID);
  }
}
function eTile(pl, e){
  this.type = (pl === "") ? 0 : 1;
  this.dmg = 0;
  this.player = pl;
  this.e = e;
  this.draw = function(){
    return tilechar[0];
  }
}
function addLog(txt){
  logs.push(txt);
  console.log("Event @ " + new Date().getTime() + " :: " + txt);
}
function showLogs(limit){
  var output = "";
  for(var i = Math.max(logs.length - limit, 0); i < logs.length; i ++){
    output += logs[i] + "\n";
  }
  return output;
}
function newMap(length, height){
  gmap = [];
  for(var i = 0; i < height; i ++){
    gmap.push([]);
    for(var j = 0; j < length; j ++){
      if(i === 0 || i === height-1 || j === 0 || j === length-1){
        gmap[i].push(new Tile(2));
      }else{
        if(Math.random() > 0.5){
          if(Math.random() > 0.6){
            gmap[i].push(new Tile(2));
          }else{
            gmap[i].push(new Tile(0));
          }
        }else{
          gmap[i].push(new Tile(1));
        }
      }
    }
  }
  mapToken = Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+"&"+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10);
  preToken = Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10)+"$"+Math.random().toString(36).substring(2, 10)+Math.random().toString(36).substring(2, 10);
}
function convertEmoji(emoji){
  var stringify = [["◀", 1], ["▶", 3], ["🔼", 0], ["🔽", 2], ["💣", 4]];
  for(var i in stringify){
    if(stringify[i][0] === emoji){
      return stringify[i][1];
    }
  }
}

function saveJSON(reason){
  fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8', function readFileCallback(err, data){
    if (err){
      console.log(err);
    } else {
      console.log("Saved @ " + new Date().getTime() + " [] " + reason);
}});
}

//Clearance level, 0 - none, 1 - manager, 2 - admin, 3 - GM, 4 - self
//Note: Level [0] clearance doesn't include people who are "softbanned from game".
var cmd = [
  {name: "~$init", req: 1, DM: false, args: 1},
  {name: "~$open", req: 1, DM: false, args: 1},
  {name: "~$close", req: 1, DM: false, args: 1},
  {name: "~$exit", req: 3, DM: false, args: 1},
  {name: "~$help", req: 0, DM: true, args: 1},
  {name: "~$version", req: -1, DM: true, args: 1},
  {name: "~$credits", req: -1, DM: true, args: 1},
  {name: "~$updates", req: -1, DM: true, args: 1},
  {name: "~$how2play", req: 0, DM: true, args: 1},
  {name: "~$clearance", req: 0, DM: false, args: 1},
  {name: "~$logs", req: 0, DM: true, args: 1},
  {name: "~$kick", req: 2, DM: false, args: 2},
  {name: "~$ban", req: 2, DM: false, args: 3},
  {name: "~$unban", req: 2, DM: false, args: 2},
  {name: "~$join", req: 0, DM: false, args: 1},
  {name: "~$joinf", req: 3, DM: false, args: 0},
  {name: "~$start", req: 1, DM: false, args: 1},
  {name: "~$begin", req: 1, DM: false, args: 1},
  {name: "~$say", req: 0, DM: false, args: 2},
  {name: "~$shop", req: 0, DM: true, args: 0},
  {name: "~$buy", req: 0, DM: true, args: 1},
  {name: "~$collect", req: 0, DM: true, args: 0},
  {name: "~$daily", req: 0, DM: true, args: 0},
  {name: "~$info", req: 0, DM: true, args: 0},
  {name: "~$stats", req: 0, DM: false, args: 0},
  {name: "~$leaderboard", req: 0, DM: true, args: 0},
  {name: "~$respect", req: 0, DM: false, args: 1},
  {name: "~$top", req: 0, DM: true, args: 0},
  {name: "~$ranks", req: 0, DM: true, args: 0},
  {name: "~$challenge", req: 0, DM: true, args: 0},
  {name: "~$forceverify", req: 3, DM: false, args: 1},
  {name: "~$suspend", req: 3, DM: true, args: 1},
  {name: "~$doot", req: 3, DM: true, args: 2},
  {name: "~$modify", req: 3, DM: true, args: 2},
  {name: "~$fix", req: 3, DM: true, args: 1},
  {name: "~$force", req: 3, DM: true, args: 0},
  {name: "~$textures", req: 1, DM: true, args: 1},
  {name: "~$update", req: 3, DM: true, args: 0},
  {name: mapToken, req: 4, DM: false, args: 1},
  {name: preToken, req: 4, DM: false, args: 1}];

function compare(a,b) {
  if (a.val < b.val){
    return -1;
  }
  if (a.val > b.val){
    return 1;
  }
  return 0;
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var Discord = require('discord.js');
var fs = require('fs');
var dataFile = '/home/ubuntu/workspace/bots/data/DNPVdata.json';
var data = JSON.parse(fs.readFileSync(dataFile));
var client = new Discord.Client();

var VERIFIED = [true, true, true, true, true, true];
var texture = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var servers = ["280736807413350401", "210923273553313792", "334149498324516866", "356259816945221634", "222123485336567808", "294115797326888961"];
var bonus = [];

client.login("rush D");
client.on("ready", () => {
  console.log('Logged in as %s - %s\n', client.user.username, client.user.id);
  client.user.setPresence({ game: { name: '~$help', type: 0} });
});
client.on("message", (message) => {
  /*if(message.author.id === "322826064705355786" && message.content.startsWith("~$")){
    message.channel.send("⛔");
    return;
  }*/
  if(message.guild === null){ return; }
  if(message.author.id === "284799940843274240" && message.guild === null){
    return;
  }
  if(message.author.bot && message.author.id !== client.user.id){return;}
  if(message.author.id === GM_ID){
    
    if(message.content === "."){
      message.channel.send(message.content);
    }
  }
  
  var sID = null;
  if(message.guild !== null){
    for(var i = 0; i < servers.length; i ++){
      if(servers[i] === message.guild.id){
        sID = i;
      }
    }
    if(sID === null){
      sID = servers.length;
      VERIFIED.push(false);
      servers.push(message.guild.id);
      texture.push(0);
    }
    if(!VERIFIED[sID]){
      if(message.content.toLowerCase() === "~$forceverify" && message.author.id === GM_ID){
        setTimeout(function(){
          message.channel.send("`SUCCESS`: Server has been verified.");
          VERIFIED[sID] = true;
        }, 1500);
      }
      let bannedRole = message.guild.roles.find("name", "Banned");
      let managerRole = message.guild.roles.find("name", "Game Manager");
      if(message.content.replace("-", "~").startsWith("~$")){
        if(!message.guild.me.hasPermission("SEND_MESSAGES")){
          message.author.send("`ERR`: Missing permission: `SEND_MESSAGES`");
        }else if(!message.guild.me.hasPermission("MANAGE_MESSAGES")){
          message.channel.send("`ERR`: Missing permission: `MANAGE_MESSAGES`");
        }else if(!message.guild.me.hasPermission("EMBED_LINKS")){
          message.channel.send("`ERR`: Missing permission: `EMBED_LINKS`");
        }else if(!message.guild.me.hasPermission("ADD_REACTIONS")){
          message.channel.send("`ERR`: Missing permission: `ADD_REACTIONS`");
        }else{
          if(bannedRole === null){
            message.channel.send("`WARN`: Missing role: `Banned`");
          }else if(bannedRole.calculatedPosition >= message.guild.me.highestRole.calculatedPosition){
            message.channel.send("`WARN`: Cannot apply `Banned` role to members");
          }
          if(managerRole === null){
            message.channel.send("`WARN`: Missing role: `Game Manager`");
          }
          if(!message.guild.me.hasPermission("MANAGE_ROLES")){
            message.channel.send("`WARN`: Missing permission: `MANAGE_ROLES`");
          }
          setTimeout(function(){
            message.channel.send("`SUCCESS`: Server has been verified.");
			//message.channel.send({BBB});
          }, 1500);
          VERIFIED[sID] = true;
        }
      }
      if(!VERIFIED[sID]){
        return;
      }
    }
  }
  switch(message.content){
    case mapToken:
      targetChannel = message.channel.id;
      mapDisplay = message;
      setTimeout(function(){message.react("◀");}, 1000);
      setTimeout(function(){message.react("▶");}, 2000);
      setTimeout(function(){message.react("🔼");}, 3000);
      setTimeout(function(){message.react("🔽");}, 4000);
      setTimeout(function(){message.react("💣");}, 5000);
      setTimeout(function(){message.react("👋");}, 6000);
      setTimeout(function(){message.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);}, 6500);
      break;
    case preToken:
      message.edit("[Initializing]\n\nAutodelete *disabled*.");
      setTimeout(function(){message.edit("**[Initialization complete.]**\n\nAutodelete **enabled**."); autodelete = true;}, 500);
      setTimeout(function(){message.delete();}, 15000);
      setTimeout(function(){ message.channel.send(mapToken); }, 1000);
      break;
  }
  let arg = message.content.split(" ");
  for(var i = 0; i < arg.length; i ++){arg[i] = arg[i].replaceAll("\n", "").substring(0, 100);}
  let reqClearance = null;
  let allowDM = null;
  let reqArgs = null;
  let userClearance = 0;
  for(var i in cmd){
    if(cmd[i].name === arg[0].toLowerCase().replace("-", "~")){
      reqClearance = cmd[i].req;
      allowDM = cmd[i].DM;
      reqArgs = cmd[i].args;
      break;
    }
  }
  if(message.guild === null && !allowDM){
    return;
  }
  if(message.guild !== null){
    var bannedRole = message.guild.roles.find("name", "Banned");
    var managerRole = message.guild.roles.find("name", "Game Manager");

    if(bannedRole !== null){
      if(message.member.roles.has(bannedRole.id)){userClearance = -1;}
    }
    if(managerRole !== null){
      if(message.member.roles.has(managerRole.id)){userClearance = 1;}
    }else{
      userClearance = 1;
    }
    if(message.member.hasPermission("ADMINISTRATOR")){userClearance = 2;}
  }
  if(client.user.id === message.author.id){userClearance = 4;}else
  if(message.author.id === GM_ID){userClearance = 3;}
  if((message.guild === null && !allowDM) || reqClearance === null || userClearance < reqClearance || arg.length < reqArgs){
    if(reqClearance !== null){

      if(userClearance < reqClearance){
        if(reqClearance < 3) return;
        message.channel.send(`You do not have neccessary clearance to execute the command: __**${arg[0]}**__\n[current: __${userClearance}__] [required: **__${reqClearance}__**]`);
      }else{
        message.channel.send(`The command \`${arg[0]}\` is unusable in a DM channel.`);
      }
    }
    if(autodelete && targetChannel === message.channel.id && message.content !== mapToken){
      message.delete();
    }
  }else{
    let targetuser = message.author;
    let pID = null; //IN GAME ID
    let uID = null; //USER ID (save file stuff)
    let nick = message.author.username[0] + message.author.id[15];
    for(var i = 0; i < playerData.length; i ++){
      if(playerData[i].ID === message.author.id){
        pID = i;
      }
    }
    for(var i = 0; i < data.users.id.length; i ++){
      if(message.author.id === data.users.id[i]){
        uID = i;
      }
    }
    if(uID === null){
      uID = data.users.id.length;
      data.users.name.push(message.author.username);
      data.users.id.push(message.author.id);
      data.users.kills.push(0);
      data.users.wins.push(0);
      data.users.played.push(0);
      data.users.bombs_placed.push(0);
      data.users.coin.push(0);
      data.users.pow.push(1);
      data.users.mult.push(1);
      data.users.lastLogin.push(new Date().getTime());
      data.users.lastCollect.push(new Date().getTime()-3000000);
      data.users.collectRate.push(0);
      data.users.rep.push(0);
      data.users.lastRep.push(new Date().getTime());
      if(message.guild === null){
        //message.channel.send("CONGRATS! You have been added to the JSON database! :clap: :clap:")
      }else{
        (message.guild.member(message.author.id)).user.send("CONGRATS! You have been added to the JSON database! :clap: :clap:");
      }
      saveJSON("Add new member: " + message.author.username + " - " + message.author.id);
      
      data.users.name[uID] = message.author.username;
    }
    var influence = Math.ceil((data.users.coin[uID]/10 + data.users.kills[uID] * 1000 + data.users.wins[uID] * 2000 + data.users.played[uID] * 500 + data.users.bombs_placed[uID] * 200) / 250000);
    switch(arg[0].toLowerCase().replace("-", "~")){
      case "~$textures":
        if(textures[parseInt(arg[1])] === undefined || arg.length < 2){
          message.channel.send("```md\n#CURRENT TEXTURE: " + textures[texture[sID]][0] + "``` \n\n`Textures`\n0 - standard\n1 - ASCII\n2 - emoji\n3 - chaos");
        }else{
          message.channel.send("```diff\n! Texture switched to " + textures[parseInt(arg[1])][0] + " !\n```");
          texture[sID] = parseInt(arg[1]);
        }
        break;
      case "~$init":
      case "~$open":
        if(!autodelete){
          addLog(`New match *opened* by __${message.author.username}__.`);
          if(arg[1] > 11 && arg[1] < 25 && arg[2] > 11 && arg[2] < 25){
            newMap(arg[2], arg[1]);
          }else{
            newMap(15, 15);
          }
          message.channel.send(preToken);
          message.delete();
        }else{
          message.channel.send(`<@${message.author.id}>, you cannot open a new game. A game has already started somewhere else.`);
        }
        break;
      case "~$modify":
        let tID = parseInt(arg[1]);
        let delta = parseInt(arg[2]);
        data.users.coin[tID] += delta;
        message.author.send(`Changed ${data.users.name[tID]}'s money by ${delta}`);
        saveJSON(`Changed ${data.users.name[tID]}'coin stats by ${delta}`)
        break;
      case "~$update":
        for(var i = 0; i < data.users.id.length; i ++){
          data.users.lastRep[i] = 0;
          data.users.rep[i] = 0;
        }
        message.react("✅");
        saveJSON("Updated database.");
        break;
      case "~$respect":
        if(arg[1] === undefined){
          message.channel.send({embed: {
          color: 1328233,
          author: {
            name: client.username,
          },
          title: `${message.author.username}'s Respect Stats`,
          description: `Total respect: ${data.users.rep[uID]}\nInfluence: ${influence}`,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: rVer
          }
        }});
          return;
        }
        let tuID = arg[1].replace("<@", "").replace(">", "").replace("!", "");
        for(var i = 0; i < data.users.id.length; i ++){
          if(data.users.id[i] == tuID){
            tuID = i;
          }
        }
        tuID = parseInt(tuID);
        if((data.users.lastRep[uID] + 72000000) <= new Date().getTime()){
          if(data.users.rep[tuID] === undefined || tuID === uID){
            message.channel.send(`⚠ Invalid uID`);
            return;
          }
          data.users.lastRep[uID] = new Date().getTime();
          data.users.rep[tuID] += influence;
          message.channel.send(`<@${data.users.id[tuID]}> was respected by **${message.author.username}**`);
          saveJSON(`<@${data.users.id[tuID]}> was respected by **${message.author.username}**`);
        }else{
          message.channel.send(`⚠ Please wait ${((data.users.lastRep[uID]+72000000-new Date().getTime())/3600000).toFixed(1)} hours before _respecting_ again.`);
        }
        break;
      case "~$close":
        if(autodelete){
          clearInterval(updateGS);
          addLog(`Current match *closed* by __${message.author.username}__.`);
          setTimeout(function(){
            autodelete = false;
            targetChannel = "";
            mapDisplay = "";
            players = [];
            playerData = [];
            started = false;
            message.delete();
            message.channel.send("[Game closed.]\n\nAutodelete *disabled.*");
          }, 2000);
        }else{
          message.channel.send("You cannot close the game now!")
        }
        break;
      case "~$suspend":
        data.users.mult[parseInt(arg[1])] -= 80;
        message.author.send(`Suspended ${data.users.name[parseInt(arg[1])]}'s coin gain`);
        saveJSON(`Suspended ${data.users.name[parseInt(arg[1])]}'s coin gain`);
        message.react("✅");
        break;
      case "~$fix":
        data.users.mult[parseInt(arg[1])] += 80;
        message.author.send(`Fixed ${data.users.name[parseInt(arg[1])]}'s coin gain`);
        saveJSON(`Fixed ${data.users.name[parseInt(arg[1])]}'s coin gain`);
        message.react("✅");
        break;
      case "~$doot":
        data.users.lastCollect[parseInt(arg[1])] += parseFloat(arg[2])*1000*60*60;
        message.author.send(`Increased ${data.users.name[parseInt(arg[1])]}'s lastCollect by ${parseFloat(arg[2])} hours`);
        saveJSON(`Increased ${data.users.name[parseInt(arg[1])]}'s lastCollect by ${parseFloat(arg[2])} hours`);
        message.react("✅");
        break;
      case "~$exit":
        message.channel.send(`[Bot disconnected by <@${message.author.id}>]`);
        message.react("✅");
        autodelete = false;
        setTimeout(function(){
          client.destroy();
          console.log(`Disconnected by ${message.author.username} - ${message.author.id}`);
          setTimeout(function(){process.exit();}, 1000);
        }, 2000);
        message.delete();
        break;
      case "~$help":
        message.author.send({embed: {
          color: 4388063,
          author: {
            name: client.user.username,
            icon_url: client.user.avatarURL
          },
          title: "General Commands",
          description: "~$help : list commands\n~$credits : show credits\n~$updates : show the newest update info\n~$how2play : lists instructions and controls\n~$clearance (uID) : shows your clearance level\n~$logs : shows last 35 logs\n~$info (uID) : shows your user info\n~$top : shows leaderboard\n~$challenge : shows current challenge (if there is one)",
          fields: [{
              name: "Gameplay Commands",
              value: "~$join : join current game\n~$say : send message to chat"
            },
            {
              name: "Economy Commands",
              value: "~$shop : lists shop items\n~$buy [iID] : purchases specified item\n~$collect : get coins\n~$respect [uID] : ~~award rep~~ respect other users"
            },
            {
              name: "Moderator/Manager Commands",
              value: "~$open (width) (height): open new game [**NOTE** Range is 12-24, if outside range, will be defaulted to 15]\n~$start : begin current game\n~$kick [uID] (reason): remove player from current game\n~$close : end current game\n~$textures (tID) : list & change texture"
            },
            {
              name: "Admin Commands",
              value: "~$exit : disconnect bot\n~$ban [uID] [reason]: softban user from using any commands\n~$unban [uID] (reason): remove softban\n\n[] indicates **mandatory** parameter\n() indicates *optional* parameter"
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: "*Some commands are not implemented yet." + rVer
          }
        }});
        break;
      case "~$version":
      case "~$credits":
      case "~$updates":
        message.channel.send({embed: {
          color: 4388063,
          author: {
            name: client.username,
            icon_url: client.user.avatarURL,
          },
          title: "Credits",
          description: "Developed by *Avaκριβές μοντέλο βηρυλλίου#7180*",
          fields: [{
              name: "Contributors",
              value: "*Oh noes!#4565* - helped test out beta mode"
            },
            {
              name: "What's new!",
              value: "- `-$` can be used instead of `~$`\n- You can use :wave: reaction to join games.\n- 'Sudden Death' mode when there are 2 players left (large bombs)." + (data.gMult > 1 ? "\n\nCurrent bonus of +"+(~~(data.gMult*10-10))*10+"% for update （ ^o^）o自自o（^-^ ）" : ""),
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: rVer
          }
        }});
        break;
      case "~$ranks":
      case "~$leaderboard":
      case "~$top":
        var toSort = [];
        let yourself = "";
        let top10 = false;
        for(var i = 0; i < data.users.id.length; i ++){
          let name = data.users.name[i];
          if(name === undefined || name === null) name = "???";
          let toAppend = `${name}${"                                 ".substring(0, 32-name.length)} - ${data.users.id[i]} [] `;
          let pts = Math.round(data.users.coin[uID]/cNerf) + Math.min(data.users.coin[i], 1000000);
          pts += data.users.kills[i] * 1000;
          pts += data.users.wins[i] * 2000;
          pts += data.users.played[i] * 500;
          pts += data.users.bombs_placed[i] * 200;
          //pts += data.cost.mult[data.users.mult[i]-1]*5 + data.cost.bomb[data.users.pow[i]-1]*1.2 + data.cost.cRate[data.users.collectRate[i]-1];
          toAppend += pts.toLocaleString('en');
          if(data.users.id[i] === uID){
            toAppend = `*${toAppend}*`;
            yourself = toAppend;
          }
          toSort.push({val: pts, info: toAppend});
        }
        toSort.sort(compare).reverse();
        let out = "```md\n#TOP 10";
        for(var i = 0; i < 10; i ++){
          if(toSort[i].info.startsWith("*")){
            top10 = true;
          }
          out += "\n" + toSort[i].info;
        }
        if(!top10){
          out += "\n" + yourself;
        }
        message.channel.send(out + "```");
        break;
      case "~$how2play":
        message.channel.send({embed: {
          color: 4387986,
          author: {
            name: client.username,
            icon_url: client.user.avatarURL,
          },
          title: "Instructions",
          description: "Explode all other players before you get exploded. Last one to survive wins!\nUse reactions on the UI to move and set down explosives.\n\nOnce you toggle bomb placement controller (💣), use a directional controller to indicate the direction relative to you to place bomb.",
          fields: [{
              name: "Reaction/Controller Guide",
              value: "◀ Move left\n▶ Move right\n🔼 Move up\n🔽 Move down\n💣 Toggle bomb placement"
            },
          ],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: rVer
          }
        }});
        break;
      case "~$clearance":
        if(arg.length > 1){
          targetuser = message.guild.member(arg[1]);
          userClearance = 0;
          if(client.user.id === targetuser.id){userClearance = 4;}else
          if(targetuser.id === GM_ID){userClearance = 3;}else
          if(targetuser.hasPermission("ADMINISTRATOR")){userClearance = 2;}else
          if(targetuser.roles.has(managerRole)){userClearance = 1;}
          if(message.guild.roles.find("name", "Game Manager") === null){
            userClearance = 1;
          }
        }
        message.channel.send({embed: {
          color: 5128948,
          author: {
            name: client.username,
            icon_url: targetuser.avatarURL,
          },
          title: "Clearance Info",
          description: `<@${targetuser.id}> has a Clearance Level of ${userClearance}.`,
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: rVer
          }
        }});
        break;
      case "~$logs":
        message.channel.send(showLogs(35).substring(0, 1999));
        break;
      case "~$kick":
        if(parseInt(arg[1]) < players.length){
          let i = parseInt(arg[1]);
          addLog(`**${playerData[i].NA}** has been kicked.`);
          gmap[players[i].y][players[i].x] = new eTile(0);
          players.splice(i, 1);
          playerData.splice(i, 1);
          
          mapDisplay.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);
        }
        break;
      case "~$ban":
        targetuser = message.guild.member(arg[1]);
        if(targetuser === null){
          message.channel.send("Invalid userID.");
        }else{
          targetuser.addRole(bannedRole);
          //targetuser.user.createDM();
          targetuser.user.send({embed: {
            color: 16723245,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL,
            },
            title: `You have been __banned__ by **${message.author.username}**.`,
            description: `Reason: ${message.content.substr(25, 299)}`,
            fields: [{
              name: "**Notice**",
              value: "This is not a real ban, rather it is a ban from you using the bot.\nThe effects of this can only be resolved by getting unbanned."
            }],
            timestamp: new Date(),
            footer: {
              text: rVer,
            }
          }});
          message.delete();
        }
        break;
      case "~$challenge":
        if(arg[1] === undefined){
          message.channel.send(data.challenge === "" ? "⚠ | No challenge active at the moment." : data.challenge);
        }else if(data.challenge !== ""){
          if(message.content.replace("~$challenge ", "") === data.challengeAns){
            message.channel.send(`CORRECT!\n\nChallenge solved by <@${message.author.id}>`);
            message.author.send("You gained " + data.challengeRew + " 🔹 for solving the challenge!");
            message.react("✅");
            data.challenge = "";
            data.challengeAns = "";
            data.users.coin[uID] += data.challengeRew;
            saveJSON(`Challenge solved by ${message.author.username} {${message.author.id}} ${uID}`);
          }else{
            message.react("❌");
          }
        }
        break;
      case "~$unban":
        targetuser = message.guild.member(arg[1]);
        if(targetuser === null){
          message.channel.send("Invalid userID.");
        }else{
          targetuser.removeRole(bannedRole);
          targetuser.user.send({embed: {
            color: 11961842,
            author: {
              name: client.user.username,
              icon_url: client.user.avatarURL,
            },
            title: `You have been __unbanned__ by **${message.author.username}**.`,
            description: `Reason: ${message.content.substr(27, 299)}`,
            timestamp: new Date(),
            footer: {
              text: rVer,
            }
          }});
          message.delete();
        }
        break;
      case "~$stats":
      case "~$info":
        targetuser = message.author;
        let pts = Math.round(data.users.coin[uID]/cNerf) + Math.min(data.users.coin[uID], 1000000) + data.users.kills[uID] * 1000 + data.users.wins[uID] * 2000 + data.users.played[uID] * 500 + data.users.bombs_placed[uID] * 200;
        if(arg[1] !== undefined){
          arg[1] = arg[1].replace("<@!", "").replace(">", "").replace("<@", "");
          uID = null;
          targetuser = message.guild.member(arg[1]);
          if(targetuser === null){
            targetuser = {
              id: arg[1],
              username: "undefined",
            };
          }else{
            targetuser = message.guild.member(arg[1]).user;
          }
          for(var i = 0; i < data.users.id.length; i ++){
            if(data.users.id[i] === targetuser.id){
              pts = Math.round(data.users.coin[i]/cNerf) + Math.min(data.users.coin[i], 1000000);
              pts += data.users.kills[i] * 1000;
              pts += data.users.wins[i] * 2000;
              pts += data.users.played[i] * 500;
              pts += data.users.bombs_placed[i] * 200;
              uID = i;
              break;
            }
          }
        }
        if(uID === null){
          message.channel.send(`The user: ${targetuser.username} ( ${targetuser.id} ) does not exist in the JSON database yet.\nTo join the database run any bot command.`);
        }else{
          message.channel.send({embed: {
            color: 4388052,
            author: {
              name: client.username,
              icon_url: client.user.avatarURL
            },
            title: `${targetuser.username}'s Statistics [uID:${uID}]`,
            description: data.users.mult[uID] < 0 ? "[SUSPENDED]" : `Kills: ${data.users.kills[uID].toLocaleString('en')}\nWins: ${data.users.wins[uID].toLocaleString('en')}\nMatches played: ${data.users.played[uID].toLocaleString('en')}\nBombs placed: ${data.users.bombs_placed[uID].toLocaleString('en')}\nScore: ${pts.toLocaleString('en')}\n\nGems: 🔹 ${data.users.coin[uID].toLocaleString('en')}\n💣 Bomb Level: ${data.users.pow[uID]}\nGem Multiplier: x${0.9+(data.users.mult[uID])/10}\nGem Production: 🔹 ${(data.users.collectRate[uID]+1)} per 60sec(s)\n\nRespect: ${data.users.rep[uID].toLocaleString('en')}`,
            timestamp: new Date(),
            footer: {
              icon_url: client.user.avatarURL,
              text: rVer
            }
          }});
        }
        break;
      case "~$shop":
        message.channel.send({embed: {
          color: 4322408,
          author: {
            name: client.username,
            icon_url: client.user.avatarURL
          },
          title: "💰 The Shop",
          description: `<@${message.author.id}>, you have 🔹 ${data.users.coin[uID]}\nPurchase an item by using \`~$buy [itemID]\`.\n\n**NOTE:** Upgrades past the maximum limit are extremely overpriced. ;)`,
          fields: [{
            name: "💣 Bomb Power (ID: 0)",
            value: `Increase explosion distance by 1. (Max 7)\nCurrent: Level ${data.users.pow[uID]}\nCost: 🔹 ${data.cost.bomb[data.users.pow[uID]]}`
          },
          {
            name: "💎 Gem Multiplier (ID: 1)",
            value: `Increase income by 10%. (Max +300%)\nCurrent: x${0.9+(data.users.mult[uID])/10}\nCost: 🔹 ${data.cost.mult[data.users.mult[uID]]}`
          },
          {
            name: "⌛ Production Rate (ID: 2)",
            value: `Increase income by 1. (Max 10)\nCurrent: 🔹 ${(data.users.collectRate[uID]+1)} per 60sec(s)\nCost: 🔹 ${data.cost.cRate[data.users.collectRate[uID]]}`
          }],
          timestamp: new Date(),
          footer: {
            icon_url: client.user.avatarURL,
            text: rVer
          }
        }});
        //data.users.pow[11] = 4;
        //data.users.mult[11] = 20;
        //data.users.cRate[11] = -5;
        break;
      case "~$buy":
        let money = data.users.coin[uID];
        let failed = true;
        let reqFund = 0;
        switch(parseInt(arg[1])){
          case 0:
            reqFund = data.cost.bomb[data.users.pow[uID]];
            if(money >= reqFund){
              data.users.pow[uID] ++;
              data.users.coin[uID] -= reqFund;
              message.channel.send(`<@${message.author.id}> has upgraded their Explosion Distance to ${data.users.pow[uID]}\nRemaining: 🔹 ${data.users.coin[uID]}`);
              failed = false;
            }
            break;
          case 1:
            reqFund = data.cost.mult[data.users.mult[uID]];
            if(money >= reqFund){
              data.users.mult[uID] ++;
              data.users.coin[uID] -= reqFund;
              message.channel.send(`<@${message.author.id}> has upgraded their Gem Multiplier to x${0.9+(data.users.mult[uID])/10}\nRemaining: 🔹 ${data.users.coin[uID]}`);
              failed = false;
            }
            break;
          case 2:
            reqFund = data.cost.cRate[data.users.collectRate[uID]];
            if(money >= reqFund){
              data.users.collectRate[uID] ++;
              data.users.coin[uID] -= reqFund;
              message.channel.send(`<@${message.author.id}> has upgraded their Production Rate to 🔹 ${(data.users.collectRate[uID]+1)} per 60sec(s)\nRemaining: 🔹 ${data.users.coin[uID]}`);
              failed = false;
            }
            break;
          default:
          message.channel.send(`The itemID ${arg[1]} does not exist.\nUse \`~$shop\` to see all items.`);
          failed = false;
        }
        if(failed){
          message.channel.send(`You have insufficient funds. [Current: ${data.users.coin[uID]}] [Required: ${reqFund}]`);
        }else{
          saveJSON("Purchase made by " + message.author.username + " - " + message.author.id);
        }
        break;
      case "~$collect":
      case "~$daily":
        if(Math.min(30, Math.floor((new Date().getTime() - data.users.lastCollect[uID]) / 60000)) > 0){
          data.gMult = Math.max(data.gMult - data.gDecay, 1);
          data.lm += 0.05*data.gMult;
          data.lm2 += 0.05*data.gMult;
          data.lm3 += 0.05*data.gMult;
          let ok = false;
          let amt = data.gMult*(Math.random()/10 + 1) * Math.round((0.9 + data.users.mult[uID]/10) *  (data.users.collectRate[uID]+1) * Math.min(60, Math.floor((new Date().getTime() - data.users.lastCollect[uID]) / 60000)));
          if(Math.random() < 0.01*data.lm && message.guild !== null){
            amt *= 12;
            data.lm = 1;
            ok = true;
            console.log(`\n\n💰 EVENT!! ${message.author.username} got a 12x jackpot!! They got ${amt}! :o\n\n`);
            message.author.send(`💰💰 You got the __12x jackpot__ and got **${Math.ceil(amt)}**! :o\n\n`);
          }
          if(Math.random() < 0.001*data.lm2 && message.guild !== null){
            amt *= 120;
            data.lm2 = 1;
            ok = true;
            console.log(`\n\n💰 EVENT!! ${message.author.username} got a 120x jackpot!! They got ${amt}! :o\n\n`);
            message.author.send(`💰💰💰💰 You got the __120x jackpot__ and got **${Math.ceil(amt)}**! :o\n\n`);
          }
          if(Math.random() < 0.0001*data.lm3 && message.guild !== null){
            amt *= 1200;
            data.lm3 = 1;
            ok = true;
            console.log(`\n\n💰 EVENT!! ${message.author.username} got a 1200x jackpot!! They got ${amt}! :o\n\n`);
            message.author.send(`💰💰💰💰\n💰💰💰💰You got the __1200x jackpot__ and got **${Math.ceil(amt)}**! :o\n💰💰💰💰\n`);
          }
          message.channel.send((ok ? "💰" : "") + `  <@${message.author.id}> has collected ${Math.round(amt)} 🔹 !`);
          data.users.coin[uID] = Math.round(data.users.coin[uID] + amt);
          saveJSON((ok ? "💰" : "➕") + " Collection by " + message.author.username + " - " + message.author.id + " " +  Math.floor((new Date().getTime() - data.users.lastCollect[uID]) / 60000) +  " minutes since last collect [] " + `${(data.lm).toFixed(2)}%, ${(data.lm2*0.5).toFixed(2)}%, ${(data.lm3*0.05).toFixed(2)}% [] deflation prog: ${data.gMult}`);
          data.users.lastCollect[uID] = new Date().getTime();
        }else{
          message.channel.send(`<@${message.author.id}> has no gems to collect.`);
        }
        break;
      case "~$yaymorenpcs":
        for(var i = 0; i < parseInt(arg[1]); i ++){
          
        }
        break;
      case "~$join":
      case "~$joinf":
        if(autodelete && !started && message.channel.id === targetChannel || (message.content === "~$joinf" && message.author.id == GM_ID)){
          if(pID === null || (message.content === "~$joinf" && message.author.id == GM_ID)){
            data.users.played[uID] ++;
            addLog(`**${message.author.username}** __joined__ the current game.`);
            let x = Math.round(Math.random()* (gmap[0].length-6) + 3);
            let y = Math.round(Math.random()* (gmap.length-6) + 3);
            players.push(new Player(x, y, nick));
            playerData.push(new pData(message.author.id, message.author.username, nick, uID));
            gmap[y][x] = new eTile(nick, players[players.length-1].e);
            gmap[y+1][x] = new Tile(0);
            gmap[y][x+1] = new Tile(0);
            gmap[y-1][x] = new Tile(0); //Clear out area for spawning
            gmap[y][x-1] = new Tile(0);
          }else{
            addLog(`**${message.author.username}** is already in the current game.`);
          }
          mapDisplay.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);
        }else{
          message.channel.send(`<@${message.author.id}>, there are no open matches to join.`);
        }
        break;
      case "~$say":
        addLog(`**${message.author.username}:** ${(message.content.replaceAll("\n", "").replaceAll("<@", "")).substr(6, 99)}`);
        if(!started && autodelete){
          mapDisplay.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);
        }
        break;
      case "~$start":
      case "~$force":
        if(players.length > 1 || (message.content === "~$force" && message.author.id == GM_ID)){
          hECkYes = message.content === "~$force";
          tilechar = textures[parseInt(texture[sID])].slice();
          tilechar.splice(0, 1);
          if(autodelete && !started){
            started = true;
            addLog(`Current match __started__ by **${message.author.username}**`);
            let totalReward = Math.ceil(Math.pow(players.length, 2) * Math.log(players.length+1)) * globalMult;
            var endgame = "";
            updateGS = setInterval(function(){
              var disp = hECkYes ? "☢ WARNING: NUKES ENABLED```\n```" : "";
              for(var i = 0; i < players.length; i ++){
                let x = players[i].x;
                let y = players[i].y;
                let k = players[i].i;
                if(gmap[y][x].type >= 8){
                  //You dead.
                  addLog(`**${playerData[i].NA}** was __killed__ by **${gmap[y][x].pNA}'s** explosive.`);
                  data.users.kills[gmap[y][x].p_uID] ++;
                  data.users.coin[gmap[y][x].p_uID] += 9 + data.users.mult[gmap[y][x].p_uID];
                  let playerName = playerData[i].NA;
                  let pUID = playerData[i].uID;
                  let rewarded = Math.ceil(totalReward / players.length);
                  endgame = `\n#${players.length} : ${playerName} +${rewarded} ( +${Math.floor(rewarded*data.users.mult[pUID]/10-0.1)} ) 🔹` + endgame;
                  players.splice(i, 1);
                  playerData.splice(i, 1);
                  data.users.coin[pUID] += Math.ceil(totalReward / players.length) + Math.ceil(totalReward / players.length) * Math.floor(data.users.mult[pUID]/10-0.1);
                  if(players.length <= (5-endgame.split('\n').length)){ hECkYes = true;}
                  if(players.length < 2){
                    data.users.coin[playerData[0].uID] += Math.ceil(totalReward) + Math.floor(totalReward + data.users.mult[playerData[0].uID]/10-0.1);
                    data.users.wins[playerData[0].uID] ++;
                    addLog(`**${playerData[0].NA}** wins the game!!`);
                    addLog("Closing match in 5 seconds.");
                    endgame = `\n#1 : ${playerData[0].NA} +${Math.ceil(totalReward)} ( +${Math.floor(totalReward*data.users.mult[playerData[0].uID]/10-0.1)} ) 🔹` + endgame;
                    saveJSON("Match ended!");
                    clearInterval(updateGS);
                    hECkYes = false;
                    setTimeout(function(){
                      data.lm += Math.ceil(players.length / 2);
                      data.lm2 += Math.ceil(players.length / 1.5) / 1.5;
                      data.lm3 += Math.ceil(players.length / 1.5) / 2;
                      addLog(`Current match *closed*. [] `);
                      console.log(`${(data.lm).toFixed(1)}%, ${(data.lm2*0.5).toFixed(1)}%, ${(data.lm3*0.05).toFixed(1)}%`);
                      mapDisplay.channel.send("[Game closed.]\nAutodelete *disabled.*\n\n# Leaderboard and Rankings" + endgame);
                      autodelete = false;
                      targetChannel = "";
                      mapDisplay = "";
                      players = [];
                      playerData = [];
                      started = false;
                    }, 5000);
                  }
                  continue;
                }
                if(players[i].dir !== ""){
                  let adjaEmpty = [gmap[y-1][x].type === 0, gmap[y][x-1].type === 0, gmap[y+1][x].type === 0, gmap[y][x+1].type === 0, null]; //Up, left, down, right, "bomb"
                  if(players[i].dir === 4){
                    if(players[i].dirB !== ""){
                      if(adjaEmpty[players[i].dirB]){
                        switch(players[i].dirB){
                          case 0:
                            gmap[y-1][x] = new bTile(playerData[i].NA, playerData[i].uID);
                            break;
                          case 1:
                            gmap[y][x-1] = new bTile(playerData[i].NA, playerData[i].uID);
                            break;
                          case 2:
                            gmap[y+1][x] = new bTile(playerData[i].NA, playerData[i].uID);
                            break;
                          case 3:
                            gmap[y][x+1] = new bTile(playerData[i].NA, playerData[i].uID);
                            break;
                        }
                        data.users.bombs_placed[playerData[i].uID] ++;
                      }
                      players[i].dir = "";
                      players[i].dirB = "";
                    }
                  }
                  if(adjaEmpty[players[i].dir]){
                    let pe = players[i].e;
                    switch(players[i].dir){
                      case 0:
                        players[i].y --;
                        gmap[y-1][x] = new eTile(k, pe);
                        break;
                      case 1:
                        players[i].x --;
                        gmap[y][x-1] = new eTile(k, pe);
                        break;
                      case 2:
                        players[i].y ++;
                        gmap[y+1][x] = new eTile(k, pe);
                        break;
                      case 3:
                        players[i].x ++;
                        gmap[y][x+1] = new eTile(k, pe);
                        break;
                    }
                    gmap[y][x] = new Tile(0);
                    players[i].dir = "";
                  }
                }
              }
              for(var i = 0; i < gmap.length; i ++){
                for(var j = 0; j < gmap[i].length; j ++){
                  if(gmap[i][j].player === ""){
                    disp += (gmap[i][j].draw() + " ").substr(0, 2);
                    if(gmap[i][j].type === 8){
                      let kID = gmap[i][j].pNA;
                      let k_uID = gmap[i][j].p_uID;
											for(var l = 1; l <= (players.length > 2 ? gmap[i][j].pow : 10); l ++){
		                    replaceD(i, j-l, kID, k_uID, players.length > 2);
		                    replaceD(i-l, j, kID, k_uID, players.length > 2);
		                    replaceD(i, j+l, kID, k_uID, players.length > 2);
		                    replaceD(i+l, j, kID, k_uID, players.length > 2);
											}
											if(hECkYes){
											  //gmap[i][j] = new bTile(kID, k_uID);
											  for(var _ = 2; _ < 7; _ += 2){
  											  replaceD(i-_, j-_, kID, k_uID, true);
  		                    replaceD(i-_, j+_, kID, k_uID, true);
  		                    replaceD(i+_, j-_, kID, k_uID, true);
  		                    replaceD(i+_, j+_, kID, k_uID, true);
											  }
											}
                      gmap[i][j] = new dTile(kID, k_uID);
                    }
                    if(gmap[i][j].type > 9){
                      //if(players.length < 3 && endgame.split('\n').length > 2 || hECkYes){
                        //gmap[i][j].type = 4;
                      //}else{
                        gmap[i][j] = new Tile(0);
                      //}
                    }
                  }else{
                    disp += (tilechar[4] === textures[2][5]) ? gmap[i][j].e : gmap[i][j].player;
                  }
                }
                disp += "\n";
              }
              if(tilechar[4] === textures[2][5]){
                //mapDisplay.edit((`${disp.replace(/ /g, "▫")}\n${showLogs(5)}`).substring(0, 1999));
                mapDisplay.edit({embed: {
                  title: "Game",
                  description: disp.replace(/  /g, "▫").replace(/ /g, ""),
                  fields: [{
                    name: "Chat",
                    value: showLogs(5)
                  }],
                  timestamp: new Date(),
                }});
              }else{
                mapDisplay.edit((`\`\`\`${disp}\`\`\`\n${showLogs(5)}`).substring(0, 1999));
              }
              //mapDisplay.edit({embed: {title: "Game",descriptionfields: [{name: "Chat",value: showLogs(7)}],timestamp: new Date()}});
          }, 1500);
          }else{
            message.channel.send(`<@${message.author.id}>, you cannot start a game that has been started.`);
          }
        }else{
          if(mapDisplay === ""){
            message.channel.send(`<@${message.author.id}>, you cannot start a game that has not been opened.`);
          }else{
            addLog(`<@${message.author.id}>, there are not enough players.`);
            mapDisplay.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);
          }
        }
        break;
      //huh.
    }
    if(autodelete && targetChannel === message.channel.id && message.content !== mapToken){
      message.delete();
    }
  }
});
client.on("messageReactionAdd", (messageReaction, user) => {
  if(messageReaction.message.guild === null){ return; }
	if(user.equals(client.user)){ return; }
  if(autodelete && targetChannel === messageReaction.message.channel.id && messageReaction.message.id === mapDisplay.id && user.id !== client.user.id){
    let pID = null; //IN GAME ID
    let uID = null; //USER ID (save file stuff)
    let nick = user.username[0] + user.id[15];
    for(var i = 0; i < playerData.length; i ++){
      if(playerData[i].ID === user.id){
        pID = i;
      }
    }
    for(var i = 0; i < data.users.id.length; i ++){
      if(user.id === data.users.id[i]){
        uID = i;
      }
    }
    if(pID === null && messageReaction.emoji.name === "👋"){
      //addLog(`<@${user.id}>, please do not add reactions if you are not in the game, repeated offenses will result in a channel-ban.`);\
      let message = messageReaction.message;
      if(autodelete && !started && message.channel.id === targetChannel){
        if(pID === null){
          data.users.played[uID] ++;
          addLog(`**${user.username}** __joined__ the current game.`);
          let x = Math.round(Math.random()* (gmap[0].length-6) + 3);
          let y = Math.round(Math.random()* (gmap.length-6) + 3);
          players.push(new Player(x, y, nick));
          playerData.push(new pData(user.id, user.username, nick, uID));
          gmap[y][x] = new eTile(nick, players[playerData.length-1].e);
          gmap[y+1][x] = new Tile(0);
          gmap[y][x+1] = new Tile(0);
          gmap[y-1][x] = new Tile(0); //Clear out area for spawning
          gmap[y][x-1] = new Tile(0);
        }else{
          addLog(`**${message.author.username}** is already in the current game.`);
        }
        mapDisplay.edit(`\`\`\`Players:\n${listPlayers(1)}\nWaiting for players...\`\`\`\n${showLogs(8)}\n\`~$join\` or \`👋\` : join match\n\`~$start\` : start match\n\`~$say\` : chat in-game.`);
      }else{
        message.channel.send(`<@${message.author.id}>, there are no open matches to join.`);
      }
    }else{
      if(players[pID] === undefined) return;
      if(players[pID].dir === 4){
        players[pID].dirB = convertEmoji(messageReaction.emoji.name);
      }else{
        players[pID].dir = convertEmoji(messageReaction.emoji.name);
        //messageReaction.remove(user);
      }
    }
  }
});
