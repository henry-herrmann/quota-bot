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

            const rolequota = await handler.getQuota(message.member);

            if(supportsPatrols){
                const patrolquota = await handler.getPatrolQuota();
                const staffpatrolqutoa = await handler.getStaffPatrolQuota();

                if(await handler.isOnSpreadsheet(message.member.id) == false){
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(message.member.id);
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
                            if(rolequota.length > 0){
                                let max;
            
                                for(const quota of rolequota){
                                    const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
            
                                    if(max == null) {
                                        max = role;
                                    }
            
                                    if(role.position > max){
                                        max = role;
                                    }
                                }
            
                                const quotaarray = [];
            
                                for(const quota of rolequota){
                                    if(quota.Override == 1 || quota.roleid == max.id){
                                        quotaarray.push(quota);
                                    }
                                }
            
                                const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                                const rolehostquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                                const rolepatrolquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);

                                const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                                const hostpercent = Math.trunc(hostpoints*100/rolehostquota) <= 100 ? Math.trunc(hostpoints*100/rolehostquota) : 100;
                                const patrolpercent = Math.trunc(patrolpoints*100/rolepatrolquota) <= 100 ? Math.trunc(patrolpoints*100/rolepatrolquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const hostchecksnum = Math.trunc(hostpercent / 10);
                                const patrolchecksum = Math.trunc(patrolpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let hostChecks = [];
                                let hostPlaceholders = [];
                                let patrolChecks = [];
                                let patrolPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < hostchecksnum; i++){
                                    hostChecks.push(":blue_square:");
                                }
                                for(let i=0; i < 10-hostchecksnum; i++){
                                    hostPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < patrolchecksum; i++){
                                    patrolChecks.push(":orange_square:");
                                }
                                for(let i=0; i < 10-patrolchecksum; i++){
                                    patrolPlaceholders.push(":black_large_square:")
                                }

                                const names = [];

                                quotaarray.map(cur => cur.roleid).forEach(async (element) =>{
                                    const role = await message.guild.roles.fetch(element).catch(() =>{});
                                    names.push(role.name);
                                })
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField(`${names.join(", ")} Quota:`, `- Hosting: ${rolehostquota}\n- Attendance: ${roleattendquota}\n- Patrol: ${rolepatrolquota}`, true)
                                .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${rolehostquota})`)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                                .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${rolepatrolquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
            
                                
                            }else{
                                const attendpercent = Math.trunc(attendpoints*100/staffattendquota) <= 100 ? Math.trunc(attendpoints*100/staffattendquota) : 100;
                                const hostpercent = Math.trunc(hostpoints*100/hostingquota) <= 100 ? Math.trunc(hostpoints*100/hostingquota) : 100;
                                const patrolpercent = Math.trunc(patrolpoints*100/staffpatrolqutoa) <= 100 ? Math.trunc(patrolpoints*100/staffpatrolqutoa) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const hostchecksnum = Math.trunc(hostpercent / 10);
                                const patrolchecksum = Math.trunc(patrolpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let hostChecks = [];
                                let hostPlaceholders = [];
                                let patrolChecks = [];
                                let patrolPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < hostchecksnum; i++){
                                    hostChecks.push(":blue_square:");
                                }
                                for(let i=0; i < 10-hostchecksnum; i++){
                                    hostPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < patrolchecksum; i++){
                                    patrolChecks.push(":orange_square:");
                                }
                                for(let i=0; i < 10-patrolchecksum; i++){
                                    patrolPlaceholders.push(":black_large_square:")
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField("Staff quota (Your quota): ", `- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\n- Patrol: ${staffpatrolqutoa}`, true)
                                .addField("Non-Staff quota:", `- Attendance: ${attendquota}\n- Patrol: ${patrolquota}`, true)
                                .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${hostingquota})`)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${staffattendquota})`)
                                .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${staffpatrolqutoa})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }
                        }else{
                            if(rolequota.length > 0){
                                let max;
            
                                for(const quota of rolequota){
                                    const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
            
                                    if(max == null) {
                                        max = role;
                                    }
            
                                    if(role.position > max){
                                        max = role;
                                    }
                                }
            
                                const quotaarray = [];
            
                                for(const quota of rolequota){
                                    if(quota.Override == 1 || quota.roleid == max.id){
                                        quotaarray.push(quota);
                                    }
                                }
            
                                const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                                const rolepatrolquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);

                                const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                                const patrolpercent = Math.trunc(patrolpoints*100/rolepatrolquota) <= 100 ? Math.trunc(patrolpoints*100/rolepatrolquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const patrolchecksum = Math.trunc(patrolpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let patrolChecks = [];
                                let patrolPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < patrolchecksum; i++){
                                    patrolChecks.push(":orange_square:");
                                }
                                for(let i=0; i < 10-patrolchecksum; i++){
                                    patrolPlaceholders.push(":black_large_square:")
                                }

                                const names = [];

                                quotaarray.map(cur => cur.roleid).forEach(async (element) =>{
                                    const role = await message.guild.roles.fetch(element).catch(() =>{});
                                    names.push(role.name);
                                })
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField(`${names.join(", ")} Quota:`, `- Attendance: ${roleattendquota}\n- Patrol: ${rolepatrolquota}`, true)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                                .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${rolepatrolquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
            
                                
                            }else{
                                const attendpercent = Math.trunc(attendpoints*100/staffattendquota) <= 100 ? Math.trunc(attendpoints*100/staffattendquota) : 100;
                                const patrolpercent = Math.trunc(patrolpoints*100/staffpatrolqutoa) <= 100 ? Math.trunc(patrolpoints*100/staffpatrolqutoa) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const patrolchecksum = Math.trunc(patrolpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let patrolChecks = [];
                                let patrolPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < patrolchecksum; i++){
                                    patrolChecks.push(":orange_square:");
                                }
                                for(let i=0; i < 10-patrolchecksum; i++){
                                    patrolPlaceholders.push(":black_large_square:")
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField("Your quota: ", `- Attendance: ${staffattendquota}\n- Patrol: ${staffpatrolqutoa}`, true)
                                .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${hostingquota})`)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${staffattendquota})`)
                                .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${staffpatrolqutoa})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }
                        }
                    })
                }else{
                    const patrolpoints = await handler.getPatrolPoints(message.member.id);
    
                    if(permlevel >= 1){
                        if(rolequota.length > 0){
                            let max;
        
                            for(const quota of rolequota){
                                const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
        
                                if(max == null) {
                                    max = role;
                                }
        
                                if(role.position > max){
                                    max = role;
                                }
                            }
        
                            const quotaarray = [];
        
                            for(const quota of rolequota){
                                if(quota.Override == 1 || quota.roleid == max.id){
                                    quotaarray.push(quota);
                                }
                            }
        
                            const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                            const rolehostquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                            const rolepatrolquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);

                            const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                            const hostpercent = Math.trunc(hostpoints*100/rolehostquota) <= 100 ? Math.trunc(hostpoints*100/rolehostquota) : 100;
                            const patrolpercent = Math.trunc(patrolpoints*100/rolepatrolquota) <= 100 ? Math.trunc(patrolpoints*100/rolepatrolquota) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const hostchecksnum = Math.trunc(hostpercent / 10);
                            const patrolchecksum = Math.trunc(patrolpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let hostChecks = [];
                            let hostPlaceholders = [];
                            let patrolChecks = [];
                            let patrolPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < hostchecksnum; i++){
                                hostChecks.push(":blue_square:");
                            }
                            for(let i=0; i < 10-hostchecksnum; i++){
                                hostPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < patrolchecksum; i++){
                                patrolChecks.push(":orange_square:");
                            }
                            for(let i=0; i < 10-patrolchecksum; i++){
                                patrolPlaceholders.push(":black_large_square:")
                            }

                            const names = [];

                            const roles = quotaarray.map(cur => cur.roleid)

                            await new Promise(async (resolve, reject) =>{
                                for(const element of roles){
                                    const role = await message.guild.roles.fetch(element).catch(() =>{});
                                    names.push(role.name);
                                }
                                resolve();
                            })
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`${names.join(", ")} Quota:`, `- Hosting: ${rolehostquota}\n- Attendance: ${roleattendquota}\n- Patrol: ${rolepatrolquota}`, true)
                            .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${rolehostquota})`)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                            .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${rolepatrolquota})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
        
                            
                        }else{
                            const attendpercent = Math.trunc(attendpoints*100/staffattendquota) <= 100 ? Math.trunc(attendpoints*100/staffattendquota) : 100;
                            const hostpercent = Math.trunc(hostpoints*100/hostingquota) <= 100 ? Math.trunc(hostpoints*100/hostingquota) : 100;
                            const patrolpercent = Math.trunc(patrolpoints*100/staffpatrolqutoa) <= 100 ? Math.trunc(patrolpoints*100/staffpatrolqutoa) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const hostchecksnum = Math.trunc(hostpercent / 10);
                            const patrolchecksum = Math.trunc(patrolpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let hostChecks = [];
                            let hostPlaceholders = [];
                            let patrolChecks = [];
                            let patrolPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < hostchecksnum; i++){
                                hostChecks.push(":blue_square:");
                            }
                            for(let i=0; i < 10-hostchecksnum; i++){
                                hostPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < patrolchecksum; i++){
                                patrolChecks.push(":orange_square:");
                            }
                            for(let i=0; i < 10-patrolchecksum; i++){
                                patrolPlaceholders.push(":black_large_square:")
                            }
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField("Staff quota (Your quota): ", `- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}\n- Patrol: ${staffpatrolqutoa}`, true)
                            .addField("Non-Staff quota:", `- Attendance: ${attendquota}\n- Patrol: ${patrolquota}`, true)
                            .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${hostingquota})`)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${staffattendquota})`)
                            .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${staffpatrolqutoa})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    }else{
                        if(rolequota.length > 0){
                            let max;
        
                            for(const quota of rolequota){
                                const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
        
                                if(max == null) {
                                    max = role;
                                }
        
                                if(role.position > max){
                                    max = role;
                                }
                            }
        
                            const quotaarray = [];
        
                            for(const quota of rolequota){
                                if(quota.Override == 1 || quota.roleid == max.id){
                                    quotaarray.push(quota);
                                }
                            }
    
                            const names = [];
    
                            quotaarray.map(cur => cur.roleid).forEach(async (element) =>{
                                const role = await message.guild.roles.fetch(element).catch(() =>{});
                                names.push(role.name);
                            })
        
                            const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                            const rolepatrolquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                        
                            const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                            const patrolpercent = Math.trunc(patrolpoints*100/rolepatrolquota) <= 100 ? Math.trunc(patrolpoints*100/rolepatrolquota) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const patrolchecksum = Math.trunc(patrolpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let patrolChecks = [];
                            let patrolPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < patrolchecksum; i++){
                                patrolChecks.push(":orange_square:");
                            }
                            for(let i=0; i < 10-patrolchecksum; i++){
                                patrolPlaceholders.push(":black_large_square:")
                            }
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`${names.join(", ")} Quota`, `- Attendance: ${roleattendquota}\n- Patrol: ${rolepatrolquota}`, true)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                            .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${rolepatrolquota})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }else{
                            const attendpercent = Math.trunc(attendpoints*100/attendquota) <= 100 ? Math.trunc(attendpoints*100/attendquota) : 100;
                            const patrolpercent = Math.trunc(patrolpoints*100/patrolquota) <= 100 ? Math.trunc(patrolpoints*100/patrolquota) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const patrolchecksum = Math.trunc(patrolpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let patrolChecks = [];
                            let patrolPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < patrolchecksum; i++){
                                patrolChecks.push(":orange_square:");
                            }
                            for(let i=0; i < 10-patrolchecksum; i++){
                                patrolPlaceholders.push(":black_large_square:")
                            }
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`Your quota`, `- Attendance: ${attendquota}\n- Patrol: ${patrolquota}`, true)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${attendquota})`)
                            .addField("Your patrol points:", `${patrolChecks.join("")}${patrolPlaceholders.join("")} ${patrolpercent}% (${patrolpoints}/${patrolquota})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    }
                }
            }else{
                if(await handler.isOnSpreadsheet(message.member.id) == false){
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(message.member.id);
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
                            if(rolequota.length > 0){
                                let max;
            
                                for(const quota of rolequota){
                                    const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
            
                                    if(max == null) {
                                        max = role;
                                    }
            
                                    if(role.position > max){
                                        max = role;
                                    }
                                }
            
                                const quotaarray = [];
            
                                for(const quota of rolequota){
                                    if(quota.Override == 1 || quota.roleid == max.id){
                                        quotaarray.push(quota);
                                    }
                                }
            
                                const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                                const rolehostquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
    
                                const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                                const hostpercent = Math.trunc(hostpoints*100/rolehostquota) <= 100 ? Math.trunc(hostpoints*100/rolehostquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const hostchecksnum = Math.trunc(hostpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let hostChecks = [];
                                let hostPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < hostchecksnum; i++){
                                    hostChecks.push(":blue_square:");
                                }
                                for(let i=0; i < 10-hostchecksnum; i++){
                                    hostPlaceholders.push(":black_large_square:")
                                }

                                const names = [];
    
                                const roles = quotaarray.map(cur => cur.roleid)
    
                                await new Promise(async (resolve, reject) =>{
                                    for(const element of roles){
                                        const role = await message.guild.roles.fetch(element).catch(() =>{});
                                        names.push(role.name);
                                    }
                                    resolve();
                                })
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField(`${names.join(", ")} Quota:`, `- Hosting: ${rolehostquota}\n- Attendance: ${roleattendquota}`, true)
                                .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${rolehostquota})`)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
            
                                
                            }else{
                                const attendpercent = Math.trunc(attendpoints*100/staffattendquota) <= 100 ? Math.trunc(attendpoints*100/staffattendquota) : 100;
                                const hostpercent = Math.trunc(hostpoints*100/hostingquota) <= 100 ? Math.trunc(hostpoints*100/hostingquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
                                const hostchecksnum = Math.trunc(hostpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
                                let hostChecks = [];
                                let hostPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
                                for(let i=0; i < hostchecksnum; i++){
                                    hostChecks.push(":blue_square:");
                                }
                                for(let i=0; i < 10-hostchecksnum; i++){
                                    hostPlaceholders.push(":black_large_square:")
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField("Staff quota (Your quota): ", `- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}`, true)
                                .addField("Non-Staff quota:", `- Attendance: ${attendquota}`, true)
                                .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${hostingquota})`)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${staffattendquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }
                        }else{
                            if(rolequota.length > 0){
                                let max;
            
                                for(const quota of rolequota){
                                    const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
            
                                    if(max == null) {
                                        max = role;
                                    }
            
                                    if(role.position > max){
                                        max = role;
                                    }
                                }
            
                                const quotaarray = [];
            
                                for(const quota of rolequota){
                                    if(quota.Override == 1 || quota.roleid == max.id){
                                        quotaarray.push(quota);
                                    }
                                }
        
                                const names = [];
        
                                quotaarray.map(cur => cur.roleid).forEach(async (element) =>{
                                    const role = await message.guild.roles.fetch(element).catch(() =>{});
                                    names.push(role.name);
                                })
            
                                const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                            
                                const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField(`${names.join(", ")} Quota`, `- Attendance: ${roleattendquota}`, true)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }else{
                                const attendpercent = Math.trunc(attendpoints*100/attendquota) <= 100 ? Math.trunc(attendpoints*100/attendquota) : 100;
            
                                const attendchecksnum = Math.trunc(attendpercent / 10);
            
                                let attendChecks = [];
                                let attendPlaceholders = [];
            
                                for(let i=0; i < attendchecksnum; i++){
                                    attendChecks.push(":green_square:");
                                }
                                for(let i=0; i < 10-attendchecksnum; i++){
                                    attendPlaceholders.push(":black_large_square:")
                                }
        
                                const embed = new Discord.MessageEmbed()
                                .setTitle('Quota')
                                .setColor(color)
                                .addField(`Your quota`, `- Attendance: ${attendquota}`, true)
                                .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${attendquota})`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                    
                                message.channel.send({embeds: [embed]})
                            }
                        }
                    })
                }else{  
                    if(permlevel >= 1){
                        if(rolequota.length > 0){
                            let max;
        
                            for(const quota of rolequota){
                                const role = await message.guild.roles.fetch(quota.roleid).catch(() =>{});
        
                                if(max == null) {
                                    max = role;
                                }
        
                                if(role.position > max){
                                    max = role;
                                }
                            }
        
                            const quotaarray = [];
        
                            for(const quota of rolequota){
                                if(quota.Override == 1 || quota.roleid == max.id){
                                    quotaarray.push(quota);
                                }
                            }
        
                            const roleattendquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);
                            const rolehostquota = quotaarray.reduce((a, b) => a + (b["Attend"] || 0), 0);

                            const attendpercent = Math.trunc(attendpoints*100/roleattendquota) <= 100 ? Math.trunc(attendpoints*100/roleattendquota) : 100;
                            const hostpercent = Math.trunc(hostpoints*100/rolehostquota) <= 100 ? Math.trunc(hostpoints*100/rolehostquota) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const hostchecksnum = Math.trunc(hostpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let hostChecks = [];
                            let hostPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < hostchecksnum; i++){
                                hostChecks.push(":blue_square:");
                            }
                            for(let i=0; i < 10-hostchecksnum; i++){
                                hostPlaceholders.push(":black_large_square:")
                            }

                            const names = [];

                            const roles = quotaarray.map(cur => cur.roleid)

                            await new Promise(async (resolve, reject) =>{
                                for(const element of roles){
                                    const role = await message.guild.roles.fetch(element).catch(() =>{});
                                    names.push(role.name);
                                }
                                resolve();
                            })
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField(`${names.join(", ")} Quota:`, `- Hosting: ${rolehostquota}\n- Attendance: ${roleattendquota}`, true)
                            .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${rolehostquota})`)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${roleattendquota})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                            
                        }else{
                            const attendpercent = Math.trunc(attendpoints*100/staffattendquota) <= 100 ? Math.trunc(attendpoints*100/staffattendquota) : 100;
                            const hostpercent = Math.trunc(hostpoints*100/hostingquota) <= 100 ? Math.trunc(hostpoints*100/hostingquota) : 100;
        
                            const attendchecksnum = Math.trunc(attendpercent / 10);
                            const hostchecksnum = Math.trunc(hostpercent / 10);
        
                            let attendChecks = [];
                            let attendPlaceholders = [];
                            let hostChecks = [];
                            let hostPlaceholders = [];
        
                            for(let i=0; i < attendchecksnum; i++){
                                attendChecks.push(":green_square:");
                            }
                            for(let i=0; i < 10-attendchecksnum; i++){
                                attendPlaceholders.push(":black_large_square:")
                            }
                            for(let i=0; i < hostchecksnum; i++){
                                hostChecks.push(":blue_square:");
                            }
                            for(let i=0; i < 10-hostchecksnum; i++){
                                hostPlaceholders.push(":black_large_square:")
                            }
    
                            const embed = new Discord.MessageEmbed()
                            .setTitle('Quota')
                            .setColor(color)
                            .addField("Staff quota (Your quota): ", `- Hosting: ${hostingquota}\n- Attendance: ${staffattendquota}`, true)
                            .addField("Non-Staff quota:", `- Attendance: ${attendquota}`, true)
                            .addField("Your hosting points:", `${hostChecks.join("")}${hostPlaceholders.join("")} ${hostpercent}% (${hostpoints}/${hostingquota})`)
                            .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${staffattendquota})`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                
                            message.channel.send({embeds: [embed]})
                        }
                    }else{
                        const attendpercent = Math.trunc(attendpoints*100/attendquota) <= 100 ? Math.trunc(attendpoints*100/attendquota) : 100;
    
                        const attendchecksnum = Math.trunc(attendpercent / 10);
    
                        let attendChecks = [];
                        let attendPlaceholders = [];
    
                        for(let i=0; i < attendchecksnum; i++){
                            attendChecks.push(":green_square:");
                        }
                        for(let i=0; i < 10-attendchecksnum; i++){
                            attendPlaceholders.push(":black_large_square:")
                        }

                        const embed = new Discord.MessageEmbed()
                        .setTitle('Quota')
                        .setColor(color)
                        .addField("Your quota:", `- Attendance: ${attendquota}`, true)
                        .addField("Your attendance points:", `${attendChecks.join("")}${attendPlaceholders.join("")} ${attendpercent}% (${attendpoints}/${attendquota})`)
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
    
                if(!parseFloat(newpoints)){
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error :warning:')
                  .setColor("#ed0909")
                  .setDescription(`Specify an amount of points to add.`)
                  .setFooter(Index.footer)
                  .setTimestamp();
    
                  message.channel.send({embeds: [embed]})
                  return;
                }

                if(parseFloat(newpoints) < 0){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Error :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Cannot add negative points, use ${prefix}points remove <attend,host${supportsPatrols ? ",patrol" : ""}> <Amount> @User`)
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
                                robloxid = await DivisionHandler.getRobloxId(user.id);
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
    
                if(!parseFloat(newpoints)){
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
                                robloxid = await DivisionHandler.getRobloxId(user.id);
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

                                        if(updatedPoints == -1){
                                            const embed = new Discord.MessageEmbed()
                                            .setTitle('Error :warning:')
                                            .setColor("#ed0909")
                                            .setDescription(`The users points cannot be lower than 0.`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();
                            
                                            message.channel.send({embeds: [embed]})
                                            return;
                                        }
                    
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

                                        if(updatedPoints == -1){
                                            const embed = new Discord.MessageEmbed()
                                            .setTitle('Error :warning:')
                                            .setColor("#ed0909")
                                            .setDescription(`The users points cannot be lower than 0.`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();
                            
                                            message.channel.send({embeds: [embed]})
                                            return;
                                        }
                    
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

                                        if(updatedPoints == -1){
                                            const embed = new Discord.MessageEmbed()
                                            .setTitle('Error :warning:')
                                            .setColor("#ed0909")
                                            .setDescription(`The users points cannot be lower than 0.`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();
                            
                                            message.channel.send({embeds: [embed]})
                                            return;
                                        }
                    
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

                                    if(updatedPoints == -1){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The users points cannot be lower than 0.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                        return;
                                    }
                
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

                                    if(updatedPoints == -1){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The users points cannot be lower than 0.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                        return;
                                    }
                
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

                                    if(updatedPoints == -1){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The users points cannot be lower than 0.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed]})
                                        return;
                                    }
                
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
            if(permlevel < 1){
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
                            robloxid = await DivisionHandler.getRobloxId(user.id);
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