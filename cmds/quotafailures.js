const Discord = require('discord.js');
const Index = require('../index');
const { Util } = require("discord.js");
const PageEmbed = require('../utils/PageEmbed');
const PageEmbedHandler = require('../utils/PageEmbedHandler');

module.exports = {
    name: "quotafailures",
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
                    var normalfailures = [];
    
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
                                            if(await handler.getPermissionLevel(member) < 4 && !member.roles.cache.some(r => r.id == inactivityid) && !member.roles.cache.some(r => r.id == newstaffid) && !member.roles.cache.some(r => r.id == newid) && !member.roles.cache.some(r => r.id == exemptRoleId)){
                                                if(doc[i].Staff == "yes"){
                                                    var attendpoints = await handler.getAttendancePoints(member.id);
                                                    var hostpoints = await handler.getHostingPoints(member.id);
                                                    const patrolpoints = await handler.getPatrolPoints(member.id);
                            
                                                    if(parseInt(attendpoints) < parseInt(staffattendquota) || parseInt(hostpoints) < parseInt(hostingquota) || parseInt(patrolpoints) < parseInt(staffpatrolqutoa)){
                                                        normalfailures.push({data: doc[i], staff: true});
                                                    }
                                                }else{
                                                    var attendpoints = await handler.getAttendancePoints(member.id);
                                                    const patrolpoints = await handler.getPatrolPoints(member.id);
                            
                                                    if(parseInt(attendpoints) < parseInt(attendquota) || parseInt(patrolpoints) < parseInt(patrolquota)){
                                                        normalfailures.push({data: doc[i], staff: false});
                                                    }
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
    
                            for(var i=0; i < normalfailures.length; i++){
                                if(normalfailures[i].staff){
                                    staffstring.push(`- <@${normalfailures[i].data.Id}>: H: ${normalfailures[i].data.Host}, A: ${normalfailures[i].data.Attend}, P: ${normalfailures[i].data.Patrol}`)
                                }else{
                                    normalsting.push(`- <@${normalfailures[i].data.Id}>: A: ${normalfailures[i].data.Attend}, P: ${normalfailures[i].data.Patrol}`);
                                }
                            }

                            const staffstringsplit = Util.splitMessage(staffstring.join("\n"), { maxLength: 4096 });
                            const normalstringsplit = Util.splitMessage(normalsting.join("\n"), { maxLength: 4096 });


                            const staffEmbed = new PageEmbed(`Staff Quota Failures (${staffstring.length})`, "#ed0909", staffstringsplit);
                            const normalEmbed = new PageEmbed(`Non-Staff Quota Failures (${normalsting.length})`, "#ed0909", normalstringsplit);

                            const staffSent = await message.channel.send({embeds: [staffEmbed.getCurrentPageEmbed()]});
                            const normalSent = await message.channel.send({embeds: [normalEmbed.getCurrentPageEmbed()]});

                            if(staffEmbed.getLength()-1 > 0 ){
                                staffSent.react("➡️");
                            }

                            if(normalEmbed.getLength()-1 > 0 ){
                                normalSent.react("➡️");
                            }

                            PageEmbedHandler.addEmbed(staffEmbed, staffSent.id);
                            PageEmbedHandler.addEmbed(normalEmbed, normalSent.id);

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
                                            if(await handler.getPermissionLevel(member) < 4 && !member.roles.cache.some(r => r.id == inactivityid) && !member.roles.cache.some(r => r.id == newstaffid) && !member.roles.cache.some(r => r.id == newid) && !member.roles.cache.some(r => r.id == exemptRoleId)){
                                                if(doc[i].Staff == "yes"){
                                                    var attendpoints = await handler.getAttendancePoints(member.id);
                                                    var hostpoints = await handler.getHostingPoints(member.id);
                            
                                                    if(parseInt(attendpoints) < parseInt(staffattendquota) || parseInt(hostpoints) < parseInt(hostingquota)){
                                                        normalfailures.push({data: doc[i], staff: true});
                                                    }
                                                }else{
                                                    var attendpoints = await handler.getAttendancePoints(member.id);
                            
                                                    if(parseInt(attendpoints) < parseInt(attendquota)){
                                                        normalfailures.push({data: doc[i], staff: false});
                                                    }
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
    
                            for(var i=0; i < normalfailures.length; i++){
                                if(normalfailures[i].staff){
                                    staffstring.push(`- <@${normalfailures[i].data.Id}>: H: ${normalfailures[i].data.Host}, A: ${normalfailures[i].data.Attend}`)
                                }else{
                                    normalsting.push(`- <@${normalfailures[i].data.Id}>: A: ${normalfailures[i].data.Attend}`);
                                }
                            }
    
                            const staffstringsplit = Util.splitMessage(staffstring.join("\n"), { maxLength: 4096 });
                            const normalstringsplit = Util.splitMessage(normalsting.join("\n"), { maxLength: 4096 });


                            const staffEmbed = new PageEmbed(`Staff Quota Failures (${staffstring.length})`, "#ed0909", staffstringsplit);
                            const normalEmbed = new PageEmbed(`Non-Staff Quota Failures (${normalsting.length})`, "#ed0909", normalstringsplit);

                            const staffSent = await message.channel.send({embeds: [staffEmbed.getCurrentPageEmbed()]});
                            const normalSent = await message.channel.send({embeds: [normalEmbed.getCurrentPageEmbed()]});

                            if(staffEmbed.getLength()-1 > 0 ){
                                staffSent.react("➡️");
                            }

                            if(normalEmbed.getLength()-1 > 0 ){
                                normalSent.react("➡️");
                            }

                            PageEmbedHandler.addEmbed(staffEmbed, staffSent.id);
                            PageEmbedHandler.addEmbed(normalEmbed, normalSent.id);
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