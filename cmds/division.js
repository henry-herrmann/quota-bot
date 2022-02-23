const Discord = require("discord.js");
const Index = require("../index");
const timer = ms => new Promise(res => setTimeout(res, ms));
const divisions = require("../utils/Divisions");

module.exports = {
    name: "division",
    async execute(message, args, handler, rbx){
        const prefix = await handler.getPrefix();

        if(args.length == 0){
            const selected_div = divisions.find(d => d.short == handler.getDivisionName());

            if(selected_div == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}division <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }

            await timer(1500);

            const group = await rbx.getGroup(selected_div.id);
            const shout = await rbx.getShout(selected_div.id);
            const co_user = await rbx.getPlayers(selected_div.id, selected_div.co_roleset_id);
            const xo_user = await rbx.getPlayers(selected_div.id, selected_div.xo_roleset_id);
            const logo = await rbx.getLogo(selected_div.id);

            const embed = new Discord.MessageEmbed()
            .setTitle(selected_div.name)
            .setDescription(`${selected_div.short} is a division of TGR owned by ${group.owner.username}`)
            .setColor(selected_div.color)
            .setThumbnail(logo)
            .setURL(selected_div.url)
            .addField("Member Count:", group.memberCount.toString(), true)
            .addField(selected_div.co_name, co_user[0] != undefined ? co_user[0].username : "N/A", true)
            .addField(selected_div.xo_name , xo_user == undefined ? "N/A" : xo_user.length > 1 ? xo_user.map(xo => xo.username).join(", ") : xo_user.length == 1 ? xo_user[0].username : "N/A", true)
            .addField("Current shout:", `__${shout.poster.username}__: ${shout.body}`, true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]});
        }else if(args.length == 1){
            const selected_div = divisions.find(d => d.short.toLocaleLowerCase() == args[0].toLowerCase());

            if(selected_div == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}division <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }

            await timer(1500);

            const group = await rbx.getGroup(selected_div.id);
            //const shout = await rbx.getShout(selected_div.id);
            const co_user = await rbx.getPlayers(selected_div.id, selected_div.co_roleset_id);
            const xo_user = await rbx.getPlayers(selected_div.id, selected_div.xo_roleset_id);
            const logo = await rbx.getLogo(selected_div.id);

            const embed = new Discord.MessageEmbed()
            .setTitle(`${selected_div.name} (${selected_div.short})`)
            .setDescription(`The ${selected_div.name} is a division of TGR owned by ${group.owner.username}`)
            .setColor(selected_div.color)
            .setThumbnail(logo)
            .setURL(selected_div.url)
            .addField("Member Count:", group.memberCount.toString(), true)
            .addField(selected_div.co_name, co_user[0] != undefined ? co_user[0].username : "N/A", true)
            .addField(selected_div.xo_name, xo_user == undefined ? "N/A" : xo_user.length > 1 ? xo_user.map(xo => xo.username).join(", ") : xo_user.length == 1 ? xo_user[0].username : "N/A", true)
            //.addField("Current shout:", `__${shout.poster.username}__: ${shout.body}`, true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]});

        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}division <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}