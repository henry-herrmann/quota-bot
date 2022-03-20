const Discord = require('discord.js')
const Index = require("../index");
const timer = ms => new Promise(res => setTimeout(res, ms))

async function logInactivity(message, client, handler){
    let content = message.content;

    if(content == "" || content == null || content == undefined){

        if(await handler.getPermissionLevel(message.member) < 4){
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect Inactivity Notice :warning:')
            .setColor("#ed0909")
            .setImage("https://cdn.discordapp.com/attachments/660254839414063120/858360398700347422/unknown.png")
            .setDescription(`**Follow the format as in the picture below.**`)
            .setFooter(Index.footer)
            .setTimestamp();
        
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        } 
        
    }

    content = content.replace(/(\r\n|\n|\r)/gm, " ");

    if(content.toUpperCase().includes("DURATION OF ABSENCE [IN DAYS]:") || content.toUpperCase().includes("DURATION OF ABSENCE [IN DAYS]") || content.toUpperCase().includes("REASON:") || content.toUpperCase().includes("REASON")){
        if(await handler.getPermissionLevel(message.member) > 3) return;
        const embed = new Discord.MessageEmbed()
        .setTitle('Incorrect Inactivity Notice :warning:')
        .setColor("#ed0909")
        .setImage("https://cdn.discordapp.com/attachments/660254839414063120/858360398700347422/unknown.png")
        .setDescription(`**Follow the format as in the picture below.**`)
        .setFooter(Index.footer)
        .setTimestamp();
        
        message.author.send({embeds: [embed]}).catch(() =>{});
        message.delete().catch(() =>{});
        return;
    }

    let args = content.split(" ");

    if(args[0] == null || args[0] == undefined){
        if(await handler.getPermissionLevel(message.member) > 3) return;
        const embed = new Discord.MessageEmbed()
        .setTitle('Incorrect Inactivity Notice :warning:')
        .setColor("#ed0909")
        .setImage("https://cdn.discordapp.com/attachments/660254839414063120/858360398700347422/unknown.png")
        .setDescription(`**Follow the format as in the picture below.**`)
        .setFooter(Index.footer)
        .setTimestamp();
    
        message.author.send({embeds: [embed]}).catch(() =>{});
        message.delete().catch(() =>{});
        return;
    }

    const minDays = parseInt((await handler.getConfig("Inactivity-Notice-Minimum")).Value);
    const maxDays = parseInt((await handler.getConfig("Inactivity-Notice-Maximum")).Value);

    handler.isOnSpreadsheet(message.author.id).then(async (bool) =>{
        if(await handler.isOnInactivityNotice(message.author.id)){
            const embed = new Discord.MessageEmbed()
            .setTitle('You are already on an IN :warning:')
            .setColor("#ed0909")
            .setDescription(`You are currently on an IN. If you wish to have an extension, submit another IN right after this one expires.`)
            .setFooter(Index.footer)
            .setTimestamp();
    
            message.author.send({embeds: [embed]}).catch(() =>{});
            message.delete().catch(() =>{});
            return;
        }
        if(bool){
            var length = args[0];

            if(isNaN(length)){
                if(await handler.getPermissionLevel(message.member) > 3) return;
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Inactivity Notice :warning:')
                .setColor("#ed0909")
                .setDescription(`Please follow the correct format.\n__Errors in your message: Stated amount of **days** is not a number.__`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            }

            if(parseInt(length) < 1){
                if(await handler.getPermissionLevel(message.member) > 3) return;
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Inactivity Notice :warning:')
                .setColor("#ed0909")
                .setDescription(`**Sadly not even this glorious bot can turn back time.**`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            }
            if(parseInt(length) < minDays){
                if(await handler.getPermissionLevel(message.member) > 3) return;
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Inactivity Notice :warning:')
                .setColor("#ed0909")
                .setDescription(`**Inactivity Notices cannot be shorter than 3 days.**`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            }
            if(parseInt(length) > maxDays){
                if(await handler.getPermissionLevel(message.member) > 3) return;
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Inactivity Notice :warning:')
                .setColor("#ed0909")
                .setDescription(`**Inactivity Notices cannot be longer than 3 weeks which is 21 days.**`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            }
            var reason = args.splice(1);
            

            if(reason.includes("Days") || reason.includes("days") || reason.includes("DAYS") || reason.includes("Days")){
               reason = reason.splice(1);
            }

            if(!reason || reason == undefined || reason == ""){
                if(await handler.getPermissionLevel(message.member) > 3) return;
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect Inactivity Notice :warning:')
                .setColor("#ed0909")
                .setDescription(`**You have to state a reason.**`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.author.send({embeds: [embed]}).catch(() =>{});
                message.delete().catch(() =>{});
                return;
            }


            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
            const startDate = new Date(now.toString())



            const embed = new Discord.MessageEmbed()
            .setTitle("Inactivity Notice Appeal")
            .setColor("#003bed")
            .addField("User:", `<@${message.author.id}>`)
            .addField("Length in days:", length)
            .addField("Reason:", reason.join(" "))
            .setFooter({text: message.id + "ß" + message.author.id + "ß" + startDate.toString()})
            .setTimestamp();

            const inactivityappeals = await handler.getChannel("inactivity-appeals");

            client.channels.cache.get(inactivityappeals).send({embeds: [embed]}).then((msg) =>{
                msg.react("✅")
                msg.react("❌")
            })
           

           
        }else{
            var robloxid;

            try{
                robloxid = await DivisionHandler.getRobloxId(message.author.id, handler.getGuildID());
            }catch(error){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return;
            }

            handler.addMember(message.author.id, robloxid, message.member).then(async ()=>{
                var length = args[0];

                if(isNaN(length)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Please follow the correct format.\nErrors in your message: Stated amount of days is not a number.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
    
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }
                if(parseInt(length) < 1){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`**Sadly not even this glorious bot can turn back time.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }
                if(parseInt(length) < minDays){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`**Inactivity Notices cannot be shorter than 3 days.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }
                if(parseInt(length) > maxDays){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`**Inactivity Notices cannot be longer than 3 weeks which is 21 days.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }
                var reason = args.splice(1);
            

                if(reason.includes("Days") || reason.includes("days") || reason.includes("DAYS") || reason.includes("Days")){
                    reason = reason.splice(1);
                }

                if(!reason || reason == undefined){
                    if(await handler.getPermissionLevel(message.member) > 3) return;
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`**You have to state a reason.**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.author.send({embeds: [embed]}).catch(() =>{});
                    message.delete().catch(() =>{});
                    return;
                }

                const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                const startDate = new Date(now.toString());
    
                const embed = new Discord.MessageEmbed()
                .setTitle("Inactivity Notice Appeal")
                .setColor("#003bed")
                .addField("User:", `<@${message.author.id}>`)
                .addField("Length in days:", length)
                .addField("Reason:", reason.join(" "))
                .setFooter({text: message.id + "+" + message.author.id + "+" + startDate})
                .setTimestamp();

                const inactivityappeals = await handler.getChannel("inactivity-appeals");

                client.channels.cache.get(inactivityappeals).send({embeds: [embed]}).then((msg) =>{
                    msg.react("✅")
                    msg.react("❌")
                })
            })
        }
    })
}

async function checkINs(client, handler){
    const inactivityid = (await handler.getConfig("Inacitivty-Role-Id")).Value;
    const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;
    const newstaffid = (await handler.getConfig("New-Staff-Role-Id")).Value;
    const newid = (await handler.getConfig("New-Role-Id")).Value;

    handler.getNotices().then(async notices =>{
        if(notices.length > 0){
           for(notice of notices){
              const endDate = new Date(notice.EndDate);


              const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
              const today = new Date(now.toString());


                if(endDate.getDate() == today.getDate() && endDate.getMonth() == today.getMonth() && endDate.getFullYear() == today.getFullYear()){
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(notice.Id).then(async member =>{

                        member.roles.remove(client.guilds.cache.get(handler.getGuildID()).roles.cache.find(r => r.id == inactivityid)).catch(err => {});

                        if(!parseInt(notice.MessageID) == 0){
                            client.channels.cache.get(inactivitychannelid).messages.fetch(notice.MessageID).then((msg) =>{
                                if(msg != undefined && msg != null){
                                    msg.delete().catch(err =>{});
                                }
                            }).catch(err => {});
                        }

                        if(today.getDay() >= 4 || today.getDay() == 0){
                            if(await handler.getPermissionLevel(member) > 0){                      
                                member.roles.add(member.guild.roles.cache.find(r => r.id == newstaffid));                      
                            }else{                         
                                member.roles.add(member.guild.roles.cache.find(r => r.id == newid));                    
                            }
                        }

                        const txt = new Discord.MessageEmbed()
                        .setTitle(":construction_worker: Inactivity Notice Over :construction_worker:")
                        .setColor("#42c5f5")
                        .setDescription(`**Your IN ended, welcome back.**`)
                        .setFooter({text: Index.footer})
                        .setTimestamp();

                        member.send({embeds: [txt]}).catch(err => {});

    
                        handler.removeInactivityNotice(member.id)
                    })   
                    await timer(3000);
                }
            }
        }
    })
}

module.exports.logInactivity = logInactivity;
module.exports.checkINs = checkINs;