const Discord = require("discord.js");
const Index = require("../index");
const DivisionHandler = require("../db/DivisionHandler")

module.exports = {
    name: "points",
    async execute(message, args, handler, client){
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

        const personnelid = (await handler.getConfig("Personnel-Id")).Value;

        if(!message.member.roles.cache.some(r => r.id == personnelid)){
            const embed = new Discord.MessageEmbed()
            .setTitle('Error :warning:')
            .setColor("#ed0909")
            .setDescription(`Only members with the Personnel role and those who are meant to be in the database can use this command.`)
            .setFooter(Index.footer)
            .setTimestamp();
    
            message.channel.send({embeds: [embed]})
            return;
        }

        const permlevel = await handler.getPermissionLevel(message.member);
        const supportsPatrols = handler.supportsPatrols();
        const color = (await handler.getConfig("Divisional-Color")).Value;

        if(args.length == 0){
            const attendquota = await handler.getAttendanceQuota();
            const hostingquota = await handler.getHostingQuota();
            const staffattendquota = await handler.getStaffAttendQuota();

            const attendpoints = await handler.getAttendancePoints(message.member.id);
            const hostpoints = await handler.getHostingPoints(message.member.id);

            if(supportsPatrols){
                const patrolquota = await handler.getPatrolQuota();
                const staffpatrolqutoa = await handler.getStaffPatrolQuota();

                if(await handler.isOnSpreadsheet(message.member.id) == false){
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(message.member.id, handler.getGuildID());
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
                        .setDescription(`You are not linked to Bloxlink. Please run the /verify command.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
          
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                    handler.addMember(message.member.id, robloxid, message.member).then(async () =>{
                        const patrolpoints = await handler.getPatrolPoints(message.member.id);
    
                        if(permlevel >= 1){
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n- Patrol: ${patrolquota}\n\n__Staff__:\n- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\n- Patrol: ${staffpatrolqutoa}\u200B`)
                            .addField("**Your stats:**", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}\n- Patrol: ${patrolpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }else{
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n- Patrol: ${patrolpoints}\n\u200B`)
                            .addField("**Your stats:**", `- Attendance: ${attendpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    })
                }else{
                    const patrolpoints = await handler.getPatrolPoints(message.member.id);
    
                    if(permlevel >= 1){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Quota')
                        .setColor(color)
                        .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n- Patrol: ${patrolquota}\n\n__Staff__:\n- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\n- Patrol: ${staffpatrolqutoa}\u200B`)
                        .addField("**Your stats:**", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}\n- Patrol: ${patrolpoints}`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                    }else{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Quota')
                        .setColor(color)
                        .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n- Patrol: ${patrolpoints}\n\u200B`)
                        .addField("**Your stats:**", `- Attendance: ${attendpoints}`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                    }
                }
            }else{
                if(await handler.isOnSpreadsheet(message.member.id) == false){
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(message.member.id, handler.getGuildID());
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
                        .setDescription(`You are not linked to Bloxlink. Please run the /verify command.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
          
                        message.channel.send({embeds: [embed]})
                        return;
                    }

                    handler.addMember(message.member.id, robloxid, message.member).then(async () =>{
                        if(permlevel >= 1){
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n\n__Staff__:\n- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\u200B`)
                            .addField("**Your stats:**", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }else{
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n\u200B`)
                            .addField("**Your stats:**", `- Attendance: ${attendpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    })
                }else{  
                    if(permlevel >= 1){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Quota')
                        .setColor(color)
                        .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n\n__Staff__:\n- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\u200B`)
                        .addField("**Your stats:**", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                    }else{
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Quota')
                        .setColor(color)
                        .addField(`Current quota:`, `__Non-Staff__:\n- Attendance: ${attendquota}\n\u200B`)
                        .addField("**Your stats:**", `- Attendance: ${attendpoints}`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                    }
                }
            }
        }else if(args.length >= 4){
            if(permlevel < 4){
                const embed = new Discord.MessageEmbed()
                .setTitle('Insufficient permissions :warning:')
                .setColor("#ed0909")
                .setDescription(`You are missing the required permissions to execute this command.`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return;
            }
            if(args[0] == "add"){
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

                if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return;
                }

                if(supportsPatrols){
                    if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host,patrol> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }else{
                    if(args[1] == "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                    if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }

                const mention = message.mentions.users.first() || client.users.cache.get(args[3]);

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

                var members = message.mentions.users.first(message.mentions.users.size);

                const newpoints = args[2];
    
                if(!parseInt(newpoints)){
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error :warning:')
                  .setColor("#ed0909")
                  .setDescription(`Specify an amount of points to add.`)
                  .setFooter(Index.footer)
                  .setTimestamp();
    
                  message.channel.send({embeds: [embed]})
                  return;
                }
    
                var users = [];
    
                for(const m of members){
                  var user = await message.guild.members.fetch(m.id);
    
                  users.push(user);
                }

                for(const user of users){
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

                            handler.addMember(user.id, robloxid, user).then(async () =>{
                                if(args[1] == "attend"){
                                    handler.addAttendancePoints(user.id, parseFloat(newpoints)).then( async (updatedPoints)=>{
                                        //Points.updateAttendRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Added ${newpoints} attending point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)                          
                                        .setFooter(Index.footer)                         
                                        .setTimestamp();
                       
                                        message.channel.send({embeds: [embed]})
                                    })
                                }else if(args[1] == "host"){
                                    handler.addHostingPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                        //Points.updateHostRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Added ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                    })
                                }else if(args[1] == "patrol"){
                                    handler.addPatrolPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                        //Points.updateHostRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Added ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                    })
                                }
                            })
                        }else{
                            if(args[1] == "attend"){
                                handler.addAttendancePoints(user.id, parseFloat(newpoints)).then( async (updatedPoints)=>{
                                    //Points.updateAttendRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Added ${newpoints} attending point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)                          
                                    .setFooter(Index.footer)                         
                                    .setTimestamp();
                   
                                    message.channel.send({embeds: [embed]})
                                })
                            }else if(args[1] == "host"){
                                handler.addHostingPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                    //Points.updateHostRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Added ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed]})
                                })
                            }else if(args[1] == "patrol"){
                                handler.addPatrolPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                    //Points.updateHostRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Added ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed]})
                                })
                            }
                        }
                    })
                }
            }else if(args[0] == "remove"){
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
  
                if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return;
                }

                if(supportsPatrols){
                    if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host,patrol> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }else{
                    if(args[1] == "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                    if(args[1] != "attend" && args[1] != "host" && args[1] != "patrol"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> .points <add,remove> <attend,host> <Amount> @User\n.points get @User`)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }

                const mention = message.mentions.users.first() || client.users.cache.get(args[3]);

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

                var members = message.mentions.users.first(message.mentions.users.size);

                const newpoints = args[2];
    
                if(!parseInt(newpoints)){
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error :warning:')
                  .setColor("#ed0909")
                  .setDescription(`Specify an amount of points to remove.`)
                  .setFooter(Index.footer)
                  .setTimestamp();
    
                  message.channel.send({embeds: [embed]})
                  return;
                }
    
                var users = [];
    
                for(const m of members){
                  var user = await message.guild.members.fetch(m.id);
    
                  users.push(user);
                }

                for(const user of users){
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

                            handler.addMember(user.id, robloxid, user).then(async () =>{
                                if(args[1] == "attend"){
                                    handler.removeAttendancePoints(user.id, parseFloat(newpoints)).then( async (updatedPoints)=>{
                                        //Points.updateAttendRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Removed ${newpoints} attending point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)                          
                                        .setFooter(Index.footer)                         
                                        .setTimestamp();
                       
                                        message.channel.send({embeds: [embed]})
                                    })
                                }else if(args[1] == "host"){
                                    handler.removeHostingPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                        //Points.updateHostRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Removed ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                    })
                                }else if(args[1] == "patrol"){
                                    handler.removePatrolPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                        //Points.updateHostRoles(message.member, updatedPoints);
                    
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Success :white_check_mark:')
                                        .setColor("#56d402")
                                        .setDescription(`Removed ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                    })
                                }
                            })
                        }else{
                            if(args[1] == "attend"){
                                handler.removeAttendancePoints(user.id, parseFloat(newpoints)).then( async (updatedPoints)=>{
                                    //Points.updateAttendRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Removed ${newpoints} attending point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)                          
                                    .setFooter(Index.footer)                         
                                    .setTimestamp();
                   
                                    message.channel.send({embeds: [embed]})
                                })
                            }else if(args[1] == "host"){
                                handler.removeHostingPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                    //Points.updateHostRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Removed ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed]})
                                })
                            }else if(args[1] == "patrol"){
                                handler.removePatrolPoints(user.id, parseFloat(newpoints)).then(async (updatedPoints)=>{
                                    //Points.updateHostRoles(message.member, updatedPoints);
                
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Success :white_check_mark:')
                                    .setColor("#56d402")
                                    .setDescription(`Removed ${newpoints} hosting point/points to <@${user.id}>. Updated Points: **${updatedPoints}**.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed]})
                                })
                            }
                        }
                    })
                }
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> .points <add,remove> <attend,host${supportsPatrols ? ",patrol" : ""}> <Amount> @User\n.points get @User`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return;
            }
        }else if(args.length == 2){
            if(permlevel < 3){
                const embed = new Discord.MessageEmbed()
                .setTitle('Insufficient permissions :warning:')
                .setColor("#ed0909")
                .setDescription(`You are missing the required permissions to execute this command.`)
                .setFooter(Index.footer)
                .setTimestamp();
  
                message.channel.send({embeds: [embed]})
                return; 
            }

            if(args[0] == "get"){
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
    
                const mention = message.mentions.users.first() || client.users.cache.get(args[1]);
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

                handler.isOnSpreadsheet(user.id).then(async (bool) =>{
                    if(bool){
                        var attendpoints = await handler.getAttendancePoints(member.id);
                        var hostpoints = await handler.getHostingPoints(member.id);
        
                        if(supportsPatrols){
                            var patrolpoints = await handler.getPatrolPoints(member.id);
        
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Points')
                            .setColor(color)
                            .addField(`Name`, `<@${member.id}>`)
                            .addField(`Stats`, `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}\n- Patrol: ${patrolpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }else{
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Points')
                            .setColor(color)
                            .addField(`Name`, `<@${member.id}>`)
                            .addField("Stats", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    }else{
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

                        handler.addMember(user.id, robloxid, user).then(async () =>{
                            var attendpoints = await handler.getAttendancePoints(user.id);
                            var hostpoints = await handler.getHostingPoints(user.id);
            
                            if(supportsPatrols){
                                var patrolpoints = await handler.getPatrolPoints(user.id);
            
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Points')
                                .setColor(color)
                                .addField(`Name`, `<@${member.id}>`)
                                .addField(`Stats`, `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}\n- Patrol: ${patrolpoints}`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }else{
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Points')
                                .setColor(color)
                                .addField(`Name`, `<@${member.id}>`)
                                .addField("Stats", `- Hosting: ${hostpoints}\n- Attendance: ${attendpoints}`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }
                        })
                    }
                })
    
                
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}points <add,remove> <attend,host${supportsPatrols ? ",patrol" : ""}> <Amount> @User\n${prefix}points get @User`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return;
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}points <add,remove> <attend,host${supportsPatrols ? ",patrol" : ""}> <Amount> @User\n${prefix}points get @User`)
            .setFooter(Index.footer)
            .setTimestamp();
              
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}