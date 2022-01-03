const Discord = require('discord.js');
const Index = require("../index");
const RbxManager = require('../utils/RbxManager');
const axios = require('axios');


module.exports = {
    name: "check",
    async execute(message, args, handler, rbx){
        if(await  handler.getPermissionLevel(message.member) < 1){
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

        if(args.length == 1){
            if(args[0] == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}check <Roblox name>`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return;
            }

            const user = args[0];
            const id = await RbxManager.getRobloxID(rbx, user);
            if(id == null){
                const embed = new Discord.MessageEmbed()
                .setTitle("User doesn't exist :warning:")
                .setColor("#ed0909")
                .setDescription(`The stated user does not exist on Roblox.`)
                .setFooter(Index.footer)
                .setTimestamp();
                message.channel.send({embeds: [embed]})
                return; 
            }
            const maindivs = [
                {
                    name: "187th Legion",
                    id: 5777024
                },
                {
                    name: "Coruscant Guard",
                    id: 5356502
                },
                {
                    name: "212th Attack Battalion",
                    id: 2772292
                },
                {
                    name: "501st Legion",
                    id: 2771077
                },
                {
                    name: "Republic Intelligence",
                    id: 2897836
                }
            ]
            
            const subs = [
                {
                    name: "ARF",
                    id: 2963286
                },
                {
                    name: "ARC",
                    id: 2809562
                }
            ]
            
            const aux = [
                {
                    name: "RG",
                    id: 2854333
                },
                {
                    name: "SG",
                    id: 2746631
                }
            ]

            var groups = await rbx.getGroups(id);

            var divisions = checkDivision(groups, maindivs, subs, aux);


            var maindivisions = [];
            var subdivision = [];
            var auxes = [];

            for(d of divisions){
                for(m of maindivs){
                    if(d.id == m.id){
                        maindivisions.push(d);
                    }
                }
                for(s of subs){
                    if(d.id == s.id){
                        subdivision.push(d);
                    }
                }
                for(a of aux){
                    if(d.id == a.id){
                        auxes.push(d);
                    }
                }
            }

            var divisionstring = "";

            for(var i=0; i<divisions.length; i++){
                if(i == 0){
                    divisionstring = divisionstring + divisions[i].name;
                }else{
                    divisionstring = divisionstring + "," + divisions[i].name;
                }
            }

            

            var limitviolation = "No violations found.";

            const divisiontype = (await handler.getConfig("Division-Type")).Value;

            if(divisiontype.toString().toUpperCase() == "MAIN"){
                if(maindivisions.length >= 1){
                    const names = maindivisions.map(s => s.name);
                    if(!names.includes(handler.getDivisionName())){
                        limitviolation = "The user is already in a main division.";
                    }
                }
            }
            if(divisiontype.toString().toUpperCase() == "SUB"){
                if(subdivision.length >= 1){
                    const names = subdivision.map(s => s.name);
                    if(!names.includes(handler.getDivisionName())){
                        limitviolation = "The user is already in a sub division.";
                    }
                }
            }
            if(divisiontype.toString().toUpperCase() == "AUX"){
                if(auxes.length >= 1){
                    const names = auxes.map(s => s.name);
                    if(!names.includes(handler.getDivisionName())){
                        limitviolation = "The user is already in an aux division.";
                    }
                }
            }

            var isinDW = false;

            for(g of groups){
                if(g.Id == 4532129){
                    isinDW = true;
                }
            }

            var isinTJO = false;

            for(g of groups){
                if(g.Id == 4282520){
                    isinTJO = true;
                }
            }

            var isinTGR = true;

            var tgr = [];
            for(group of groups){
                if(group.Id == 2742631){
                    tgr.push(group)
                }
            }

            if(tgr.length == 0){
                isinTGR = false;
            }


            var isBlacklisted = false;
            const playerinfo = await rbx.getPlayerInfo(id);

            var treq = await getCardsForList("60543037b438d45221ae6448")
            let tcards = treq.data;

        
            //await trello.getCardsOnList("60543037b438d45221ae6448");


            for(card of tcards){
                if(card.name.includes("/")){
                    var names = card.name.split("/");
                    for(mname of names){
                        if(user == mname){
                            isBlacklisted = true;
                        }
                        if(playerinfo.oldNames != undefined){
                            for(oldName of playerinfo.oldNames){
                                if(oldName == mname){
                                    isBlacklisted = true;
                                }
                            }
                        }
                    }
                }else{
                    if(user == card.name){
                        isBlacklisted = true;
                    }
                    if(playerinfo.oldNames != undefined){
                        for(oldName of playerinfo.oldNames){
                            if(oldName == card.name){
                                isBlacklisted = true;
                            }
                        }
                    }
                }  
            }

            

            var preq = await getCardsForList("60543031caadda7d7598660e")//await trello.getCardsOnList("60543031caadda7d7598660e");
            let pcards = preq.data;

            for(card of pcards){
                if(card.name.includes("/")){
                    var names = card.name.split("/");
                    for(mname of names){
                        if(user == mname){
                            isBlacklisted = true;
                        }
                        if(playerinfo.oldNames != undefined){
                            for(oldName of playerinfo.oldNames){
                                if(oldName == mname){
                                    isBlacklisted = true;
                                }
                            }
                        }
                    }
                }else{
                    if(user == card.name){
                        isBlacklisted = true;
                    }
                    if(playerinfo.oldNames != undefined){
                        for(oldName of playerinfo.oldNames){
                            if(oldName == card.name){
                                isBlacklisted = true;
                            }
                        }
                    }
                }  
            }
            if(limitviolation != "No violations found."){
                divisionstring = " __Divisions: [" + divisionstring + "]__";
            }else{
                divisionstring = "";
            }

            const thumbnail = await rbx.getPlayerThumbnail(id, 720, "png", false, "Headshot")
            

            var oldNames = "N/A";

            if(playerinfo.oldNames != null && playerinfo.oldNames.length > 0){
                oldNames = playerinfo.oldNames.join(", ");
            }

            var badges = await rbx.getPlayerBadges(id, 100);
            var friends = await rbx.getFriends(id);

            const embed = new Discord.MessageEmbed()
            .setTitle(user)
            .setThumbnail(thumbnail[0].imageUrl)
            .setURL("https://www.roblox.com/users/"+ id + "/profile")
            .setColor("#f55138")
            .addField("Username", user, true)
            .addField("Age", playerinfo.age.toString() + " days", true)
            .addField("Violates division limit?", limitviolation + divisionstring, true)
            .addField("Is in TJO?", isinTJO == true ? "**YES**" : "No", true)
            .addField("Is in TIU?", isinDW == true ? "**YES**" : "No", true)
            .addField("Is TGR blacklisted?", isBlacklisted == true ? "**YES**" : "No", true)
            .addField("Number of groups", groups.length.toString(), true)
            .addField("Number of Friends", friends.data.length.toString(), true)
            .addField("Number of badges" , badges.length == 100 ? "100+" : badges.length.toString(), true)
            .addField("Old Names", oldNames, true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}check <Roblox name>`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;
        }
    }
}

function checkDivision(groups, maindivs, subs, aux){
    var divisions = [];
    for(g of groups){
        for(main of maindivs){
            if(g.Id == main.id){
                divisions.push(main);
            }
        }
        for(sub of subs){
            if(g.Id == sub.id){
                divisions.push(sub);
            }
        }
        for(a of aux){
            if(g.Id == a.id){
                divisions.push(a);
            }
        }
    }
    return divisions;
}

function getCardsForList(id){
    return new Promise(async (resolve, reject) =>{
        const res = await axios.get(`https://api.trello.com/1/lists/${id}/cards`)
        resolve(res);
    })
}