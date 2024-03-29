const Discord = require('discord.js')
const Index = require("../index")
const RbxManager = require("../utils/RbxManager");
const DivisionHandler = require("../db/DivisionHandler");

module.exports = {
    name: "kick",
    async execute(message, args, client, handler, rbx){
        const prefix = await handler.getPrefix();

        if(await handler.isConfigured() == false){
            const embed = new Discord.MessageEmbed()
            .setTitle('Division already configured :warning:')
            .setColor("#ed0909")
            .setDescription(`The setup process has yet to be executed. Please use the **${prefix}setup** command.`)
            .setFooter(Index.footer)
            .setTimestamp();
                  
            message.channel.send({embeds: [embed]})
            return;
        }

        if(await handler.isConfigured() == false){
            const embed = new Discord.MessageEmbed()
            .setTitle('Division already configured :warning:')
            .setColor("#ed0909")
            .setDescription(`The setup process is finished already. Please use the **${prefix}change** command.`)
            .setFooter(Index.footer)
            .setTimestamp();
                  
            message.channel.send({embeds: [embed]})
            return;
        }

        const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);

        if(args.length >= 1){
            if(message.mentions.users.first() == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Mention a user.`)
                .setFooter(Index.footer)
                .setTimestamp();
  
                message.channel.send({embeds: [embed]})
                return;
            }
            const mention = message.mentions.users.first() || client.users.cache.get(args[0]);
            if(!mention){
              const embed = new Discord.MessageEmbed()
              .setTitle('Error :warning:')
              .setColor("#ed0909")
              .setDescription(`Mention a user.`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return;
            }
            var member = message.mentions.users.first(), user;
            if(member) user = await message.guild.members.fetch(member);

            if(await  handler.getPermissionLevel(user) >= await  handler.getPermissionLevel(message.member)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Unable to kick :warning:')
                .setColor("#ed0909")
                .setDescription(`Cannot kick someone with the same or higher permissions.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }

            var reason = message.content.split(' ').splice(2).join(' ');

            if(reason == undefined || reason == null || reason == ""){
                reason = "Kicked from the " + (await handler.getConfig("Division-Name")).Value
            }

            handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                if(bool){
                    if(autorank == 1){
                        var robloxid = await handler.getRobloxId(user.id);
                        await RbxManager.exileUser(rbx, handler, robloxid);
                    }

                    const kickmsg = new Discord.MessageEmbed()
                    .setTitle(`:exclamation: You were kicked from the ${(await handler.getConfig("Division-Name")).Value} :exclamation:`)
                    .setDescription(`Reason: **${reason}**`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    user.send({embeds: [kickmsg]}).catch(() =>{});
                    

                    user.kick({reason: reason}).then(async ()=>{
                        await handler.removeMember(user.id);

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User kicked and removed from the database :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Successfully kicked ${user.user.tag} from the discord. \nThey were also removed from the database.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})

                        const kick = new Discord.MessageEmbed()
                        .setTitle('User kicked')
                        .setDescription(`User: ${user.user.tag}\nReason: ${reason}\nBy: <@${message.author.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        client.channels.cache.get(react_logs).send({embeds: [kick]});
                    }).catch((error) =>{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Unable to ban user :warning:')
                        .setColor("#ed0909")
                        .setDescription(`I was unable to kick the mentioned user from the discord/spreadsheet. Make sure that my role is placed high enough.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                        return;
                    })
                }else{
                    if(autorank == 1){
                        var robloxid1;

                        try{
                            robloxid1 = await DivisionHandler.getRobloxId(user.id);
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
            
                        if(robloxid1 == undefined || robloxid1 == null){
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Error :warning:')
                            .setColor("#ed0909")
                            .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                            return;
                        }
                        await RbxManager.exileUser(rbx, handler, robloxid1)
                    }

                    const kickmsg = new Discord.MessageEmbed()
                    .setTitle(`:exclamation: You were kicked from the ${(await handler.getConfig("Division-Name")).Value} :exclamation:`)
                    .setDescription(`Reason: **${reason}**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    user.send({embeds: [kickmsg]}).catch(() =>{});

                    user.kick({reason: reason}).then(()=>{

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User kicked and removed from the database :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Successfully kicked ${user.user.tag} from the discord.\nRemoved from the group`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                        
                        const kick = new Discord.MessageEmbed()
                        .setTitle('User kicked')
                        .setDescription(`User: ${user.user.tag}\nReason: ${reason}\nBy: <@${message.author.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        client.channels.cache.get(react_logs).send({embeds: [kick]});
                    }).catch((error) =>{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Unable to kick user :warning:')
                        .setColor("#ed0909")
                        .setDescription(`I was unable to kick the mentioned user from the discord. Make sure that my role is placed high enough.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                        return;
                    })
                }
            })
        }else{
            const embed = new Discord.MessageEmbed()
              .setTitle('Incorrect usage :warning:')
              .setColor("#ed0909")
              .setDescription(`>>> ${prefix}kick @User <Reason>`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return; 
        }
    }
}