const Discord = require("discord.js");
const Index = require("../index");
const timer = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    name: "division",
    async execute(message, args, handler, rbx){
        const prefix = await handler.getPrefix();

        const divisions = [
            {
                active: true,
                short: "501st",
                name: "501st Legion",
                color: "#3091f2",
                id: 2771077,
                xo_roleset_id: 28623477,
                co_roleset_id: 28623499,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2771077/501st-Legion"
            },
            {
                active: true,
                short: "104th",
                name: "104th Battalion",
                color: "#828585",
                id: 2772305,
                xo_roleset_id: 29893621,
                co_roleset_id: 29893623,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2772305/104th-Battalion"
            },
            {
                active: true,
                short: "RC",
                name: "Republic Commandos",
                color: "#11f0e8",
                id: 2985765,
                xo_roleset_id: 30746017,
                co_roleset_id: 20439748,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2985765/Republic-Commandos"
            },
            {
                active: true,
                short: "ARF",
                name: "Advanced Recon Forces",
                color: "#91c74c",
                id: 2963286,
                xo_roleset_id: 20362843,
                co_roleset_id: 20263591,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2963286/ARF-Program"
            },
            {
                active: true,
                short: "RI",
                name: "Republic Intelligence",
                color: "#000000",
                id: 2897836,
                xo_roleset_id: 19735301,
                co_roleset_id: 19735272,
                co_name: "Director:",
                xo_name: "Deputy Director:",
                url: "https://www.roblox.com/groups/2897836/Republic-Intelligence"
            },
            {
                active: true,
                short: "CG",
                name: "Coruscant Guard",
                color: "#ff0505",
                id: 5356502,
                xo_roleset_id: 35571817,
                co_roleset_id: 35571822,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/5356502/TGR-The-Coruscant-Guard"
            },
            {
                active: true,
                short: "ARC",
                name: "Advanced Recon Commandos",
                color: "#f2ea02",
                id: 2809562,
                xo_roleset_id: 30745987,
                co_roleset_id: 19002470,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2809562/ARC-Program"
            },
            {
                active: true,
                short: "RG",
                name: "Red Guard",
                color: "#a6020f",
                id: 2854333,
                xo_roleset_id: 34512464,
                co_roleset_id: 30745894,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2854333/The-Red-Guard"
            },
            {
                active: true,
                short: "212th",
                name: "212th Attack Battalion",
                color: "#fc8c03",
                id: 2772292,
                xo_roleset_id: 29270867,
                co_roleset_id: 18916550,
                co_name: "Commanding Officer:",
                xo_name: "Executive Officer(s):",
                url: "https://www.roblox.com/groups/2772292/212th-Attack-Battalion"
            }
        ]

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