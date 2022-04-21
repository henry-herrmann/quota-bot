const Discord = require('discord.js')
const Index = require("../index");
const dateFormat = require("dateformat")

async function logAttendeeEvent(message, client, handler){
    if(await handler.isConfigured() == false){
        return;
    }
    const args = message.content.split("<");
    if(message.mentions.users.first() == undefined){
        const embed = new Discord.MessageEmbed()
        .setTitle('Incorrect Event Log :warning:')
        .setColor("#ed0909")
        .setDescription(`Example for format: \n\u200B\nCT\n<@282590125408387073>`)
        .setFooter(Index.footer)
        .setTimestamp();

        message.author.send({embeds: [embed]}).catch(() =>{});
        message.delete().catch(() =>{});
        return;
    }
    if(message.content.includes("Event:") || message.content.includes("Ping the host:")){
        const embed = new Discord.MessageEmbed()
        .setTitle('Incorrect Event Log :warning:')
        .setColor("#ed0909")
        .setDescription(`Example for format: \n\u200B\nCT\n<@282590125408387073>`)
        .setFooter(Index.footer)
        .setTimestamp();

        message.author.send({embeds: [embed]}).catch(() =>{});
        message.delete().catch(() =>{});
        return;
    }

    const mention = message.mentions.users.first() || client.users.cache.get(args[3]);
    if(!mention){
        const embed = new Discord.MessageEmbed()
        .setTitle('Incorrect Event Log :warning:')
        .setColor("#ed0909")
        .setDescription(`Example for format: \n\u200B\nCT\n<@282590125408387073>`)
        .setFooter(Index.footer)
        .setTimestamp();

        message.author.send({embeds: [embed]}).catch(() =>{});
        message.delete().catch(() =>{});
        return;
    }

    var member = message.mentions.users.first(), user;
    if(member) user = await message.guild.members.fetch(member);

    var eventtype = args[0];

    eventtype = eventtype.replace(/(\r\n|\n|\r)/gm, "");
    eventtype = eventtype.replace(" ", "-")


    const embed = new Discord.MessageEmbed()
    .setTitle("Activity log Approval Required")
    .setDescription(`Event type: ** ${eventtype} ** \nAttendee: **<@${message.author.id}>** \nHost: [<@${user.id}>] `)
    .setFooter({text: `${message.author.id}+${message.id}`})
    .setTimestamp();

    const logging = await handler.getChannel("logging");
        
    message.guild.channels.cache.find(c => c.id == logging).send({embeds: [embed]}).then((msg) =>{
        msg.react("1️⃣")
        msg.react("2️⃣")
        msg.react("❌")
    });

    
}
async function logHostEvent(message, handler){
    if(await handler.isConfigured() == false){
        return;
    }
    var eventtype = message.content;

    let messageAttachment = message.attachments.size > 0 ? message.attachments.first().url : null;


    if(messageAttachment == null){
        if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)) {
            const args = message.content.split("http");
            var type = args[0]
            const temp = args[1];
            const link = "http" + temp;

            type = type.replace(/(\r\n|\n|\r)/gm, "");
            type = type.replace(/\s+/g, '');

            const txt = `${type} \n<@${message.author.id}> \n${link} \n+${message.author.id}+${message.id}`;

            const logging = await handler.getChannel("logging");
        
            message.guild.channels.cache.find(c => c.id == logging).send(txt).then((msg) =>{
                msg.react("1️⃣")
                msg.react("2️⃣")
                msg.react("❌")
            });
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Event Log :warning:')
            .setColor("#ed0909")
            .setDescription(`Example for format: \n\u200B\nCT\nAttach picture for proof.`)
            .setFooter(Index.footer)
            .setTimestamp();
    
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
        
    }else{
        if(eventtype == undefined || eventtype == "" || eventtype == null){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Event Log :warning:')
            .setColor("#ed0909")
            .setDescription(`Example for format: \n\u200B\nCT\nAttach picture for proof.`)
            .setFooter(Index.footer)
            .setTimestamp();
    
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }

        eventtype = eventtype.replace(" ", "-")
    
        const embed = new Discord.MessageEmbed()
        .setTitle("Event log Approval Required")
        .setDescription(`Event type: ** ${eventtype} ** \nHost: [<@${message.author.id}>]`)
        .setFooter({text: `${message.author.id}+${message.id}`})
        .setTimestamp();
    
        const logging = await handler.getChannel("logging");
        
        message.guild.channels.cache.find(c => c.id == logging).send({embeds: [embed], files: [messageAttachment]}).then((msg) =>{
            msg.react("1️⃣")
            msg.react("2️⃣")
            msg.react("❌")
        });
    }
}

async function logPatrol(message, client, handler){

    if(await handler.isConfigured() == false){
        return;
    }

    let messageAttachment = message.attachments.size > 0 ? message.attachments.first().url : null; 
    let content = message.content;

    const twopictures = (await handler.getConfig("Two-Pictures-Patrols")).Value;
    const patrolminutes = parseInt((await handler.getConfig("Patrol-Minutes")).Value);

    if(content.includes("Time spent patrolling") || content.includes("Screenshot proof") || content.includes("spent patrolling") || content.includes("Time") || content.includes("patrolling")){
        if(parseInt(twopictures) == 1){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
            .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/926510080877273170/unknown.png")
            .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
    }

    if(content == "" || content == null || content == undefined){
        if(parseInt(twopictures) == 1){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
            .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/926510080877273170/unknown.png")
            .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
    }

    content = content.replace(/(\r\n|\n|\r)/gm, " ");

    let args = content.split(" ");

    if(args[0] == undefined || args[0] == null){
        if(parseInt(twopictures) == 1){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
            .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/926510080877273170/unknown.png")
            .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
    }

    var timespent = args[0];


    if(isNaN(timespent)){
        if(parseInt(twopictures) == 1){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
            .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/926510080877273170/unknown.png")
            .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
    }
    const vouch = message.mentions.users.first() || client.users.cache.get(args[2]);

    if(message.attachments.size  > 1){
        if(parseInt(twopictures) == 1){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
            .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/921720254193889280/unknown.png")
            .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
    }

    if(vouch == null || vouch == undefined || new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)){
        if(messageAttachment == null){
            if(new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(message.content)) {
                if(vouch != undefined && vouch != null){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Patrol Log :warning:')
                    .setColor("#ed0909")
                    .setImage("https://cdn.discordapp.com/attachments/702147293150707805/921720254193889280/unknown.png")
                    .setDescription(`**Provide a screenshot of your patrol timer or ping 2+ people.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
    
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }

                const args = message.content.split("http");

                var time = args[0]

                if(parseInt(time) < patrolminutes){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Patrol time too short :warning:')
                    .setColor("#ed0909")
                    .setDescription(`You can only log a patrol which is longer or equals to **${patrolminutes} minute/minutes.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
    
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }

                const temp = args[1];
                var link = "http" + temp;
                link = link.replace(/(\r\n|\n|\r)/gm, "");

                const temp2 = args[2];
                if(temp2 != null && temp2 != undefined){
                    
                    if(parseInt(twopictures) == 1){
                        var link2 = "http" + temp2;
                        link2 = link2.replace(/(\r\n|\n|\r)/gm, "");
                        time = time.replace(/(\r\n|\n|\r)/gm, "");
                        time = time.replace(/\s+/g, '');
    
                        var points = Math.trunc(parseInt(time) / patrolminutes);
                        
                        const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                        const datestring = new Date(now.toString())
    
                        var date = dateFormat(datestring, "m/d/yy hh:MM TT")
        
                        const txt = `${time} \n<@${message.author.id}> \n ${points} \n${link} \n ${link2} \n+${message.author.id}+${message.id}+Patrol+${date} EST`;
        
                        const logging = await handler.getChannel("logging");
        
                        message.guild.channels.cache.find(c => c.id == logging).send(txt).then((msg) =>{
                            msg.react("✅")
                            msg.react("❌")
                        });
                    }else{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect Patrol Log :warning:')
                        .setColor("#ed0909")
                        .setImage("https://cdn.discordapp.com/attachments/702147293150707805/921720758034645012/unknown.png")
                        .setDescription(`**Only provide one screenshot of your patrol timer or ping 2 people.**`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.author.send({embeds: [embed]}).catch(() =>{});
                        message.delete().catch(() =>{});
                        return;
                    }     
                }else{
                    if(parseInt(twopictures) == 0){
                        time = time.replace(/(\r\n|\n|\r)/gm, "");
                        time = time.replace(/\s+/g, '');
    
                        var points = Math.trunc(parseInt(time) / patrolminutes);
          
    
                        const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                        const datestring = new Date(now.toString())
    
                        var date = dateFormat(datestring, "m/d/yy hh:MM TT")
        
                        const txt = `${time} \n<@${message.author.id}> \n ${points} \n${link} \n+${message.author.id}+${message.id}+Patrol+${date} EST`;
        
                        const logging = await handler.getChannel("logging");
            
                        message.guild.channels.cache.find(c => c.id == logging).send(txt).then((msg) =>{
                            msg.react("✅")
                            msg.react("❌")
                        });
                    }else{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect Patrol Log :warning:')
                        .setColor("#ed0909")
                        .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
                        .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.author.send({embeds: [embed]}).catch(() =>{});
                        message.delete().catch(() =>{});
                        return;
                    }
                }
    
                
            }else{
                if(parseInt(twopictures) == 1){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Patrol Log :warning:')
                    .setColor("#ed0909")
                    .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
                    .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }else{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Patrol Log :warning:')
                    .setColor("#ed0909")
                    .setImage("https://cdn.discordapp.com/attachments/702147293150707805/921720758034645012/unknown.png")
                    .setDescription(`**Only provide one screenshot of your patrol timer or ping 2 people.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }
            }
        }else{
            if(parseInt(twopictures) == 0){
                var points = Math.trunc(parseInt(timespent) / patrolminutes);

                if(parseInt(timespent) < patrolminutes){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Patrol time too short :warning:')
                    .setColor("#ed0909")
                    .setDescription(`You can only log a patrol which is longer or equals to **${patrolminutes} minute/minutes.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }

                const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                const datestring = new Date(now.toString())
                var date = dateFormat(datestring, "m/d/yy hh:MM TT")

                const embed = new Discord.MessageEmbed()
                .setTitle("Patrol log Approval Required")
                .setDescription(`Time spent: ** ${timespent} ** \nPoints to add: **${points}**\nUser: [<@${message.author.id}>]`)
                .addField("Date" , date + " EST")
                .setFooter({text: `${message.author.id}+${message.id}`})
                .setTimestamp();
            
                const logging = await handler.getChannel("logging");
        
                message.guild.channels.cache.find(c => c.id == logging).send({embeds: [embed], files: [messageAttachment]}).then((msg) =>{
                    msg.react("✅")
                    msg.react("❌")
                });
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Patrol Log :warning:')
                .setColor("#ed0909")
                .setImage("https://cdn.discordapp.com/attachments/702147293150707805/927639663659864135/unknown.png")
                .setDescription(`**Please provide two screenshots or ping 2+ people.**`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            } 
        }
    }else{

        const mention = message.mentions.users.first() || client.users.cache.get(args[1]);
        const mention2 = Array.from(message.mentions.users)[1] || client.users.cache.get(args[2]);

        if(!mention || !mention2){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Patrol Log :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/702147293150707805/921720582427541504/unknown.png")
            .setDescription(`**Please mention two different ${handler.getDivisionName()} members.**`)
            .setFooter(Index.footer)
            .setTimestamp();
    
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }


        var member = message.mentions.users.first(), user;
        if(member) user = await message.guild.members.fetch(member);

        var member2 = Array.from(message.mentions.users)[1][1], user2;
        if(member2) user2 = await message.guild.members.fetch(member2);

        var points = Math.trunc(parseInt(timespent) / patrolminutes);

        if(parseInt(timespent)< patrolminutes){
           const embed = new Discord.MessageEmbed()
           .setTitle('Patrol time too short :warning:')
           .setColor("#ed0909")
           .setDescription(`You can only log a patrol which is longer or equals to **${patrolminutes} minute/minutes.**`)
           .setFooter(Index.footer)
           .setTimestamp();
           message.author.send({embeds: [embed]}).catch(() =>{});
           message.delete().catch(() =>{});
           return;
        }

        const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
        const datestring = new Date(now.toString())

        var date = dateFormat(datestring, "m/d/yy hh:MM TT")

        const embed = new Discord.MessageEmbed()
        .setTitle("Patrol log Approval Required")
        .setDescription(`Time spent: ** ${timespent} **\nVouch: <@${user.id}>+<@${user2.id}> \nPoints to add: **${points}**\nUser: [<@${message.author.id}>]`)
        .addField("Date", date + " EST")
        .setFooter({text: `${message.author.id}+${message.id}+**${date}**`})
        .setTimestamp();
        const logging = await handler.getChannel("logging");
    
        message.guild.channels.cache.find(c => c.id == logging).send({embeds: [embed]}).then((msg) =>{
           msg.react("✅")
           msg.react("❌")
        }); 
    }
}

module.exports.logAttendeeEvent = logAttendeeEvent;
module.exports.logHostEvent = logHostEvent;
module.exports.logPatrol = logPatrol;