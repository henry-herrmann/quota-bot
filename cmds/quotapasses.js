const Discord = require('discord.js');
const Index = require('../index');
const { Util } = require("discord.js");

module.exports = {
    name: "quotapasses",
    async execute(message, args, handler, client){
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

        if(args.length == 0){
            handler.getMembers().then(async (doc) =>{

                client.guilds.cache.get(handler.getGuildID()).members.fetch().then(async members => {
                    var passes = [];
    
                    const attendquota = await handler.getAttendanceQuota();
                    const hostingquota = await handler.getHostingQuota();
                    const staffattendquota = await handler.getStaffAttendQuota();

                    const personnelid = (await handler.getConfig("Personnel-Id")).Value;
                    const inactivityid = (await handler.getConfig("Inacitivty-Role-Id")).Value;
                    const newstaffid = (await handler.getConfig("New-Staff-Role-Id")).Value;
                    const newid = (await handler.getConfig("New-Role-Id")).Value;
                    const exemptRoleId = (await handler.getConfig("Exempt-Role-Id")).Value;

                    if(handler.supportsPatrols()){
                        const patrolquota = await handler.getPatrolQuota();
                        const staffpatrolqutoa = await handler.getStaffPatrolQuota();

                        new Promise(async (resolve, reject) =>{
                            const Role = client.guilds.cache.get(handler.getGuildID()).roles.cache.find(role => role.id == personnelid);
                            for(const tmember of members) {
                                const member = tmember[1];
                                if(member.roles.cache.find(role => role == Role)){
                                    for(var i=0; i< doc.length; i++){
                                        const id = doc[i].Id;
        
                                        if(member.id == id){
                                            if(doc[i].Staff == "yes"){
                                                var attendpoints = await handler.getAttendancePoints(member.id);
                                                var hostpoints = await handler.getHostingPoints(member.id);
                                                const patrolpoints = await handler.getPatrolPoints(member.id);
                        
                                                if((parseInt(attendpoints) >= parseInt(staffattendquota) && parseInt(hostpoints) >= parseInt(hostingquota) && parseInt(patrolpoints) >= parseInt(staffpatrolqutoa)) || (await handler.getPermissionLevel(member) >= 4 || member.roles.cache.some(r => r.id == inactivityid) || member.roles.cache.some(r => r.id == newstaffid) || member.roles.cache.some(r => r.id == newid) || member.roles.cache.some(r => r.id == exemptRoleId))){
                                                    passes.push({data: doc[i], staff: true});
                                                }
                                            }else{
                                                var attendpoints = await handler.getAttendancePoints(member.id);
                                                const patrolpoints = await handler.getPatrolPoints(member.id);
                        
                                                if((parseInt(attendpoints) >= parseInt(attendquota) && parseInt(patrolpoints) >= parseInt(patrolquota)) || (await handler.getPermissionLevel(member) >= 4 || member.roles.cache.some(r => r.id == inactivityid) || member.roles.cache.some(r => r.id == newstaffid) || member.roles.cache.some(r => r.id == newid) || member.roles.cache.some(r => r.id == exemptRoleId))){
                                                    passes.push({data: doc[i], staff: false});
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            resolve();
                        }).then(async () =>{
                            var normalsting = [];
                            var staffstring = [];
    
                            for(var i=0; i < passes.length; i++){
                                if(passes[i].staff){
                                    staffstring.push(`- <@${passes[i].data.Id}>: H: ${passes[i].data.Host}, A: ${passes[i].data.Attend}, P: ${passes[i].data.Patrol}`)
                                }else{
                                    normalsting.push(`- <@${passes[i].data.Id}>: A: ${passes[i].data.Attend}, P: ${passes[i].data.Patrol}`);
                                }
                            }

                            const staffstringsplit = Util.splitMessage(staffstring.join("\n"), { maxLength: 2000 });
                            const normalstringsplit = Util.splitMessage(normalsting.join("\n"), { maxLength: 2000});

                            message.channel.send("Staff Quota Passes: \n");
                    
                            for(const string of staffstringsplit){
                                message.channel.send(string);
                            }
                            message.channel.send("Normal Passes: \n");

                            for(const string of normalstringsplit){
                                message.channel.send(string);
                            }
                        })
                    }else{
                        new Promise(async (resolve, reject) =>{
                            const Role = client.guilds.cache.get(handler.getGuildID()).roles.cache.find(role => role.id == personnelid);
                            for(const tmember of members) {
                                const member = tmember[1];
                                if(member.roles.cache.find(role => role == Role)){
                                    for(var i=0; i< doc.length; i++){
                                        const id = doc[i].Id;
        
                                        if(member.id == id){
                                            if(doc[i].Staff == "yes"){
                                                var attendpoints = await handler.getAttendancePoints(member.id);
                                                var hostpoints = await handler.getHostingPoints(member.id);
                        
                                                if((parseInt(attendpoints) >= parseInt(staffattendquota) && parseInt(hostpoints) >= parseInt(hostingquota)) || (await handler.getPermissionLevel(member) >= 4 || member.roles.cache.some(r => r.id == inactivityid) || member.roles.cache.some(r => r.id == newstaffid) || member.roles.cache.some(r => r.id == newid) || member.roles.cache.some(r => r.id == exemptRoleId))){
                                                    passes.push({data: doc[i], staff: true});
                                                }
                                            }else{
                                                var attendpoints = await handler.getAttendancePoints(member.id);
                        
                                                if((parseInt(attendpoints) >= parseInt(attendquota)) || (await handler.getPermissionLevel(member) >= 4 || member.roles.cache.some(r => r.id == inactivityid) || member.roles.cache.some(r => r.id == newstaffid) || member.roles.cache.some(r => r.id == newid) || member.roles.cache.some(r => r.id == exemptRoleId))){
                                                    passes.push({data: doc[i], staff: false});
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            resolve();
                        }).then(async () =>{
                            var normalsting = [];
                            var staffstring = [];
    
                            for(var i=0; i < passes.length; i++){
                                if(passes[i].staff){
                                    staffstring.push(`- <@${passes[i].data.Id}>: H: ${passes[i].data.Host}, A: ${passes[i].data.Attend}`)
                                }else{
                                    normalsting.push(`- <@${passes[i].data.Id}>: A: ${passes[i].data.Attend}`);
                                }
                            }
    
                            const staffstringsplit = Util.splitMessage(staffstring.join("\n"), { maxLength: 2000 });
                            const normalstringsplit = Util.splitMessage(normalsting.join("\n"), { maxLength: 2000});

                            message.channel.send("Staff Quota Passes: \n");
                    
                            for(const string of staffstringsplit){
                                message.channel.send(string);
                            }
                            message.channel.send("Normal Passes: \n");

                            for(const string of normalstringsplit){
                                message.channel.send(string);
                            }
                        })
                    }
                })


            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}quotafailures`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}