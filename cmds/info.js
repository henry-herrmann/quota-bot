const Discord = require('discord.js');
const RbxManager = require('../utils/RbxManager');
const Index = require("../index");
const dateFormat = require("dateformat");
const DivisionHandler = require("../db/DivisionHandler");

module.exports = {
    name: "info",
    async execute(message, args, client, handler, rbx){
        const prefix = await handler.getPrefix();
        if(args.length == 1){
            const name = args[0];

            const id = await RbxManager.getRobloxID(rbx, name);
            if(id == null){
                const embed = new Discord.MessageEmbed()
                .setTitle("User doesn't exist :warning:")
                .setColor("#ed0909")
                .setDescription(`The stated user does not exist on Roblox. Make sure to state a roblox name.`)
                .setFooter(Index.footer)
                .setTimestamp();
                message.channel.send({embeds: [embed]})
                return; 
            }

            const playerinfo = await rbx.getPlayerInfo(id);
            const robloxgroupid = (await handler.getConfig("Roblox-Group-Id")).Value;
            const thumbnail = await rbx.getPlayerThumbnail(id, 720, "png", false, "Headshot")
            let rank;
            if(await RbxManager.isInGroup(rbx, handler, id)){
                rank = await rbx.getRankNameInGroup(robloxgroupid, id)
            }else{
                rank = "N/A"
            }
            var oldNames = playerinfo.oldNames.join(", ");
            if(playerinfo.oldNames.length == 0 || oldNames == undefined){
                oldNames = "N/A"
            }
            const datestring = new Date(playerinfo.joinDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
            var date = dateFormat(datestring, "ddd mmm d yyyy hh:MM TT")
            const embed = new Discord.MessageEmbed()
            .setTitle("Roblox Profile")
            .setDescription("Roblox profile for " + name)
            .setThumbnail(thumbnail[0].imageUrl)
            .setColor("#f55138")
            .addField("Username", playerinfo.username, true)
            .addField("User ID", id.toString(), true)
            .addField("Rank in " + handler.getDivisionName(), rank.toString(), true)
            .addField("Join Date", date + " EST (" + playerinfo.age + " days ago)", true)
            .addField("Old Names", oldNames, true)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
        }else if(args.length == 0){


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

            const user = message.member;

            const personnelid = (await handler.getConfig("Personnel-Id")).Value;

            if(!user.roles.cache.some(r => r.id == personnelid)){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`Only members with the Personnel role and those who are meant to be in the database can use this command without the **<Roblox name>** parameter. \nIf you are a guest or anyone without the personnel role do **${prefix}info <Roblox name>**.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]})
                return;
            }

            if(await handler.isOnSpreadsheet(user.id) == false){
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


                await handler.addMember(user.id, robloxid, user).then(async () =>{
                    const playerinfo = await rbx.getPlayerInfo(parseInt(robloxid));
    
                    const robloxgroupid = (await handler.getConfig("Roblox-Group-Id")).Value;
        
                    const thumbnail = await rbx.getPlayerThumbnail(parseInt(robloxid), 720, "png", false, "Headshot")
        
                    let rank;
                    if(await RbxManager.isInGroup(rbx, handler, parseInt(robloxid))){
                        rank = await rbx.getRankNameInGroup(robloxgroupid, parseInt(robloxid))
                    }else{
                        rank = "N/A"
                    }
        
                    var oldNames = playerinfo.oldNames.join(", ");
                    if(playerinfo.oldNames.length == 0 || oldNames == undefined){
                        oldNames = "N/A"
                    }
        
                    const datestring = new Date(playerinfo.joinDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
        
                    var date = dateFormat(datestring, "ddd mmm d yyyy hh:MM TT")
        
        
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Roblox Profile")
                    .setDescription("Roblox profile for <@" + message.author.id + ">")
                    .setThumbnail(thumbnail[0].imageUrl)
                    .setColor("#f55138")
                    .addField("Username", playerinfo.username, true)
                    .addField("User ID", robloxid.toString(), true)
                    .addField("Rank in " + handler.getDivisionName(), rank.toString(), true)
                    .addField("Join Date", date + " EST (" + playerinfo.age + " days ago)", true)
                    .addField("Old Names", oldNames, true)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                })
            }else{
                var id = await handler.getRobloxId(user.id);

                const playerinfo = await rbx.getPlayerInfo(id);
    
                const robloxgroupid = (await handler.getConfig("Roblox-Group-Id")).Value;
    
                const thumbnail = await rbx.getPlayerThumbnail(id, 720, "png", false, "Headshot")
    
                let rank;
                if(await RbxManager.isInGroup(rbx, handler, id)){
                    rank = await rbx.getRankNameInGroup(robloxgroupid, id)
                }else{
                    rank = "N/A"
                }
    
                var oldNames = playerinfo.oldNames.join(", ");
                if(playerinfo.oldNames.length == 0 || oldNames == undefined){
                    oldNames = "N/A"
                }
    
                const datestring = new Date(playerinfo.joinDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
    
                var date = dateFormat(datestring, "ddd mmm d yyyy hh:MM TT")
    
    
                const embed = new Discord.MessageEmbed()
                .setTitle("Roblox Profile")
                .setDescription("Roblox profile for <@" + message.author.id + ">")
                .setThumbnail(thumbnail[0].imageUrl)
                .setColor("#f55138")
                .addField("Username", playerinfo.username, true)
                .addField("User ID", id.toString(), true)
                .addField("Rank in " + handler.getDivisionName(), rank.toString(), true)
                .addField("Join Date", date + " EST (" + playerinfo.age + " days ago)", true)
                .addField("Old Names", oldNames, true)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}info <@User | Roblox name> or just ${prefix}info`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;  
        }
    }
}