const Discord = require('discord.js');
const Index = require("../index");
const RbxManager =require("./RbxManager");

module.exports = {
    async run(member, handler, client, rbx){
        const personnelid = (await handler.getConfig("Personnel-Id")).Value;
        const prefix = await handler.getPrefix();
        const react_logs = await handler.getChannel("react-logs");

        if(member.roles.cache.some(r => r.id == personnelid)){
            handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                if(bool){
                    var id = await handler.getRobloxId(member.id);
                    var name = await RbxManager.getNameFromId(id);
                    await RbxManager.exileUser(rbx, handler, id);
                    await handler.removeMember(member.id);
    
                    const embed = new Discord.MessageEmbed()
                    .setTitle(":exclamation: User left without discharge. :exclamation:")
                    .setColor("#f26f3f")
                    .setDescription(`<@${member.id}>(${name}) left without discharge. In case the user was discharged, remember to use the ${prefix}discharge command next time.`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    client.channels.cache.get(react_logs).send({embeds: [embed]});
                    client.channels.cache.get(react_logs).send(`<@&${personnelid}>`);
                }else{
                    var robloxid;

                    try{
                        robloxid = await DivisionHandler.getRobloxId(user.id, handler.getGuildID());
                    }catch(error){
                        return;
                    }

                    await RbxManager.exileUser(rbx, handler, robloxid);
                }
            })
        }
        
    }
}