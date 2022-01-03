const Discord = require('discord.js');
const Index = require('../index');
const RbxManager = require('../utils/RbxManager')

module.exports = {
    name: "notice",
    async execute(message, args, handler, client){
        if(await  handler.getPermissionLevel(message.member) < 4){
            const embed = new Discord.MessageEmbed()
              .setTitle('Insufficient permissions :warning:')
              .setColor("#ed0909")
              .setDescription(`You are missing the required permissions to execute this command.`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return;
        }

        const divname = (await handler.getConfig("Division-Name")).Value;
        const personnelid = (await handler.getConfig("Personnel-Id")).Value;
        const color = (await handler.getConfig("Divisional-Color")).Value;
        const prefix = await handler.getPrefix();

        if(await handler.isOnSpreadsheet(mesage.member.id) == false){
            const embed = new Discord.MessageEmbed()
            .setTitle('Not on the database :warning:')
            .setColor("#ed0909")
            .setDescription(`You are required to be in the database to run this command. If you aren't use **${prefix}filter**.`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;
        }

        if(args.length >= 1){
            const mention = message.mentions.users.first() || client.users.cache.get(args[0]);
            if(mention != undefined && mention != null && message.mentions.roles.first() == undefined && message.mentions.roles.first() == null){
                var members = message.mentions.users.first(message.mentions.users.size)
                var robloxid = await handler.getRobloxId(message.author.id);
                var name = await RbxManager.getNameFromId(robloxid);

                let string = [];
                for(m of members){
                    var member = m, user;
                    if(member) user = member.user;
                    if(member) user = await message.guild.members.fetch(member);
    
                    var txt = message.content.split(' ').splice(members.length+1).join(' ');
    
                    if(txt == null || txt == undefined){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('State a message :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Please specify a message for your notice.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
    
                        message.channel.send({embeds: [embed]}).catch(err => {});
                        return;
                    }

                    const embed = new Discord.MessageEmbed()
                    .setAuthor({name: name, iconURL: message.author.avatarURL()})
                    .setTitle(`${divname} Divisional Notice`)
                    .setDescription(txt)
                    .setColor(color)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    user.send({embeds: [embed]}).catch(err => {});
        
                    string.push(`${user.user.tag}`)
                }

                
                

                const success = new Discord.MessageEmbed()
                .setTitle("Divisional notice sent to: " + string)
                .setDescription(txt)
                .setColor("#56d402")
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [success]});
                

                return;
            }else if(message.mentions.roles.first() != undefined && message.mentions.roles.first() != null){
                var txt = message.content.split(" ").filter(arg => !arg.startsWith("<@&")).splice(1).join(" ");
                if(txt == null || txt == undefined || txt == ""){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('State a message :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Please specify a message for your notice.`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
                    return;
                }
                var robloxid = await handler.getRobloxId(message.author.id);
                var name = await RbxManager.getNameFromId(robloxid);

                var roles = message.mentions.roles.first(message.mentions.roles.size)
                new Promise((resolve, reject) => {
                    let sent = [];
                    for(role of roles){
                        client.guilds.cache.get(handler.getGuildID()).members.fetch().then(members => {
                            members.filter(member => member.roles.cache.find(trole => trole == role)).forEach((member)=>{
                                if(sent.includes(member.id)) return;

                                const embed = new Discord.MessageEmbed()
                                .setAuthor({name: name, iconURL: message.author.avatarURL()})
                                .setTitle(`${divname} Divisional Notice`)
                                .setDescription(txt)
                                .setColor(color)
                                .setFooter(Index.footer)
                                .setTimestamp();
        
                                member.send({embeds: [embed]}).catch(err => {});

                                sent.push(member.id);
                            })
                        })
                    }
                    resolve();
                }).then(() =>{
                    var rolestring = "";
                    for(role of roles){
                        rolestring = role.name + " " + rolestring;
                    }
                    const success = new Discord.MessageEmbed()
                    .setTitle("Divisional notice sent to: " + rolestring)
                    .setDescription(txt)
                    .setColor("#56d402")
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [success]});
                })
                return;
            }else{
                var txt = message.content.split(" ").filter(arg => !arg.startsWith("<@&")).splice(1).join(" ");
                if(txt == null || txt == undefined || txt == ""){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('State a message :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Please specify a message for your notice.`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
                    return;
                }
                var robloxid = await handler.getRobloxId(message.author.id);
                var name = await RbxManager.getNameFromId(robloxid); 

                const Role = client.guilds.cache.get(handler.getGuildID()).roles.cache.find(role => role.id == personnelid);
                new Promise((resolve, reject) =>{
                    client.guilds.cache.get(handler.getGuildID()).members.fetch().then(members => {
                        members.filter(member => member.roles.cache.find(role => role == Role)).forEach((member)=>{
                            const embed = new Discord.MessageEmbed()
                            .setAuthor({name: name, iconURL: message.author.avatarURL()})
                            .setTitle(`${divname} Divisional Notice`)
                            .setDescription(txt)
                            .setColor(color)
                            .setFooter(Index.footer)
                            .setTimestamp();
    
                            member.send({embeds: [embed]}).catch(err => {});
    
                            return;
                        })
                    })
                    resolve();
                }).then(() =>{
                    const success = new Discord.MessageEmbed()
                    .setTitle("Divisional notice sent to ALL Personnel")
                    .setDescription(txt)
                    .setColor("#56d402")
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [success]});
                })
                return;
            }


        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}notice <@User or @Role or blank for all personnel> <Message>`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}