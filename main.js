var Discord = require("discord.js");
var client = new Discord.Client();
var ayarlar = require("./ayarlar.json");
const ascii = require("ascii-art");
const moment = require("moment");
const fs = require("fs");
const ms = require("ms");
//const coins = require("./coins.json");
const warns = JSON.parse(fs.readFileSync("./uyarilar.json", "utf8"));
//let warns = JSON.parse(fs.readFileSync("./uyarilar.json", "utf8"));
//let userData = JSON.parse(fs.readFileSync('Storage/userData.json', `utf8`));
//let suggestChannel = JSON.parse(fs.readFileSync('Storage/suggestChannel.json', 'utf8'));

client.on('ready', () => {
    console.log(`The client has been turned on! His name is ${client.user.tag}. Prefix: "ma!". I jest na ${client.guilds.size} serwerach!`);
    client.user.setStatus(`dnd`);
    client.user.setActivity(`${client.guilds.size} servers.`, {type: "WATCHING"});
});

client.on("message", async message => {

    if(message.author.client) return;
    //if(message.author.id === '305112912429580288') return message.channel.send('Masz bana w bocie');
    if(message.channel.type === "dm") return;

    let prefixler = JSON.parse(fs.readFileSync("./prefixler.json", "utf8"));

    if(!prefixler[message.guild.id]){
        prefixler[message.guild.id] = {
            prefixler: ayarlar.prefix
        };
    }

    let language = JSON.parse(fs.readFileSync("./diller.json", "utf8"));

    if(!language[message.guild.id]){
        language[message.guild.id] = {
            language: ayarlar.defaultLang
        };
    }

    let suggestChannels = JSON.parse(fs.readFileSync("./onerikanali.json", "utf8"));

    if(!suggestChannels[message.guild.id]){
        suggestChannels[message.guild.id] = {
            suggestChannels: ayarlar.defaultSuggestChannel
        };
    }

    let lang = language[message.guild.id].language;

    let suggestChannel = suggestChannels[message.guild.id].suggestChannels;

    //let prefix = prefixler[message.guild.id].prefixler;
    let prefix = ayarlar.prefix;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let msg = message.content.startsWith;
    let args = messageArray.slice(1);

    if(cmd === `${prefix}bingo`){
        let y = Math.floor(Math.random() * (Math.floor(75) - Math.ceil(1) + 1)) + Math.ceil(1);
        let x = null;

        if (y < 15) { x = "B"; }
        else if (y < 30){ x = "I"; }
        else if (y < 45){ x = "N"; }
        else if (y < 60){ x = "G"; }
        else { x = "O"; }

        message.channel.send(x + y);
    }

    if(cmd === `${prefix}statsrefresh`){
        client.channels.get("472172327107297290").setName(`✸ Toplam Üye Sayısı: ${message.guild.memberCount}`);
        client.channels.get("472172505637978123").setName(`✸ Kullanıcılar: ${message.guild.members.filter(m => m.user.client).size}`);
    }

    if(cmd === `${prefix}kill`){
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        message.channel.send(`${client.emojis.find(`name`, 'alert')} **${aUser.tag}** has been killed by **${message.author.tag}**!`).then(Message => {
            setTimeout(() => { Message.edit(`${client.emojis.find(`name`, 'alert')} Respawning...`); }, 1000);
            setTimeout(() => { Message.edit(`${client.emojis.find(`name`, 'alert')} This user was born again! Welcome back, ${aUser.tag}`); }, 1000);
        });
    }

    if(cmd === `${prefix}votekick`){
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `KICK_MEMBERS` permissions.");
        const agree    = "✅";
        const disagree = "❎";

        if (message.mentions.users.size === 0){
            return message.channel.send(`${client.emojis.find(`name`, 'error')} ` + "You must mention the correct user, otherwise it will not work!");
        }

        let kickmember = message.guild.member(message.mentions.users.first());

        if(!kickmember){
            message.channel.send(`${client.emojis.find(`name`, 'error')} ` + "The user you selected was not found!");
        }

        if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS")){
            return message.reply(`${client.emojis.find(`name`, 'error')} ` + "I do not have the permission of `KICK_MEMBERS`, you have to add it to me otherwise the command will not work!").catch(console.error);
        }

        let msg = await message.channel.send(`${client.emojis.find(`name`, 'alert')} Voting for kicking a **${kickmember}** user out of the server, vote by clicking the appropriate reaction. (10 sec.)`);

        await msg.react(agree);
        await msg.react(disagree);

        const reactions = await msg.awaitReactions(reaction => reaction.emoji.name === agree || reaction.emoji.name === disagree, {time: 10000});

        msg.delete();

        var NO_Count = reactions.get(disagree).count;
        var YES_Count = reactions.get(agree);

        if(YES_Count == undefined){
            var YES_Count = 1;
        }else{
            var YES_Count = reactions.get(agree).count;
        }

        var sumsum = new Discord.RichEmbed()
        .addField("The voting has been completed, here are the results:", `~~----------------------------------------~~\n${client.emojis.find(`name`, 'error')} Votes for NO: ${NO_Count-1}\n${client.emojis.find(`name`, 'success')} Votes for YES: ${YES_Count-1}\nNOTE: Votes needed to kick (3+)\n~~----------------------------------------~~`)
        .setColor("RANDOM")

        await message.channel.send(sumsum);

        if(YES_Count >= 4 && YES_Count > NO_Count){

            kickmember.kick().then(member => {
                message.reply(`${client.emojis.find(`name`, 'success')} ${member.user.username} was succesfully kicked`)
        })

        }else{

        message.channel.send("\n" + `${client.emojis.find(`name`, 'error')} The user has not been kicked!`);

        }
    }

    if(cmd === `${prefix}say`){
        //message.delete();
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`Nie masz uprawnien!`)
        if (args[0].includes('@everyone')) return message.channel.send(`${client.emojis.find(`name`, 'alert')} You will not use a client for this purpose! You are not a good user!`);
        if (args[0].includes('@here')) return message.channel.send(`${client.emojis.find(`name`, 'alert')} You will not use a client for this purpose! You are not a good user!`);
        let sayMessage = args.join(" ");
        message.delete();
        message.channel.send(sayMessage);
    }

    if(cmd === `<@458569537286176768>`){
        message.channel.send(`${client.emojis.find(`name`, 'question')} What do you want from me? As for my prefix, you have: ` + "`" + `${prefix}` + "`");
        let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has mention the client on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}ascii`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        ascii.font(args.join(' '), 'Doom', function(rendered) {
          rendered = rendered.trimRight();

          if(rendered.length > 2000) return message.channel.send(`${client.emojis.find(`name`, 'error')} Unfortunately, but I can't write this message in ascii... It is too long!`);
          message.channel.send(rendered, {
            code: 'md'
          });
        })
        let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **ascii** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}roles`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        const rolesList = message.guild.roles.map(e=>e.toString()).join(", ");
        const rolesEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("List of roles:", rolesList)
        message.channel.send(rolesEmbed);
        let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **roles** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    //if (!userData[sender.id]) userData[sender.id] = {
        //messagesSent: 0
    //}

   //userData[sender.id].messagesSent++;

    //fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        //if (err) console.error(err);
    //});

    //if (cmd === `${prefix}points`) {
        //var embed = new Discord.RichEmbed()
        //.setColor("RANDOM")
        //.setDescription(`${client.emojis.find(`name`, 'alert')} You currently have **` + userData[sender.id].messagesSent + `** points on this server!`)
        //.setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`);
        //message.channel.send(embed);
    //}

    if(cmd === `${prefix}profile`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let aUser = message.mentions.users.first() || message.author;
        const userinfo = new Discord.RichEmbed()
        .setColor("FFA07A")
        .setAuthor(`${aUser.username}'s profile`, `https://cdn.discordapp.com/emojis/472480341299298304.png?v=1`)
        .setThumbnail(aUser.displayAvatarURL)
        .addField("ID:", `${aUser.id}`)
        .addField("Nickname:", `${aUser.nickname ? aUser.nickname : "None"}`)
        .addField("Account created:", `${moment.utc(aUser.createdAt).format('dd, Do MM YYYY')}`)
        .addField("Joined the server:", `${moment.utc(aUser.joinedAt).format('dd, Do MM YYYY')}`)
        .addField("It is a client::", `${aUser.client}`)
        .addField("Status:", `${aUser.presence.status.replace("dnd", "Do Not Disturb")}`)
        .addField("Game:", `${aUser.presence.game ? aUser.presence.game.name : 'He does not play'}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`)
        message.channel.send(userinfo);
    }

    if(cmd === `${prefix}server` || cmd === `${prefix}server-info` || cmd === `${prefix}serverinfo`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);

        let sicon = message.guild.iconURL;
        let serverembed = new Discord.RichEmbed()
        .setColor("FFA07A")
        .setAuthor(`Server ${message.guild.name}`, `https://cdn.discordapp.com/emojis/473897310414176266.png?v=1`)
        .setThumbnail(sicon)
        //.addField("Name:", message.guild.name)
        .addField("Server created:", `${moment.utc(message.guild.createdAt).format('dd, Do MM YYYY')}`)
        .addField("You joined:",`${moment.utc(message.author.joinedAt).format('dd, Do MM YYYY')}`)
        .addField("Number of users::", message.guild.memberCount)
        .addField("Region:", `${message.guild.region.replace("eu-central", ":flag_eu: EU Central")}`)
        .addField("Text channels:", message.guild.channels.findAll("type", "text").length)
        .addField("Voice channels:", message.guild.channels.findAll("type", "voice").length)
        .addField("Roles:", `${message.guild.roles.size} (Full list of roles under the **${prefix}roles** command.)`)
        .addField("Emojis:", message.guild.emojis.size)
        .addField("Owner:", `${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`);

        message.channel.send(serverembed);
    }

    if(cmd === `${prefix}channel`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_CHANNELS` permissions.");
        let channelname = args.slice(1).join(" ");
        let everyone = message.guild.roles.find(`name`, "@everyone");
        if(args[0] == 'lock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false }), message.channel.send(`${client.emojis.find(`name`, 'success')} Okay, according to your wishes, I blocked this channel! Others can not write here.`);
        if(args[0] == 'unlock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: true, ADD_REACTIONS: true }), message.channel.send(`${client.emojis.find(`name`, 'success')} Okay, according to your wishes, I unblocked this channel! Others can write here already.`);
        if(args[0] == 'setname') return message.channel.edit({ name: `${channelname}` }), message.channel.send(`${client.emojis.find(`name`, 'success')} The channel name has been successfully changed to: ${channelname}`);
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')} The correct use of this command: ` + "`cb!channel <lock/unlock/setname>`.")
        //if(args[0] == 'setname') return message.channel.setName(channelname), message.channel.send(`${client.emojis.find(`name`, 'success')} Mmm... You asked for a channel name change. It has been done! The new name of this channel is: **${channelname}**.`);
        let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **channel** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

   // if(cmd === `${prefix}webhook`){
      //  let webhookid = args[0].split("/")[5]
      //  let webhooktoken = args[0].split("/")[6]
      //  const hook = new Discord.WebhookClient(webhookid, webhooktoken);
       // if(args[0] == 'create') return message.channel.createWebhook(args.join(" ").split(" | ")[0], args.join(" ").split(" | ")[1])
       // .then(webhook => message.author.send(`${client.emojis.find(`name`, 'success')} Your webhook has been created! Link to him: https://canary.discordapp.com/api/webhooks/${webhook.id}/${webhook.token}`))
       // .then(webhook => message.channel.send(`${client.emojis.find(`name`, 'success')} Oh yes! Webhook on this server was created! See private messages for more information!`))
        //.catch(console.error);
        //if(args[0] == 'send') return hook.send(args.join(" ").slice(args[0].length));
        //if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')}` + " Oh no! An error occurred, did not you give the action? The correct usage is: `cb!webhook <create>`.");
    //}


    //fs.writeFile('Storage/suggestChannel.json', JSON.stringify(suggestChannel), (err) => {
        //if (err) console.error(err);
    //})

    if(cmd === `${prefix}post`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let postargs = args.join(" ");
        const postEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("New post!", postargs)
        .setFooter(`Posted by ${message.author.tag}`)

        //if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')} Mhm... You did not enter the content of the post!`);
        let postmsg = await message.channel.send(postEmbed);
        postmsg.react(client.emojis.find(`name`, 'like'));
        postmsg.react(client.emojis.find(`name`, 'heartreact'));
        message.delete();
        let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **post** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}eval`){
        //if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(message.author.id !== '305112912429580288') return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `developer` permissions, check them using `cb!permissions`.")
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')}` + " Please, give me the code. If you do not know how to use the command, use `cb!help eval`.")
        let result = eval(args.join(" ")).toString()
          let embed = new Discord.RichEmbed()
          //.setTitle("Eval")
          .addField(`${client.emojis.find(`name`, 'jsonfile')} INPUT`, "```"+args.join(" ")+"```")
          .addField(`${client.emojis.find(`name`, 'txt')} OUTPUT`, "```"+result+"```")
          .setColor("RANDOM")
          .setFooter(`The eval was used by ${message.author.tag}`, `https://cdn.discordapp.com/emojis/472480341299298304.png?v=1`)
          message.channel.send(embed);
    }

    if(message.author.id === "305112912429580288"){
        if(cmd === `${prefix}clientsetname`){
          let nowaNazwa = args.join(" ");
          client.user.setUsername(nowaNazwa);
          console.log(`Nick został zmieniony.`);
          message.channel.send(`${client.emojis.find(`name`, 'success')} The name of the client has been changed to: **${nowaNazwa}**.`);
        }
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **clientsetname** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(message.author.id === "305112912429580288"){
        if(cmd === `${prefix}clientsetavatar`){
          let nowyAvatar = args.join(" ");
          client.user.setAvatar(nowyAvatar);
          console.log(`Avatar został zmieniony.`);
          message.channel.send(`${client.emojis.find(`name`, 'success')} The avatar of the client has been changed to: **${nowyAvatar}**.`);
        }
        //let cmdlogs = message.guild.channels.find(`id`, "471972734851612672");
        //cmdlogs.send(`${client.emojis.find(`name`, 'alert')} The **${message.author.tag}**(**${message.author.id}**) user has used the **clientsetavatar** command on the **${message.guild.name}**(**${message.guild.id}**) server.`);
    }

    if(cmd === `${prefix}yardım`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        const helpmsg = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle('My commands')
        .setDescription("See my commands, they are below!")
        .addField('Basic (5):', '`invite`, `info`, `help`, ~~`serverlist`~~, `permissions`')
        .addField('Fun (6):', '`ascii`, `reverse`, `choose`, `avatar`, `hug`, `8ball`, `wheel`')
        .addField('Administrative (9):', '`ban`, ~~`kick`~~, `votekick`, `survey`, `addrole`, `removerole`, `channel`, `setprefix`, `setSuggestChannel`, `clear`')
        .addField('Images (1):', '`cat`, ~~`dog`~~, ~~`nutella`~~')
        .addField('Information (2):', '`server`, `profile`')
        .addField('Other (1):', '`suggest`')
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`)
        if(!args[0]) return message.channel.send(helpmsg);
        if(args[0] == 'invite') return message.channel.send('Help with the **INVITE** command. \n```Usage: ' + `${prefix}invite` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'info') return message.channel.send('Help with the **INFO** command. \n```Usage: ' + `${prefix}info` + '``` \n**Aliases:** None \n**Description:** It will display information about the client.');
        if(args[0] == 'help') return message.channel.send('Help with the **HELP** command. \n```Usage: ' + `${prefix}help` + '``` \n**Aliases:** None \n**Description:** Shows a list of client commands.');
        if(args[0] == 'serverlist') return message.channel.send('Help with the **SERVERLIST** command. \n~~```Usage: ' + `${prefix}serverlist` + '```~~ \n~~**Aliases:** None \n**Description:** Displays a list of servers on which the client is located.~~ ' + `\n${client.emojis.find(`name`, 'alert')} ***__COMMAND DISABLED__*** ${client.emojis.find(`name`, 'alert')}`);
        if(args[0] == 'permissions') return message.channel.send('Help with the **PERMISSIONS** command. \n```Usage: ' + `${prefix}permissions` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'ascii') return message.channel.send('Help with the **ASCII** command. \n```Usage: ' + `${prefix}ascii <text>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'reverse') return message.channel.send('Help with the **REVERSE** command. \n```Usage: ' + `${prefix}reverse <text>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'choose') return message.channel.send('Help with the **CHOOSE** command. \n```Usage: ' + `${prefix}choose <text1>;<text2>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'avatar') return message.channel.send('Help with the **AVATAR** command. \n```Usage: ' + `${prefix}avatar [<@user>]` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
        if(args[0] == 'hug') return message.channel.send('Help with the **HUG** command. \n```Usage: ' + `${prefix}hug <@user>` + '``` \n**Aliases:** None \n**Description:** After entering this command you will see a link to the help server with the client and a link to invite it to your server!');
    }

    if(cmd === `${prefix}haberler`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let newsEmbed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle('New information!')
        .setDescription(`New client commands! client has gained many new commands, they have already appeared in **${prefix}help**!`)
        .setFooter('Sent by xCookieTM#9613')
        message.channel.send(newsEmbed);
    }

    if(cmd === `${prefix}ban`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send(":x: You must mark the correct user!");
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(":lock: You do not have permission to use this!");
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(":lock: This user can not be banned!");
        if(!args[0]) return message.channel.send(`Ehh... Have you not given the user or the reason? This and that? Use ` + "`" + `${prefix}help ban` + "`" + `  command for help!`);

        let banEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`[BAN] ${bUser.tag}`, `${bUser.displayAvatarURL}`)
        .addField("Moderator:", `<@${message.author.id}>, id ${message.author.id}`)
        .addField("On channel:", message.channel)
        .addField("Reason:", bReason)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used on ${message.guild.name} server.`)
        //.setAuthor(`${bUser.user.tag}, ${bUser.id}`, `${bUser.user.displayAvatarURL}`);

        let modlogi = message.guild.channels.find(`name`, "modlogs");
        if(!modlogi) return message.channel.send(`${client.emojis.find(`name`, 'alert')} The '**modlogs**' channel does not exist, but the **${bUser}** user got the ban anyway!`), message.guild.member(bUser).ban(bReason);

        message.channel.send(`${client.emojis.find(`name`, 'success')} User ${bUser} has been banned for ${bReason}.`)
        message.guild.member(bUser).ban(bReason);
        modlogi.send(banEmbed);

        //let logiKomend = client.channels.get("458569305341296641");
        //logiKomend.send(`Użytkownik: **${message.author.tag}** (**${message.author.id}**) \nUżył komendy **ban** na serwerze **${message.guild.name}**, zbanował **${bUser}** za **${bReason}**.`);
        return;
    }

    if(cmd === `${prefix}davet`){
        message.channel.send(`${client.emojis.find(`name`, 'plus')} You can invite the client to your server via the link: https://discordapp.com/api/oauth2/authorize?client_id=458569537286176768&permissions=8&scope=client \n \n${client.emojis.find(`name`, 'plus')} If you need help with a client, go here: https://discord.gg/3F7wGx8`);
    }

    if(cmd === `${prefix}serverlist`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        const guildArray = client.guilds.map((guild) => {
          return `${guild.name}`
        })

        let embed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField("A full list of servers on which the client is:", guildArray.join(", "))
        .setFooter(`There are ${client.guilds.size} servers in total.`, 'https://cdn.discordapp.com/emojis/472688143389425665.png?v=1')

        message.channel.send(embed);

    }

    if(cmd === `${prefix}serverlistesi`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        message.channel.send(`${client.emojis.find(`name`, 'alert')} ***__COMMAND DISABLED__*** ${client.emojis.find(`name`, 'alert')}`);
    }

    if(cmd === `${prefix}yetkiler`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if (message.author.id === '305112912429580288') return message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `Creator of Cookieclient` (5)");
        if (message.author.id === '372026600989917195') return message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `Global Support` (4)")
        if (message.guild.owner) return message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `Server Owner` (3)");
        if (message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `Server Admin` (2)");
        //if (message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `Manage Server` (1)");

        message.channel.send(`${client.emojis.find(`name`, 'pass')}` + " Your permission level is: `User` (0)");
    }

    if(cmd === `${prefix}rolsil`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let rMember = message.guild.member(message.mentions.users.first()) ||  message.guild.members.get(args[0]);
        if(!rMember) return message.channel.send(`${client.emojis.find(`name`, 'error')} You must enter the correct user!`);
        let role = args.join(" ").slice(22);
        if(!role) return message.channel.send(`${client.emojis.find(`name`, 'error')} You must provide a role (give its name, it can not be a mention)`);
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.channel.send(`${client.emojis.find(`name`, 'error')} The role you entered was not found.`);

        if(!rMember.roles.has(gRole.id)) return message.reply('On nie ma tej roli.');
        await(rMember.removeRole(gRole.id));

        try{
            await rMember.send(`${client.emojis.find(`name`, 'alert')} You lost the role named **${gRole.name}** on the **${message.guild.name}** server!`)
            await message.channel.send(`${client.emojis.find(`name`, 'success')} You have remove **${gRole.name}** role for **<@${rMember.id}>** user!`);
        }catch(error){
            console.log(error);
        }
    }

    if(cmd === `${prefix}rolekle`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!rMember) return message.channel.send(`${client.emojis.find(`name`, 'error')} You must enter the correct user!`);
        let role = args.join(" ").slice(22);
        //if(!args[1]) return message.channel.send(`${client.emojis.find(`name`, 'error')} You must provide a role (give its name, it can not be a mention)`);
        let gRole = message.guild.roles.find(`name`, role);
        if(!gRole) return message.channel.send(`${client.emojis.find(`name`, 'error')} The role you entered was not found.`);

        if(rMember.roles.has(gRole.id)) return;
        await(rMember.addRole(gRole.id));

        try{
            rMember.send(`${client.emojis.find(`name`, 'alert')} You have received a rank called **${gRole.name}** on the **${message.guild.name}** server!`)
            message.channel.send(`${client.emojis.find(`name`, 'success')} The role named **${gRole.name}** has been successfully assigned to the **<@${rMember.id}>** user!`)
        }catch(error){
            console.log(error);
        }
    }


    if(cmd === `${prefix}hakkında`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        const infoembed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .addField('client username:', `${client.user.tag}`)
        .addField('Creator:', 'xCookieTM#9613')
        .addField('Library:', 'discord.js')
    }

    if(cmd === `${prefix}avatar`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let avEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        //.setDescription(`Avatar ${aUser.username}:`)
        //.setThumbnail(aUser.displayAvatarURL)
        .setDescription(`${client.emojis.find(`name`, 'user')} Avatar ${aUser.username}:`)
        .setImage(aUser.displayAvatarURL)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Used by ${message.author.tag}.`);
        message.channel.send(avEmbed);
        return;
    }

    if(cmd === `${prefix}sarıl`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let aUser = message.mentions.users.first() || message.author || message.user.id;
        let huglinks = ["https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif", "https://media.giphy.com/media/xT39CXg70nNS0MFNLy/giphy.gif", "https://media.giphy.com/media/143v0Z4767T15e/giphy.gif", "https://media.giphy.com/media/BVRoqYseaRdn2/giphy.gif", "https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif"];
        let math = Math.floor((Math.random() * huglinks.length));
        let hugEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle(`${client.emojis.find(`name`, 'like1')} User ${message.author.tag} hugged ${aUser.tag}.`)
        .setImage(huglinks[math])

        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'alert')} You do not have friends ;(`);
        message.channel.send(hugEmbed);
    }

    if(cmd === `${prefix}anket` || cmd === `${prefix}vote`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: You do not have sufficient permissions to create a survey.");
        const ankietaMessage = args.join(" ");
        //let ankieta = await message.channel.send(ankietaEmbed);
        let ankietaEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor(`New survey`, `https://cdn.discordapp.com/emojis/472694503229358080.png?v=1`)
        .setDescription(ankietaMessage)
        .setFooter(`The survey was created by ${message.author.tag}`);

        let ankieta = await message.channel.send(ankietaEmbed);
        ankieta.react(client.emojis.find(`name`, 'success'));
        ankieta.react(client.emojis.find(`name`, 'error'));
        message.delete();
        return;
    }

    if (cmd.includes('Japierdole')) {
        //if (message.author.id === '305112912429580288') return;
        message.delete();
        var lol = await message.reply('Napisane slowo zostalo zablokowane! Slowo: ```Slowo wyslane w prywatnych wiadomosciach```')
        lol.delete(10000)
    }

    if(cmd === `${prefix}tersyaz`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!args[0]) return message.channel.send(':x: You must enter some text!');
        if (args[0].includes('enoyreve@')) return message.channel.send(`${client.emojis.find(`name`, 'alert')} You will not use a client for this purpose! You are not a good user!`);
        if (args[0].includes('ereh@')) return message.channel.send(`${client.emojis.find(`name`, 'alert')} You will not use a client for this purpose! You are not a good user!`);

        function reverseString(str) {
            return str.split("").reverse().join("");
        }
        let sreverse = reverseString(args.join(' '))
        //if(sreverse === '@here' || sreverse === '@everyone' || sreverse === `https://discord.gg/${invite.code}`) return message.channel.send("Nie możesz tego odwrócić!")
        if(args[0] === sreverse) {
        sreverse = `${args.join(' ')} [it comes out the same ;(]`
        }
        message.channel.send(`${client.emojis.find(`name`, 'repeat')} Inverted text: **${sreverse}**`);
    }

    if(cmd === `${prefix}kedi`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let catlinks = ["https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif", "https://media.giphy.com/media/l1J3pT7PfLgSRMnFC/giphy.gif", "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", "https://media.giphy.com/media/6uMqzcbWRhoT6/giphy.gif", "https://media.giphy.com/media/nNxT5qXR02FOM/giphy.gif", "https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif", "https://media.giphy.com/media/Nm8ZPAGOwZUQM/giphy.gif", "https://media.giphy.com/media/Q56ZI04r6CakM/giphy.gif"];
        let math = Math.floor((Math.random() * catlinks.length));
        let catEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`${client.emojis.find(`name`, 'cat')} Random cat`, `Here is one of my random cats:`)
        .setImage(catlinks[math])
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | ${message.author.tag}`);

        message.channel.send(catEmbed);
    }

    if(cmd === `${prefix}çark`){
        let arrows = [":arrow_up:", ":arrow_down:", ":arrow_left:", ":arrow_down:"]
        let math = Math.floor((Math.random() * arrows.length));
        const embed = new Discord.RichEmbed()
        .setDescription(`:cookie:    :banana:     :peach:\n \n:ice_cream:    ${arrows[math]}   :tomato:\n \n:tangerine:     :cherries:     :grapes:`)
        message.channel.send(embed);
    }

    if(cmd === `${prefix}8ball`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        //if(!args[2]) return message.channel.send(`${client.emojis.find(`name`, 'error')} Please, give me the full question!`);
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')} Ahh... You did not give a question, can I know why?`);
        let replies = ["Yes of course...", "Sorry but no...", "How can I know that?", "You can ask later?", "Mmm... No."];

        let result = Math.floor((Math.random() * replies.length));
        let question = args.slice(0).join(" ");

        let ballembed = new Discord.RichEmbed()
        .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL}`)
        .setColor("RANDOM")
        .setDescription(question)
        //.addField("Pytanie", question)
        .addField("Answer:", replies[result])
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | ${message.author.tag}`);

        message.channel.send(ballembed);
        return;
    }

    if(cmd === `${prefix}profil`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let aUser = message.mentions.users.first() || message.author;
        const profileEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`${client.emojis.find(`name`, 'user')} ${aUser.username}'s profile`, `Username: ${aUser.username} \nDiscriminator: ${aUser.discriminator} \nGlobal points: 0 \nServer points: 0`)
        message.channel.send(profileEmbed);
    }


    if(cmd === `${prefix}choose`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        var odp = Math.floor(Math.random() *2) + 1
        var a = args.join(" ").split(";")[0]
        var b = args.join(" ").split(";")[1]
        var odp2
        switch(odp) {
          case 1:
          odp2 = a;
          break;

          case 2:
          odp2 = b;
        }
        let messagechoose = await message.channel.send(`${client.emojis.find(`name`, 'thinke')} Hmm...`)
        messagechoose.edit(`${client.emojis.find(`name`, 'chat')} So, I choose: **${odp2}**`)
    }

    if(cmd === `${prefix}temizle`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MESSAGES` permissions, check them using `cb!permissions`.");

        let messagecount = parseInt(args.join(' '));
        message.channel.fetchMessages({
          limit: messagecount
        }).then(messages => message.channel.bulkDelete(messages));
        let purgeSuccessMessage = await message.channel.send(`${client.emojis.find(`name`, 'success')} As you wish, I cleaned the **${messagecount}** messages!`);
        purgeSuccessMessage.delete(10000);
    }

    if(cmd === `${prefix}ping`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        const m = await message.channel.send("Ping :ping_pong: ");
        m.edit(`:ping_pong: Pong! ${m.createdTimestamp - message.createdTimestamp}ms. API is ${Math.round(client.ping)}ms`);
    }

    if(cmd === `${prefix}prefixayarla`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_SERVER` permissions.");
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')} An error occurred, apparently you did not enter a value. Use **${prefix}help setprefix** for help.`);

        let prefixler = JSON.parse(fs.readFileSync("./prefixler.json", "utf8"));

        prefixler[message.guild.id] = {
            prefixler: args[0]
        }

        fs.writeFile("./prefixler.json", JSON.stringify(prefixler), (err) => {
            if (err) console.error(err);
        });

        let sEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle('Configuration set!')
        .setDescription(`The server prefix has been set to: ${args[0]}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Changed by ${message.author.tag}.`)

        message.channel.send(sEmbed);
    }

    if(cmd === `${prefix}önerikanalayarla`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        if(!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_SERVER` permissions.");
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'lock')} An error occurred, apparently you did not enter a value. Use **${prefix}help** setprefix for help.`);

        let sChannelName = message.guild.channels.find(`name`, args.join(" "));
        if(!sChannelName) return message.channel.send(`${client.emojis.find(`name`, 'error')} The channel specified does not exist!`);

        let suggestChannels = JSON.parse(fs.readFileSync("./onerikanali.json", "utf8"));

        suggestChannels[message.guild.id] = {
            suggestChannels: args[0]
        }

        fs.writeFile("./onerikanali.json", JSON.stringify(suggestChannels), (err) => {
            if (err) console.error(err);
        });

        let sEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setTitle('Configuration set!')
        .setDescription(`Suggestion channel has been set to: ${args[0]}`)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Changed by ${message.author.tag}.`)

        message.channel.send(sEmbed);
    }

    if(cmd === `${prefix}ayarlar`){
        if(!args[0]) return message.channel.send("```List of settings for the server: \n[1] prefix \n[2] suggestChannel```" + `If you want to set, enter ` + "`" + `${prefix}settings <->` + "`.")
    }

    if(cmd === `${prefix}öner`){
        if(ayarlar.komutlar === "disabled") return message.channel.send(`${client.emojis.find(`name`, 'error')} All commands in the client have been disabled!`);
        let suggestContent = args.join(" ");
        if(!args[0]) return message.channel.send(`${client.emojis.find(`name`, 'error')} What is your suggestion? Because from what I see it is nothing.`)
        const suggestEmbed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(suggestContent)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Suggestion writed by ${message.author.tag}.`);
        message.guild.channels.find(`name`, `${suggestChannel}`).send(suggestEmbed);
        message.channel.send(`${client.emojis.find(`name`, 'success')} Suggestion has been successfully sent!`)
    }

    if(message.author.id === "305112912429580288"){
        if(cmd === `${prefix}rich`){
          //if(message.author.id !== "396284197389729as93") return message.channel.send("Nie tego!");
        let stream = args.slice(1).join(" ");
        let game = args.slice(1).join(" ");
        let listen = args.slice(1).join(" ");
        let watch = args.slice(1).join(" ");
        let reset = args.slice(1).join(" ");
          if(!args[0]) return message.channel.send(':x: You must provide a value! Correct use: `cb!rich <game/stream/watch/listen> <text>`');
          if(args[0] == 'game') return client.user.setActivity(game),  message.channel.send(`${client.emojis.find(`name`, 'alert')} client started playing in **${game}**.`);
            //message.channel.send(`:wink: client zaczął grać w **${game}**.`);
        //let stream = args.slice(1).join(" ");
          if(args[0] == 'stream') return client.user.setGame(`${stream}`, 'https://twitch.tv/xcookietm'), message.channel.send(`${client.emojis.find(`name`, 'alert')} client started broadcasting live **${stream}**.`);
            //message.channel.send(`:wink: client zaczął nadawać na żywo **${stream}**.`);
          if(args[0] == 'listen') return client.user.setActivity(`${listen}`, {type: 'LISTENING'}), message.channel.send(`${client.emojis.find(`name`, 'alert')} client started to listen **${listen}**.`);
          if(args[0] == 'watch') return client.user.setActivity(`${watch}`, {type: 'WATCHING'}), message.channel.send(`${client.emojis.find(`name`, 'alert')} client began to watch **${watch}**.`);
          if(args[0] == 'reset') return client.user.setActivity(`${reset}`), message.channel.send(`${client.emojis.find(`name`, 'alert')} The status of the client has been reset.`);
          if(args[0] == 'servers') return client.user.setActivity(`${client.guilds.size} servers`), message.channel.send(`${client.emojis.find(`name`, 'alert')} The status of the client has been set to the number of servers.`);
        }
    }

    if(cmd === `${prefix}ticket`){
        let everyone = message.guild.roles.find(`name`, "@everyone");
        let ticketCreator = message.guild.members.find(`id`, `${message.author.id}`)
        let helpText = args.join(" ");
        let newTicketChannel = await message.guild.createChannel(`request-${message.author.id}`);
        let ticketEmbed = new Discord.RichEmbed()
        .addField('Request for help!', `**CREATED BY:** ${message.author.tag} \n**CONTENT:** ${helpText} \nAfter completing the help, the administration or the user waiting for help should react to the react below.`)
        let tChanelSend = await newTicketChannel.send(ticketEmbed);
        let reactChannel = await tChanelSend.react(client.emojis.find(`name`, 'success')).then(em => { message.channel.send('lol') });
        newTicketChannel.overwritePermissions(everyone, { SEND_MESSAGES: false, READ_MESSAGES: false });
        newTicketChannel.overwritePermissions(ticketCreator, { SEND_MESSAGES: true, READ_MESSAGES: true })
        message.channel.send(`${client.emojis.find(`name`, 'success')} Your request for help is ready, wait for a response from the administration on the **${newTicketChannel}** channel`);
        const filter = (reaction, user) => (reaction.emoji.name === '🇦') && user.id === message.author.id
        const collector = tChannelSend.createReactionCollector(filter);
        collector.on('collect', r => {
            if (r.emoji.name === "🇦") {
                message.channel.send('lOl');
            }
        });
    }

    if(cmd === `${prefix}uyar`){
        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        //if (args[0] == `${message.author.client}`) return;
        if (args[0] == `${message.author}`) return message.channel.send(`${client.emojis.find(`name`, 'error')} You can not give yourself a warn!`)
        let wUser = message.mentions.users.first();
        if (!wUser) return message.channel.send(`${client.emojis.find(`name`, 'error')} Is this user exists? Because I can not find him!`);
        const reason = args.join(" ").slice(22);

        if (!warns[wUser.id]) {
            warns[wUser.id] = {
                warns: 0
            };
        }

        warns[wUser.id].warns++;

        fs.writeFile("./uyarılar.json", JSON.stringify(warns), (err) => {
            if (err) console.log(err);
        });

        const warnEmbed = new Discord.RichEmbed()
        //.setDescription("WARN")
        .setAuthor(`[WARN] ${wUser.tag}`, wUser.displayAvatarURL)
        .setColor("#9b0090")
        //.addField("Warned user:", `${wUser}`)
        .addField("Channel:", message.channel)
        //.addField("O godzinie", moment(message.createdAt).format("YYYY.MM.DD, HH:mm:ss"))
        .addField("Number of warnings:", warns[wUser.id].warns)
        .addField("Moderator:", message.author.tag)
        .addField("Reason:", reason)
        .setFooter(`${message.createdAt.getHours()}:${message.createdAt.getMinutes()} | Warned on ${message.guild.name}.`)

        const warnchannel = message.guild.channels.find("name", "modlogs");
        if (!warnchannel) return message.reply(`${client.emojis.find(`name`, 'error')} The 'modlogs' channel does not exist! Create it, otherwise I will not give a warning!`);
        warnchannel.send(warnEmbed);

        if (warns[wUser.id].warns === 15) {
            message.guild.member(wUser).ban(reason);
            message.message.channel.send(`${client.emojis.find(`name`, 'alert')} The ${wUser.tag} user has been banned because he has reached the maximum number of warnings!`);
        }

        message.channel.send(`${client.emojis.find(`name`, 'success')} The **${wUser.tag}** user was successfully warned for **${reason}**!`);

    };

    if(cmd === `${prefix}uyarılar`){
        if (!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply(`${client.emojis.find(`name`, 'lock')}` + " You do not have sufficient permissions. You must have `MANAGE_MEMBERS` permissions.");
        let wUser = message.mentions.users.first();
        if (!wUser) return message.reply(`${client.emojis.find(`name`, 'error')} Is this user exists? Because I can not find him!`);
        const warns = warns[wUser.id].warns;
        let warnsEmbed = new Discord.RichEmbed()
        .addField(`User:`, wUser.tag)
        .addField(`Number of warnings:`, warns)
        message.channel.send(warnsEmbed);
    }

});

//let everyone = message.guild.roles.find(`name`, "@everyone");
//if(args[0] == 'lock') return message.channel.overwritePermissions(everyone, { SEND_MESSAGES: false, ADD_REACTIONS: false }), message.channel.send(`${client.emojis.find(`name`, 'success')} Okay, according to your wishes, I blocked this channel! Others can not write here.`);

client.login(process.env.BOT_TOKEN);
