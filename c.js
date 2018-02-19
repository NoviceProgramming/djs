
const Discord = require('discord.js');
const client = new Discord.Client();
const tolkken = "";
client.login(tolkken);
client.on("ready", () => {
	console.log('Logged in as %s - %s\n', client.user.username, client.user.id);
});
var processes = [];
var prefix = ":";
var separator = " ";
var specialSp = "...";
var enableLEI = false;

client.on("message", (message) => {
	if(client.user.id === message.author.id){
		for(var i = 0; i < processes.length; i ++){
			if(processes[i].phantom && processes[i].status === 0 && message.content === processes[i].msg){
				message.delete();
			}
		}
	}
	if(enableLEI && message.content.toLowerCase().replace(/ /g, "").includes('lel')) message.channel.send("lei 💮"); message.react("💮");
	if(client.user.id === message.author.id && message.content.startsWith(prefix) && (message.guild !== null || message.content.includes("OVERRIDE"))){
		//Normal commands
		if(message.content === "lei 💮") setTimeout(function(){message.delete();}, 10000);
		message.content = message.content.replace("OVERRIDE");
		let arg = message.content.replace(prefix, "").split(separator);
		switch(arg[0]){
			case "help":
				//\n__`[cmd]`__ `[desc]`
				message.edit("```md\n#Utility```\n\n__`help`__ `shows this message`\n__`listproc`__ `shows all current processes`\n__`kill [ID]`__ `terminates a process`\n__`changeprf [new prefix]`__ `changes prefix`\n__`changesep [new separator]`__ `changes utility separator`\n__`changepro [new separator]`__ `changes process separator`\n__`info`__ `shows prefix infos`\n__`stats`__ *`(weight)`* `displays the load of current active processes`" + "\n\n" +
				"```Active```\n\n__`constant [message] [interval ms]`__ `repeats a message every [interval ms]`\n__`phantom [message] [interval ms]`__ `sends a message, then deletes it immediately every [interval ms]`\n__`sensitive [messsage] [interval ms]`__ `sends a message every [interval ms] but when someone starts typing, auto terminate`");
				break;
			case "weight":
			case "stats":
				var out = "```diff\n--- STATISTICS";
				let weight = 0;
				for(let i = 0; i < processes.length; i ++){
					if(processes[i].status === 1) continue;
					weight += 5000 / processes[i].int;
				}
				message.edit("```diff\n\n! Usage: " + weight.toFixed(1) + "msg / 5sec (" + (weight/5*100).toFixed(1) + "%)```");
				break;
			case "listproc":
				var out = "```diff\n--- PROCESSES";
				for(let i = 0; i < processes.length; i ++){
					if(processes[i].status === 1){ continue; }
					out += "\n! [ID: " + i + "] " + (processes[i].type.toUpperCase()) + " [" + processes[i].int + " ms] in #" + processes[i].name + " [] " + processes[i].msg.substring(0,100);
				}
				message.edit(out + "```");
				break;
			case "kill":
				if(processes[parseInt(arg[1])] === undefined || processes[i].status === 1) return;
				processes[parseInt(arg[1])].status = 1;
				processes[parseInt(arg[1])].exit();
				message.edit("Process #" + parseInt(arg[1]) + " has been terminated");
				break;
			case "changeprf":

				break;
			case "changesep":

				break;
			case "changepro":

				break;
			case "info":
				message.edit("Prefix: `" + prefix + "`\nStandard Separator: `" + separator + "`\nActive Separator: `" + specialSp + "`");
				break;
		}
		//Specialized commands
		arg = message.content.replace(prefix, "").split(specialSp);
		
		switch(arg[0]){
			case "enablelei":
				enableLEI = true;
				break;
			case "disablelei":
				enableLEI = false;
				break;
			case "constant":
			case "phantom":
			case "sensitive":
				function process(msg, int, type){
					this.status = 0; //0 running, 1 terminated
					this.name = message.channel.name;
					this.channel = message.channel;
					this.msg = msg;
					this.int = int;
					this.type = type;
					this.interval = setInterval(function(){
						message.channel.send(msg);
					}, int);
					this.exit = function(){clearInterval(this.interval)};
				}
				processes.push(new process(arg[1], Math.max(parseInt(arg[2]), 1000), arg[0]));
				message.delete();
				break;
		}
	}
});
client.on("typingStart", (channel, user) => {
	for(let i = 0; i < processes.length; i ++){
		if(processes[i].status === 1) continue;
		if(processes[i].type === "sensitive" && processes[i].name === channel.name){
			processes[i].status = 1;
			processes[i].exit();
		}
	}
});
