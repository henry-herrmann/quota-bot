const Discord = require('discord.js');
const Index = require('../index')
const RbxManager = require('../utils/RbxManager')
const DivisionHandler = require("../db/DivisionHandler");

module.exports ={
  name: "discharge",
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

            if(await  handler.getPermissionLevel(user) >= await  handler.getPermissionLevel(message.member)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Unable to discharge :warning:')
                .setColor("#ed0909")
                .setDescription(`Cannot discharge someone with the same or higher permissions.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }

            const joindatestring = await handler.getJoinDate(user.id);
            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
            const d = new Date(now.toString());
            var d1 = new Date(joindatestring);

            var d2 = new Date(d1.getTime()+(5*24*60*60*1000));


            var Daydifference =  (d.getTime() - d1.getTime()) / (1000 * 3600 * 24);


            if((5-(Daydifference)) < 5 && 5-(Daydifference) > 0){
                
                var days = Math.floor(5-Daydifference);
                var delta = Math.abs(d2 - d) / 1000;
                var hours = Math.floor(delta / 3600) % 24;
                var minutes = Math.floor(delta / 60) % 60;


                const daystring = days > 1 ? "days" : days < 1 && days == 1 ? "day" : days < 1 && days == 0 ? "days" : "days";
                const hourstring = hours > 1 ? "hours" : hours < 1 && hours == 1 ? "hour" : hours < 1 && hours == 0 ? "hours" : "hours";
                const minutestring = minutes > 1 ? "minutes" : minutes < 1 && minutes == 1 ? "minute" : minutes < 1 && minutes == 0 ? "minutes" : "minutes";

                const embed = new Discord.MessageEmbed()
                .setTitle('User not eligible for discharge :warning:')
                .setColor("#ed0909")
                .setDescription(`__Length of service **<** 5 days__\nRemaining time: **${days}** ${daystring}, **${hours}** ${hourstring} and **${minutes}** ${minutestring}.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})

                
                return;
            }

            if(await handler.isOnInactivityNotice(user.id)){
                const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;

                client.channels.cache.get(inactivitychannelid).messages.fetch({limit: 100}).then((messages) =>{
                    const msgs = messages.filter(m => m.author.id === user.id);
                    msgs.forEach((msg) =>{
                      if(msg != null && msg != undefined){
                        msg.delete().catch(() =>{});
                        return;
                      }
                    })
                })


                handler.removeInactivityNotice(user.id);
            }

            const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);

            
            handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                if(bool){
                  if(autorank == 1){
                    var robloxid = await handler.getRobloxId(user.id);
                    await RbxManager.exileUser(rbx, handler, robloxid)
                  }
        
                  await handler.removeMember(user.id);

                  const embed = new Discord.MessageEmbed()
                  .setTitle('User removed from the spreadsheet :white_check_mark:')
                  .setColor("#56d402")
                  .setDescription(`Successfully removed <@${user.id}> from the database. `)
                  .setFooter(Index.footer)
                  .setTimestamp();
                  message.channel.send({embeds: [embed]})

                  const txt = new Discord.MessageEmbed()
                  .setTitle("User Discharged")
                  .setColor("#42f581")
                  .setDescription(`User: <@${user.id}>\nDischarged by: <@${message.author.id}>`)
                  .setFooter(Index.footer)
                  .setTimestamp();
                                
                  client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});


                  const notice = new Discord.MessageEmbed()
                  .setTitle(":wave: You have been discharged. :wave:")
                  .setColor("#0456c2")
                  .addField("**If you weren't granted Guest, __please leave the discord.__**", `Thank you for your service. - ${handler.getDivisionName()} High Command`)
                  .setFooter(Index.footer)
                  .setTimestamp();

                  user.send({embeds: [notice]})

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

                  const embed = new Discord.MessageEmbed()
                  .setTitle('User not on the spreadsheet :warning:')
                  .setColor("#ed0909")
                  .setDescription(`<@${user.id}> is not on the spreadsheet, he is good to go.`)
                  .setFooter(Index.footer)
                  .setTimestamp();

                  message.channel.send({embeds: [embed]})

                  const txt = new Discord.MessageEmbed()
                  .setTitle("User Discharged")
                  .setColor("#42f581")
                  .setDescription(`User: <@${user.id}>\nDischarged by: <@${message.author.id}>`)
                  .setFooter(Index.footer)
                  .setTimestamp();
                               
                  client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});

                  const notice = new Discord.MessageEmbed()
                  .setTitle(":wave: You have been discharged. :wave:")
                  .setColor("#0456c2")
                  .addField("**If you weren't granted Guest, __please leave the discord.__**", `Thank you for your service. - ${handler.getDivisionName()} High Command`)
                  .setFooter(Index.footer)
                  .setTimestamp();

                  user.send({embeds: [notice]})
                  return; 
                }
            })
            
          }else if(args.length == 2){
            if(args[0] == "force"){
              if(message.mentions.users.first() == undefined && isNaN(args[1])){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Mention a user or provide a user id.`)
                .setFooter(Index.footer)
                .setTimestamp();
  
                message.channel.send({embeds: [embed]})
                return;
              }

              var member = message.mentions.users.first(), user;
              if(member) user = await message.guild.members.fetch(member);

              if(user == undefined){
                const fetcheduser = await message.guild.members.fetch(args[1]);

                if(await  handler.getPermissionLevel(fetcheduser) >= await  handler.getPermissionLevel(message.member)){
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Unable to discharge :warning:')
                  .setColor("#ed0909")
                  .setDescription(`Cannot discharge someone with the same or higher permissions.`)
                  .setFooter(Index.footer)
                  .setTimestamp();
  
                  message.channel.send({embeds: [embed]})
                  return;
                }
                if(await handler.isOnInactivityNotice(args[1])){
                  const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;
  
                  client.channels.cache.get(inactivitychannelid).messages.fetch({limit: 100}).then((messages) =>{
                      const msgs = messages.filter(m => m.author.id === args[1]);
                      msgs.forEach((msg) =>{
                        if(msg != null && msg != undefined){
                          msg.delete().catch(() =>{});
                          return;
                        }
                      })
                  })
    
    
                  handler.removeInactivityNotice(args[1]);
                }
                const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);
  
            
                handler.isOnSpreadsheet(args[1]).then(async (bool) =>{
                  if(bool){
                      if(autorank == 1){
                        var robloxid = await handler.getRobloxId(args[1]);
                        await RbxManager.exileUser(rbx, handler, robloxid);
                      }

                      await handler.removeMember(args[1]);
                      const embed = new Discord.MessageEmbed()
                      .setTitle('User removed from the spreadsheet :white_check_mark:')
                      .setColor("#56d402")
                      .setDescription(`Successfully removed <@${args[1]}> from the spreadsheet. `)
                      .setFooter(Index.footer)
                      .setTimestamp();
                      message.channel.send({embeds: [embed]})
  
                      const txt = new Discord.MessageEmbed()
                      .setTitle("User Discharged")
                      .setColor("#42f581")
                      .setDescription(`User: <@${args[1]}>\nDischarged by: <@${message.author.id}>`)
                      .setFooter(Index.footer)
                      .setTimestamp();
                                  
                      client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                  }else{
                    if(autorank == 1){
                      var robloxid1;

                      try{
                          robloxid1 = await DivisionHandler.getRobloxId(args[1]);
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

                    const embed = new Discord.MessageEmbed()
                    .setTitle('User not on the spreadsheet :warning:')
                    .setColor("#ed0909")
                    .setDescription(`<@${args[1]}> is not on the spreadsheet, he is good to go.`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
  
                    const txt = new Discord.MessageEmbed()
                    .setTitle("User Discharged")
                    .setColor("#42f581")
                    .setDescription(`User: <@${args[1]}>\nDischarged by: <@${message.author.id}>`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                                 
                    client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
                  }
                })
                return;
              }

              if(await  handler.getPermissionLevel(user) >= await  handler.getPermissionLevel(message.member)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Unable to discharge :warning:')
                .setColor("#ed0909")
                .setDescription(`Cannot discharge someone with the same or higher permissions.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
              } 
  
              if(await handler.isOnInactivityNotice(user.id)){
                const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;

                client.channels.cache.get(inactivitychannelid).messages.fetch({limit: 100}).then((messages) =>{
                    const msgs = messages.filter(m => m.author.id === user.id);
                    msgs.forEach((msg) =>{
                      if(msg != null && msg != undefined){
                        msg.delete().catch(() =>{});
                        return;
                      }
                    })
                })
  
  
                handler.removeInactivityNotice(user.id);
              }

              const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);
  
            
             handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                if(bool){
                    if(autorank == 1){
                      var robloxid = await handler.getRobloxId(user.id);
                      await RbxManager.exileUser(rbx, handler, robloxid);
                    }

                    await handler.removeMember(user.id);
                    const embed = new Discord.MessageEmbed()
                    .setTitle('User removed from the spreadsheet :white_check_mark:')
                    .setColor("#56d402")
                    .setDescription(`Successfully removed <@${user.id}> from the spreadsheet. `)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    message.channel.send({embeds: [embed]})
  
                    const txt = new Discord.MessageEmbed()
                    .setTitle("User Discharged")
                    .setColor("#42f581")
                    .setDescription(`User: <@${user.id}>\nDischarged by: <@${message.author.id}>`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                                
                    client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});
  
  
                    const notice = new Discord.MessageEmbed()
                    .setTitle(":wave: You have been discharged. :wave:")
                    .setColor("#0456c2")
                    .addField("**If you weren't granted Guest, __please leave the discord.__**", `Thank you for your service. - ${handler.getDivisionName()} High Command`)
                    .setFooter(Index.footer)
                    .setTimestamp();
  
                    user.send({embeds: [notice]})
  
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

                  const embed = new Discord.MessageEmbed()
                  .setTitle('User not on the spreadsheet :warning:')
                  .setColor("#ed0909")
                  .setDescription(`<@${user.id}> is not on the spreadsheet, he is good to go.`)
                  .setFooter(Index.footer)
                  .setTimestamp();

                  message.channel.send({embeds: [embed]})
  
                  const txt = new Discord.MessageEmbed()
                  .setTitle("User Discharged")
                  .setColor("#42f581")
                  .setDescription(`User: <@${user.id}>\nDischarged by: <@${message.author.id}>`)
                  .setFooter(Index.footer)
                  .setTimestamp();
                               
                  client.channels.cache.get(await handler.getChannel("react-logs")).send({embeds: [txt]});

                  const notice = new Discord.MessageEmbed()
                  .setTitle(":wave: You have been discharged. :wave:")
                  .setColor("#0456c2")
                  .addField("**If you weren't granted Guest, __please leave the discord.__**", `Thank you for your service. - ${handler.getDivisionName()} High Command`)
                  .setFooter(Index.footer)
                  .setTimestamp();

                  user.send({embeds: [notice]})
                  return; 
                }
              })
  
            }else{
              const embed = new Discord.MessageEmbed()
              .setTitle('Incorrect usage :warning:')
              .setColor("#ed0909")
              .setDescription(`>>> ${prefix}discharge @User or ${prefix}discharge force @User`)
              .setFooter(Index.footer)
              .setTimestamp();
  
              message.channel.send({embeds: [embed]})
              return; 
            }
            
          }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}discharge @User or ${prefix}discharge force @User`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
          }
    }
}