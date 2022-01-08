const Discord = require("discord.js");
const Index = require("../index");
const DivisionHandler = require("../db/DivisionHandler");

module.exports = {
    name: "update",
    async execute(message, args, handler){
        const prefix = await handler.getPrefix();

        if(await handler.isConfigured() == false){
            const embed = new Discord.MessageEmbed()
            .setTitle('Division already configured :warning:')
            .setColor("#ed0909")
            .setDescription(`The setup process has yet to be executed. Please tell your CO to use the **${prefix}setup** command.`)
            .setFooter(Index.footer)
            .setTimestamp();
                  
            message.channel.send({embeds: [embed]})
            return;
        }

        if(args.length == 0){
            const personnelid = (await handler.getConfig("Personnel-Id")).Value;

            if(!message.member.roles.cache.some(r => r.id == personnelid)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Only members with the Personnel role can use this command.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]})
                return;
            }

            if(handler.updatecooldown.includes(message.member.id)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`You can only run this command every 30 seconds.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]})
                return;
            }

            handler.isOnSpreadsheet(message.member.id).then(async (bool) =>{
                if(bool){
                    var id = await handler.getRobloxId(message.member.id);

                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(message.member.id, handler.getGuildID());
                    }catch(error){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`You are not linked with bloxlink. Please visit https://blox.link/verify/ and select this discord server.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }

                    if(parseInt(robloxid) != id){
                        handler.updateRobloxId(message.member.id, robloxid).then(() =>{
                            const embed = new Discord.MessageEmbed()
                            .setTitle('User updated')
                            .setColor("#56d402")
                            .setAuthor({name: message.author.username, iconURL: message.author.avatarURL()})
                            .addField("Roblox Id", robloxid, true)
                            .setFooter(Index.footer)
                            .setTimestamp();
    
                            message.channel.send({embeds: [embed]})
                        }).catch(err =>{
                            const embed = new Discord.MessageEmbed()
                            .setTitle('There was an error with the database, please contact Henryhre.')
                            .setColor("#ed0909")
    
                            message.channel.send({embeds: [embed]})
                        })
                    }else{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('This user is all up-to date; no changes were made.')
                        .setColor("#ed0909")

                        message.channel.send({embeds: [embed]})
                    }

                    handler.updatecooldown.push(message.member.id);

                    setTimeout(() =>{
                        const index = handler.updatecooldown.indexOf(message.member.id);
                        if(index > -1){
                            handler.updatecooldown.splice(index, 1);
                        }
                    }, 30000);
                }
            })
        }else if(args.length == 1){
            if(await handler.getPermissionLevel(message.member) < 3){
                return;
            }
            if(message.mentions.users.first() == undefined || message.mentions.users.first() == null){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Mention a user.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]})
                return;
            }

            var member = message.mentions.users.first();
            if(member) var user = await message.guild.members.fetch(member);

            if(!user.roles.cache.some(r => r.id == personnelid)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Only members with the Personnel role can use this command.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]})
                return;
            }

            var id = await handler.getRobloxId(user.id);

            var robloxid;

            try{
                robloxid = await DivisionHandler.getRobloxId(user.id, handler.getGuildID());
            }catch(error){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`The user is not linked with bloxlink. Please tell him to visit https://blox.link/verify/ and to select this discord server.`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]})
                return;
            }

            if(parseInt(robloxid) != id){
                handler.updateRobloxId(user.id, robloxid).then(() =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('User updated')
                    .setColor("#56d402")
                    .setAuthor({name: member.username, iconURL: member.avatarURL()})
                    .addField("Roblox Id", robloxid, true)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    message.channel.send({embeds: [embed]})
                }).catch(err =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('There was an error with the database, please contact Henryhre.')
                    .setColor("#ed0909")
                    message.channel.send({embeds: [embed]})
                })
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('The user is all up-to date; no changes were made.')
                .setColor("#ed0909")

                message.channel.send({embeds: [embed]})
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}update ${await handler.getPermissionLevel(message.member) >= 4 ? "(<@User>)" : ""}`)
            .setFooter(Index.footer)
            .setTimestamp();
              
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}