const Discord = require('discord.js')
const Index = require("../index")
const RbxManager = require("../utils/RbxManager");
const DivisionHandler = require("../db/DivisionHandler");

module.exports = {
    name: "ban",
    async execute(message, args, client, handler, rbx){
        if(await handler.getPermissionLevel(message.member) < 4){
            const embed = new Discord.MessageEmbed()
              .setTitle('Insufficient permissions :warning:')
              .setColor("#ed0909")
              .setDescription(`You are missing the required permissions to execute this command.`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return;
        }

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
            if(member) user = member.user;
            if(member) user = await message.guild.members.fetch(member);

            if(await  handler.getPermissionLevel(user) >= await  handler.getPermissionLevel(message.member)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Unable to ban :warning:')
                .setColor("#ed0909")
                .setDescription(`Cannot ban someone with the same or higher permissions.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }

            var reason = message.content.split(' ').splice(2).join(' ');

            if(reason == undefined || reason == null || reason == ""){
                reason = "Banned from the" + (await handler.getConfig("Division-Name")).Value
            }

            const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);

            handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                if(bool){
                    if(autorank == 1){
                        var robloxid = await handler.getRobloxId(user.id);
                        await RbxManager.exileUser(rbx, handler, robloxid)
                    }

                    const kickmsg = new Discord.MessageEmbed()
                    .setTitle(`:exclamation: You were banned from the ${(await handler.getConfig("Division-Name")).Value} :exclamation:`)
                    .setDescription(`Reason: **${reason}**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    user.send({embeds: [kickmsg]}).catch(() =>{});
                    

                    user.ban({reason: reason}).then(async ()=>{
                        await handler.removeMember(user.id);

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User banned and removed from the database :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Successfully banned ${user.user.tag} from the discord. They were also kicked from the group if the auto rank feature is enabled.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                    }).catch((error) =>{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Unable to ban user :warning:')
                        .setColor("#ed0909")
                        .setDescription(`I was unable to ban the mentioned user from the discord/spreadsheet. Make sure that my role is placed high enough.`)
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
                    .setTitle(`:exclamation: You were banned from the ${(await handler.getConfig("Division-Name")).Value} :exclamation:`)
                    .setDescription(`Reason: **${reason}**`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    user.send({embeds: [kickmsg]}).catch(() =>{});

                    user.ban({reason: reason}).then(()=>{

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User banned and removed from the database :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Successfully banned ${user.user.tag} from the discord. They were also kicked from the group if the auto rank feature is enabled.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                    }).catch((error) =>{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Unable to ban user :warning:')
                        .setColor("#ed0909")
                        .setDescription(`I was unable to ban the mentioned user from the discord. Make sure that my role is placed high enough.`)
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
              .setDescription(`>>> ${prefix}ban @User <Reason>`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return; 
        }
    }
}