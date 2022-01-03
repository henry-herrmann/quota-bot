const Discord = require('discord.js');
const Index = require('../index.js');
const timer = ms => new Promise(res => setTimeout(res, ms))
const RbxManager = require('../utils/RbxManager')
const DivisionHandler = require("../db/DivisionHandler");

module.exports = {
    name: "filter",
    async execute(message, args, client, handler, rbx){
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
        if(args.length == 1){
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

            const personnelid = (await handler.getConfig("Personnel-Id")).Value;
            const newstaffid = (await handler.getConfig("New-Staff-Role-Id")).Value;
            const newid = (await handler.getConfig("New-Role-Id")).Value;


            handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                if(!bool){
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(user.id, handler.getGuildID());
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
        
                    if(robloxid == undefined || robloxid == null){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
          
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                    if(await RbxManager.isPending(rbx, handler, robloxid) != false){
                        if(await RbxManager.acceptIntotheGroup(rbx, handler, robloxid) != false){
                            await handler.addMember(user.id, robloxid, user).then(async ()=>{
                                user.roles.add(user.guild.roles.cache.find(r => r.id == personnelid)).catch(err =>{});

                                const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                                const date = new Date(now.toString())

                                if(date.getDay() >= 4 || date.getDay() == 0){
                                    if(await  handler.getPermissionLevel(user) >= 1){
                                        user.roles.add(user.guild.roles.cache.find(r => r.id == newstaffid)).catch(err =>{});
                                    }else{
                                        user.roles.add(user.guild.roles.cache.find(r => r.id == newid)).catch(err =>{});
                                    }
                                      
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('User added and accepted to the group :white_check_mark:')
                                .setColor("#56d402")
                                .setDescription(`<@${user.id}> with the Roblox Id ${robloxid} was added to the database and accepted into the group`)
                                .setFooter(Index.footer)
                                .setTimestamp();
        
                                message.channel.send({embeds: [embed]}).then((msg) =>{
                                    setTimeout(() => {msg.delete()}, 3000)
                                })
        
                                const txt = new Discord.MessageEmbed()
                                .setTitle("User filtered in")
                                .setColor("#327ba8")
                                .setDescription(`User: <@${user.id}>\nAccepted into the group: **True**\n Filtered by: <@${message.author.id}>`)
                                .setFooter(Index.footer)
                                .setTimestamp();

                                if(parseInt((await handler.getConfig("Announce-Members")).Value) == 1){
                                    handler.filteredplayers.push(user.id)
                                }
                                
                                client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                            })
                        }
                    }else{
                        const ingroup = await RbxManager.isInGroup(rbx, handler, robloxid);
                        if(ingroup == false){
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Please pend for the ${(await handler.getConfig("Division-Name")).Value} group :exclamation:`)
                            .setColor("#ed0909")
                            .setDescription(`Please pend for this group: \nhttps://www.roblox.com/groups/${(await handler.getConfig("Roblox-Group-Id")).Value}\n**Once you pend for group DM a member of HiCom.**`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                            user.send({embeds: [embed]})
                        }
                        
        
                        await handler.addMember(user.id, robloxid, user).then(async ()=>{
                            user.roles.add(user.guild.roles.cache.find(r => r.id == personnelid)).catch(err =>{});

                            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                            const date = new Date(now.toString())

                            if(date.getDay() >= 4 || date.getDay() == 0){
                                if(await  handler.getPermissionLevel(user) >= 1){
                                    user.roles.add(user.guild.roles.cache.find(r => r.id == newstaffid)).catch(err =>{});
                                }else{
                                    user.roles.add(user.guild.roles.cache.find(r => r.id == newid)).catch(err =>{});
                                }
                                      
                             }
        
                            
                            const embed = new Discord.MessageEmbed()
                            .setTitle('User filtered :white_check_mark:')
                            .setColor("#56d402")
                            .setDescription(`<@${user.id}> with the Roblox Id ${robloxid} was added to the spreadsheet`)
                            .setFooter(Index.footer)
                            .setTimestamp();
        
                            message.channel.send({embeds: [embed]}).then((msg) =>{
                                setTimeout(() => {msg.delete()}, 3000)
                            })

                            if(parseInt((await handler.getConfig("Announce-Members")).Value) == 1){
                                handler.filteredplayers.push(user.id)
                            }

                            const txt = new Discord.MessageEmbed()
                            .setTitle("User filtered in")
                            .setColor("#327ba8")
                            .setDescription(`User: <@${user.id}>\nAccepted into the group: **${ingroup}**\n Filtered by: <@${message.author.id}>`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                            
                            client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                        })
                    }
                }else{
                    var robloxid = await handler.getRobloxId(user.id);
                    if(await RbxManager.isPending(rbx, handler, robloxid) != false){
                        if(await RbxManager.acceptIntotheGroup(rbx, handler, robloxid) != false){
                            user.roles.add(user.guild.roles.cache.find(r => r.id == personnelid)).catch(err =>{});

                            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                            const date = new Date(now.toString())

                            if(date.getDay() >= 4 || date.getDay() == 0){
                                if(await  handler.getPermissionLevel(user) >= 1){
                                    user.roles.add(user.guild.roles.cache.find(r => r.id == newstaffid)).catch(err =>{});
                                }else{
                                    user.roles.add(user.guild.roles.cache.find(r => r.id == newid)).catch(err =>{});
                                }
                                      
                            }
        
                            const embed = new Discord.MessageEmbed()
                            .setTitle('User added :white_check_mark:')
                            .setColor("#56d402")
                            .setDescription(`<@${user.id}> with the Roblox Id ${robloxid} was accepted into the group`)
                            .setFooter(Index.footer)
                            .setTimestamp();
        
                            message.channel.send({embeds: [embed]}).then((msg) =>{
                                setTimeout(() => {msg.delete()}, 3000)
                            })

                            const txt = new Discord.MessageEmbed()
                            .setTitle("User filtered in")
                            .setColor("#327ba8")
                            .setDescription(`User: <@${user.id}>\nAccepted into the group: **True**\n Filtered by: <@${message.author.id}>`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                                
                            if(parseInt((await handler.getConfig("Announce-Members")).Value) == 1){
                                handler.filteredplayers.push(user.id)
                            }
                                
                            client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                        }
                    }else{
                        const ingroup = await RbxManager.isInGroup(rbx, handler, robloxid);
                        if(ingroup == false){
                            const embed = new Discord.MessageEmbed()
                            .setTitle(`Please pend for the ${(await handler.getConfig("Division-Name")).Value} group :exclamation:`)
                            .setColor("#ed0909")
                            .setDescription(`Please pend for this group: \nhttps://www.roblox.com/groups/${(await handler.getConfig("Roblox-Group-Id")).Value}\n**Once you pend for group DM a member of HiCom.**`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                            user.send({embeds: [embed]})
                        }
        
                        user.roles.add(user.guild.roles.cache.find(r => r.id == personnelid)).catch(err =>{});

                        const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                        const date = new Date(now.toString())

                        if(date.getDay() >= 4 || date.getDay() == 0){
                            if(await  handler.getPermissionLevel(user) >= 1){
                                user.roles.add(user.guild.roles.cache.find(r => r.id == newstaffid)).catch(err =>{});
                            }else{
                                user.roles.add(user.guild.roles.cache.find(r => r.id == newid)).catch(err =>{});
                            }
                                      
                        }

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User filtered :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`<@${user.id}> with the Roblox Id ${robloxid} was filtered in.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
        
                        message.channel.send({embeds: [embed]}).then((msg) =>{
                           setTimeout(() => msg.delete(), 4000)
                        })

                        const txt = new Discord.MessageEmbed()
                        .setTitle("User filtered in")
                        .setColor("#327ba8")
                        .setDescription(`User: <@${user.id}>\nAccepted into the group: **${ingroup}**\n Filtered by: <@${message.author.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        if(parseInt((await handler.getConfig("Announce-Members")).Value) == 1){
                            handler.filteredplayers.push(user.id)
                        }
                                
                        client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                    }
                    
                }
            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${await handler.getPrefix()}filter @User`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}


