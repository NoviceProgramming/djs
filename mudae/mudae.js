require('dotenv').config()
const Discord = require('discord.js');
const PAYLOAD = process.env.PAYLOAD;
const THRESHOLD2H = process.env.THRESHOLD2H;
const THRESHOLD_G = process.env.THRESHOLD_G;
const client = new Discord.Client();

const guild = {};
const bot = {};
const DELAY = process.env.DELAY;
const K_DELAY = process.env.K_DELAY;
const channelIndex = process.env.CHANNEL.split(',');

process.env.SERVER.split(',').forEach(k => guild[k] = channelIndex.splice(0, 1)[0]);
process.env.TARGET.split(',').forEach(k => bot[k] = 1);


// ``.split('\n').map(e => e.split(' - ')[1]).join(';')

const payload_index = {};
let disable, dormant = true;

PAYLOAD.split(';').forEach(e => payload_index[e] = 1);

client.login(process.env.DISCORD_TOKEN).catch(e => console.log(error));
client.on("ready", () => {
  console.log('Logged in as %s - %s', client.user.username, client.user.id);
  console.log('Using maxpriority payload: [%s]', PAYLOAD.split(';'));
  console.log('\n2HTHRESHOLD [%ska] // THRESHOLD_G [%ska]', THRESHOLD2H, THRESHOLD_G);
  console.log('Speed: %sms // K-Speed: %sms\n', DELAY, K_DELAY);
  Object.keys(bot).forEach(k => client.fetchUser(k).then(user => console.log("[BOT]", user.tag)));
  Object.keys(guild).forEach(k => {
    const g = client.guilds.get(k);
    const c = g.channels.get(guild[k]);
    console.log("[TARGET] %s - #%s", g.name, c.name);
    c.send("$mu");
  });
  console.log('\nActive =====');
});
client.on("messageReactionAdd", (messageReaction, user) => {
  const message = messageReaction.message;
  if(user.id == client.user.id && bot[message.author.id]>1 && guild[message.guild.id] && !messageReaction.emoji.name.includes('kakera')){
    console.log(`===== >>> Manual claim // 3H Cycle reset // ${message.guild.name} #${message.channel.name}`);
    bot[message.author.id] = 1;
  }
  try {
    if(disable) return;
    if(!bot[user.id] || !guild[message.guild.id]) return;
    if(!message.embeds.length) return;
    if(messageReaction.emoji.name.includes('kakera') && messageReaction.emoji.name.length > 6) setTimeout(() => message.react(messageReaction.emoji.name + ":" + messageReaction.emoji.id).catch(e => console.log(e)), K_DELAY);
  }catch(error){ console.log(error); }
  if(disable || dormant) return;
  try {
    if(!bot[user.id] || !guild[message.guild.id]) return;
    if(!message.embeds.length) return;

    const kval = parseInt(message.embeds[0].description.split('**')[1]);
    //console.log(messageReaction.emoji.name, messageReaction.message.embeds[0].author.name);
    console.log(`${message.guild.name} #${message.channel.name} [${bot[message.author.id]}] ${message.embeds[0].author.name} ${kval}`);

    if((bot[message.author.id]>=5&&kval>=THRESHOLD2H) || kval>=THRESHOLD_G || payload_index[message.embeds[0].author.name]){
      if(!messageReaction.emoji.name.includes('kakera')){
	bot[message.author.id] = 1;
	dormant = true;
      }
      console.log(messageReaction.emoji.id, messageReaction.emoji.name);
      setTimeout(() => message.react(messageReaction.emoji.id ? (messageReaction.emoji.name + ":" + messageReaction.emoji.id) : messageReaction.emoji.name).catch(e => console.log(e)), DELAY);
      console.log('>', `>>> (!) ${messageReaction.emoji.name.includes('kakera') ? "Kakera" : "Autoclaim"} // ${(bot[message.author.id] > 1) ? "continuing..." : "3H Cycle reset"} ===== ${message.guild.name} #${message.channel.name}`);
    }
  }catch(error){ console.log(error); }
});
client.on("message", message => {
  if(message.author.id == client.user.id){
    if(message.content == "$$disable") disable = true;
    if(message.content == "$$enable") disable = false;
    if(message.content == "$$end") process.exit();
    if(message.content == "$$status") message.edit("Status: " + (disable ? "Offline" : "Online"));
  }
  try {
    if(disable || !message.guild) return;
    if(!bot[message.author.id] || !guild[message.guild.id]) return;
    if(guild[message.guild.id] && guild[message.guild.id] == message.channel.id && (message.content.includes('The next claim reset is in ') || message.content.includes("you can't claim for another "))){
      guild[message.guild.id] = 1;
      const cycleNow = message.content.includes('you can claim right now!');
      const to = message.content.split(', ')[1].replace("you can claim right now!\nThe next claim reset is in ", '').replace("you can't claim for another ", '').replace(" min.", '').replace("h", '').replace(/\*/g, '').split(' ').reverse().map(e => parseInt(e));
      to.push(0);
      console.log("Setting up cycle for " + message.guild.name, `${to[1]}hr ${to[0]}min`, '#'+message.channel.name);
      const cycle = (overrideStart) => {
        bot[message.author.id] = overrideStart || 2;
        console.log(`= Initiate cycle for ${message.guild.name} #${message.channel.name} <${bot[message.author.id]}> // ${new Date()}`)
        for(let i = 0; i <= (isNaN(overrideStart) ? 2 : 4-overrideStart); i ++){
          const MIN_offset = Math.min(i*60+Math.random()*25, i ? 178 : to[0]-4);
          setTimeout(() => {
            if(bot[message.author.id] < 2) return; // "already claimed"
            bot[message.author.id] ++;
            dormant = false; console.log("===== >>> starting cycle <<< ===== #%s ===== <%s>", message.channel.name, bot[message.author.id]);
            for(let T = 0; T < 14; T ++){
              setTimeout(() => {
                if(bot[message.author.id] >= 2) message.channel.send("$w");
              }, T*1100);
            }
            setTimeout(() => {
              dormant = true; console.log(">>> ===== cycle complete ===== <<<");
            }, 15*1100+5000);
          }, MIN_offset*60*1000);
        }
      };
      if(cycleNow) cycle(4-to[1]);
      setTimeout(() => {
        cycle();
        setInterval(cycle, (3*60*60*1000));
      }, ((to[0]+to[1]*60+10)*60*1000) || (3*60*60*1000));
    }

    if(dormant) return;
    if(!message.embeds.length) return;
    if(!message.embeds[0].author) return; // no author

    //console.log(message.guild.id, message.embeds[0].color, message.embeds[0].author.name, message.embeds[0].description);

    if(message.embeds[0].color == 6753288) return; // already claimed!
    if(message.embeds[0].description.includes(" <:")) return; // $im

    /*if(payload_index[message.embeds[0].author.name]){
      messageInterval[message.id] = setTimeout(() => message.react("💖"), Math.min(400, DELAY+200));
      console.log("^^^ ^^^ !! ^^^ ^^^");
    }*/
  }catch(error){ console.log(error); }
});
