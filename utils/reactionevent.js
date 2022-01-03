const Discord = require("discord.js");
const Index = require("../index")
const timer = ms => new Promise(res => setTimeout(res, ms))
const dateFormat = require("dateformat");
const DivisionHandler = require("../db/DivisionHandler");

async function messageReaction(client, user, handler, reaction, rbx) {
    if (user.bot) return;
    const { message, emoji } = reaction;

    const inactivity_appeals = await handler.getChannel("inactivity-appeals");
    const logging = await handler.getChannel("logging");
    const patrol_logs = await handler.getChannel("patrol-logs");
    const activity_logs = await handler.getChannel("activity-logs");
    const event_logs = await handler.getChannel("event-logs");
    const react_logs = await handler.getChannel("react-logs");
    const nick_appeals = await handler.getChannel("nick-appeals");
    const inactivityid = (await handler.getConfig("Inacitivty-Role-Id")).Value;
    const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;
    const patrolsawardactivity = (await handler.getConfig("Patrols-Award-Activity")).Value != 0;
    const nameposition = parseInt(await handler.getNamePosition());

    const configformat = (await handler.getConfig("Name-Format")).Value;
    const numberofslashformat = configformat.split("|").length;

    if (message.channel.id == inactivity_appeals) {

        if (emoji.name == "✅") {
            const embed = message.embeds[0];


            const name = embed.fields.find(element => element.name === "Name:").value;
            const length = embed.fields.find(element => element.name === "Length in days:").value;
            const reason = embed.fields.find(element => element.name === "Reason:").value;


            var inmessageid = embed.footer.text.split("ß")[0];
            var authorid = embed.footer.text.split("ß")[1];
            var startDate = embed.footer.text.split("ß")[2];

            var tempDate = new Date(startDate);


            var endDate = new Date(tempDate.getTime() + (86400000 * length));


            client.guilds.cache.get(handler.getGuildID()).members.fetch(authorid).then((member) => {
                if (!member) {
                    if (message != null && message != undefined) {
                        message.delete().catch((err) => { });
                        return;
                    }
                    return;
                }

                member.roles.add(message.guild.roles.cache.find(r => r.id == inactivityid)).catch(err => {});

                handler.addInactivityNotice(member.id, startDate, endDate.toString(), reason, inmessageid);

                client.channels.cache.get(inactivitychannelid).messages.fetch(inmessageid).then((msg) => {
                    if (msg && msg != undefined) {
                        msg.reactions.removeAll();
                        msg.react("✅")
                    }
                }).catch(err => { });

                const txt = new Discord.MessageEmbed()
                .setTitle("Inactivity Notice Approved")
                .setColor("#8f8c89")
                .setDescription(`Requestor: <@${member.id}>\nLength: ${length} days\nReason: ${reason}\nApproved by: <@${user.id}>`)
                .setFooter(Index.footer)
                .setTimestamp();

                const usermsg = new Discord.MessageEmbed()
                .setTitle(":palm_tree: Your Inactivity Notice was accepted :palm_tree:")
                .setDescription(`Departure Date: **${dateFormat(tempDate, "m/d/yy")}**\nReturn Date: **${dateFormat(endDate, "m/d/yy")}**\n__We hope to see you back soon.__`)
                .setColor("#16e60b")
                .setFooter(Index.footer)
                .setTimestamp();

                member.send({ embeds: [usermsg] });

                client.channels.cache.get(react_logs).send({ embeds: [txt] });

                if (message != null && message != undefined) {
                    message.delete().catch((err) => { });
                }
            })

        }

        if (emoji.name == "❌") {
            const embed = message.embeds[0];

            const name = embed.fields.find(element => element.name === "Name:").value;
            const length = embed.fields.find(element => element.name === "Length in days:").value;
            const reason = embed.fields.find(element => element.name === "Reason:").value;

            var inmessageid = embed.footer.text.split("ß")[0];
            var authorid = embed.footer.text.split("ß")[1];
            var startDate = embed.footer.text.split("ß")[2];



            client.guilds.cache.get(handler.getGuildID()).members.fetch(authorid).then((member) => {
                if (!member) {
                    if (message != null && message != undefined) {
                        message.delete().catch((err) => { });
                        return;
                    }
                    return;
                }

                client.channels.cache.get(inactivitychannelid).messages.fetch(inmessageid).then((msg) => {
                    if (msg && msg != undefined) {
                        msg.delete().catch(err => { });
                    }
                }).catch(err => { });

                const txt = new Discord.MessageEmbed()
                    .setTitle("Inactivity Notice Declined")
                    .setColor("#ed0909")
                    .setDescription(`Requestor: <@${member.id}>\nLength: ${length} days\nReason: ${reason}\nDeclined by: <@${user.id}>`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                const usermsg = new Discord.MessageEmbed()
                    .setTitle(":x: Your Inactivity Notice was declined :x:")
                    .setDescription(`__Contact <@${user.id}> if you think this is wrong.__`)
                    .setColor("#ed0909")
                    .setFooter(Index.footer)
                    .setTimestamp();

                member.send({ embeds: [usermsg] });

                client.channels.cache.get(react_logs).send({ embeds: [txt] });

                if (message != null && message != undefined) {
                    message.delete().catch((err) => { });
                }
            })

        }


    }

    if (message.channel.id == inactivitychannelid) {
        client.guilds.cache.get(handler.getGuildID()).members.fetch(user).then((member) => {
            if (member == null || member == undefined || member.user.bot) {
                return;
            }
            if (getPermissionLevel(member) < 4) {
                reaction.users.remove(member);
            }
        })
    }

    if (message.channel.id == logging) {
        if (reaction.count < 3) {
            var embed = message.embeds[0]
            if (emoji.name == "✅") {
                if(embed == undefined){
                    if(message != undefined && message != null){
                        message.delete().catch(err => {});
                    }
                }
                if (embed.title != "Activity log Approval Required" && embed.title != "Event log Approval Required" && embed.title != "Patrol log Approval Required") {
                    const tempes = message.content.split("+");

                    //Patrol log with IMAGE LINK
                    if (tempes[3] != null && tempes[3] == "Patrol") {

                        var args = message.content.split(" ");

                        var time = args[0];

                        time = time.replace(/(\r\n|\n|\r)/gm, "");
                        time = time.replace(/\s+/g, '');

                        if (args[0] != undefined && args[0] != undefined) {
                            var name = args[1];
                            var link = args[4];
                            name = name.replace(/(\r\n|\n|\r)/gm, "");
                            name = name.replace(/\s+/g, '');

                            link = link.replace(/(\r\n|\n|\r)/gm, "");
                            link = link.replace(/\s+/g, '');

                            if (name != undefined && link != undefined) {
                                if (name != null && link != null) {
                                    const ids = message.content.split("+");
                                    const author = ids[1];

                                    
                                    client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then((member) => {
                                        if (!member) {
                                            if (message != null && message != undefined) {
                                                message.delete().catch((err) => { });
                                                return;
                                            }
                                            return;
                                        }
                                        client.channels.cache.get(patrol_logs).messages.fetch(ids[2]).then((msg) => {
                                            if (msg) {
                                                if (msg != undefined && msg != null) {
                                                    msg.delete().catch((err) => { });
                                                }
                                            }
                                        }).catch(d => {
                                        })




                                        handler.isOnSpreadsheet(member.id).then(async (bool) => {
                                            if (bool) {
                                                if(patrolsawardactivity){
                                                    handler.addAttendancePoints(member.id, parseInt(args[3])).then(async () => {
                                                        const txt = new Discord.MessageEmbed()
                                                        .setTitle("Patrol log Approved")
                                                        .setColor("#fcc570")
                                                        .setDescription(`Time: **${time}**\nPoints added: ${args[3]}\nProof link: ${link}\nTime of the log: ${tempes[4]}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                        .setFooter(Index.footer)
                                                        .setTimestamp();
    
                                                        client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                                    })
                                                }else{
                                                    handler.addPatrolPoints(member.id, parseInt(args[3])).then(async () => {
                                                        const txt = new Discord.MessageEmbed()
                                                        .setTitle("Patrol log Approved")
                                                        .setColor("#fcc570")
                                                        .setDescription(`Time: **${time}**\nPoints added: ${args[3]}\nProof link: ${link}\nTime of the log: ${tempes[4]}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                        .setFooter(Index.footer)
                                                        .setTimestamp();
    
                                                        client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                                    })
                                                }
                                                if (message != null && message != undefined) {
                                                    message.delete().catch((err) => { });
                                                    return;
                                                }
                                                return;
                                            } else {
                                                var robloxid1;

                                                try{
                                                    robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                                }catch(error){
                                                    const embed = new Discord.MessageEmbed()
                                                    .setTitle('Error :warning:')
                                                    .setColor("#ed0909")
                                                    .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();
            
                                                    const embed1 = new Discord.MessageEmbed()
                                                    .setTitle('Error :warning:')
                                                    .setColor("#ed0909")
                                                    .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();
            
                                                    member.send({embeds: [embed1]}).catch(err =>{});
                                        
                                                    message.channel.send({embeds: [embed]}).then((msg) =>{
                                                        setTimeout(()=>{
                                                            msg.delete().catch(err =>{});
                                                        }, 3000);
                                                    })
                                                    return;
                                                }

                                                handler.addMember(member.id, robloxid1, member).then(async () => {
                                                    if(patrolsawardactivity){
                                                        handler.addAttendancePoints(member.id, parseInt(args[3])).then(async () => {
                                                            const txt = new Discord.MessageEmbed()
                                                            .setTitle("Patrol log Approved")
                                                            .setColor("#fcc570")
                                                            .setDescription(`Time: **${time}**\nPoints added: ${args[3]}\nProof link: ${link}\nTime of the log: ${tempes[4]}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                            .setFooter(Index.footer)
                                                            .setTimestamp();
        
                                                            client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                                        })
                                                    }else{
                                                        handler.addPatrolPoints(member.id, parseInt(args[3])).then(async () => {
                                                            const txt = new Discord.MessageEmbed()
                                                            .setTitle("Patrol log Approved")
                                                            .setColor("#fcc570")
                                                            .setDescription(`Time: **${time}**\nPoints added: ${args[3]}\nProof link: ${link}\nTime of the log: ${tempes[4]}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                            .setFooter(Index.footer)
                                                            .setTimestamp();
        
                                                            client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                                        })
                                                    }
                                                    if (message != null && message != undefined) {
                                                        message.delete().catch((err) => { });
                                                        return;
                                                    }
                                                    return;
                                                })
                                            }
                                        })
                                    })

                                } else {
                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                        return;
                                    }
                                    return;
                                }
                            } else {
                                if (message != null && message != undefined) {
                                    message.delete().catch((err) => { });
                                    return;
                                }
                                return;
                            }
                        }
                        return;
                    }
                    return;
                } else {
                    const ids = embed.footer.text.split("+");
                    const author = ids[0]
        
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                        if (!member) {
                            if (message != null && message != undefined) {
                                message.delete().catch((err) => { });
                                return;
                            }
                            return;
                        }



                        if (embed.title == "Patrol log Approval Required") {
                            const args = embed.description.split("[");

                            client.channels.cache.get(patrol_logs).messages.fetch(ids[1]).then((msg) => {
                                if (msg) {
                                    if (msg != undefined && msg != null) {
                                        msg.delete().catch((err) => { });
                                    }
                                }
                            }).catch(d => {
                            })

                            const variables = args[0].split(" ");
                            const time = parseInt(variables[3]);

                            var ppoints = Math.trunc(time / 30);

                            handler.isOnSpreadsheet(member.id).then(async (bool) => {
                                if (bool) {
                                    if(patrolsawardactivity){
                                        handler.addAttendancePoints(member.id, ppoints).then(async () => {
                                            const txt = new Discord.MessageEmbed()
                                            .setTitle("Patrol log Approved")
                                            .setColor("#fcc570")
                                            .setDescription(`Time: **${time}**\nPoints added: ${ppoints}\nProof link: ${link}\nTime of the log: ${embed.fields[0].value}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();

                                            client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                        })
                                    }else{
                                        handler.addPatrolPoints(member.id, parseInt(ppoints)).then(async () => {
                                            const txt = new Discord.MessageEmbed()
                                            .setTitle("Patrol log Approved")
                                            .setColor("#fcc570")
                                            .setDescription(`Time: **${time}**\nPoints added: ${ppoints}\nProof link: ${link}\nTime of the log: ${embed.fields[0].value}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();

                                            client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                        })
                                    }
                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                        return;
                                    }

                                    return;
                                } else {
                                    var robloxid1;

                                    try{
                                        robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                    }catch(error){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        member.send({embeds: [embed1]}).catch(err =>{});
                            
                                        message.channel.send({embeds: [embed]}).then((msg) =>{
                                            setTimeout(()=>{
                                                msg.delete().catch(err =>{});
                                            }, 3000);
                                        })
                                        return;
                                    }
                                    handler.addMember(member.id, robloxid1, member).then(async () => {
                                        if(patrolsawardactivity){
                                            handler.addAttendancePoints(member.id, ppoints).then(async () => {
                                                const txt = new Discord.MessageEmbed()
                                                .setTitle("Patrol log Approved")
                                                .setColor("#fcc570")
                                                .setDescription(`Time: **${time}**\nPoints added: ${ppoints}\nProof link: ${link}\nTime of the log: ${embed.fields[0].value}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                .setFooter(Index.footer)
                                                .setTimestamp();
    
                                                client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                            })
                                        }else{
                                            handler.addPatrolPoints(member.id, parseInt(ppoints)).then(async () => {
                                                const txt = new Discord.MessageEmbed()
                                                .setTitle("Patrol log Approved")
                                                .setColor("#fcc570")
                                                .setDescription(`Time: **${time}**\nPoints added: ${ppoints}\nProof link: ${link}\nTime of the log: ${embed.fields[0].value}\nUser: <@${member.id}>\nApproved by: <@${user.id}>`)
                                                .setFooter(Index.footer)
                                                .setTimestamp();
    
                                                client.channels.cache.get(react_logs).send({ embeds: [txt] });
                                            })
                                        }
                                        if (message != null && message != undefined) {
                                            message.delete().catch((err) => { });
                                            return;
                                        }
                                        return;
                                    })
                                }
                            })

                        }
                    })
                }

            }
            if (emoji.name == "1️⃣") {
                if (embed == undefined || embed == null) {
                    if (message != null && message != undefined) {
                        message.delete().catch((err) => { });
                    }
                } else {
                    //Logs with IMAGE Link:
                    if (embed.title != "Activity log Approval Required" && embed.title != "Event log Approval Required" && embed.title != "Patrol log Approval Required") {
                        //Event Log with IMAGE LINK:
                        var args = message.content.split(" ");
                        var type = args[0];

                        type = type.replace(/(\r\n|\n|\r)/gm, "");
                        type = type.replace(/\s+/g, '');

                        if (args[0] != undefined && args[0] != undefined) {
                            var name = args[1];
                            var link = args[2];

                            name = name.replace(/(\r\n|\n|\r)/gm, "");
                            name = name.replace(/\s+/g, '');

                            link = link.replace(/(\r\n|\n|\r)/gm, "");
                            link = link.replace(/\s+/g, '');

                            if (name != undefined && link != undefined) {
                                if (name != null && link != null) {
                                    const ids = message.content.split("+");
                                    const author = ids[1]
                                    
                                    client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                                        if (!member) {

                                            if (message != null && message != undefined) {
                                                message.delete().catch((err) => { });
                                                return;
                                            }
                                            return;
                                        }

                                        client.channels.cache.get(event_logs).messages.fetch(ids[2]).then((msg) => {
                                            if (msg) {
                                                if (msg != undefined && msg != null) {
                                                    msg.delete().catch((err) => { });
                                                }
                                            }
                                        }).catch(d => {
                                        })

                                        handler.isOnSpreadsheet(member.id).then(async (bool) => {
                                            if (bool) {
                                                handler.addHostingPoints(member.id, 1).then(async () => {
                                                    const txt = new Discord.MessageEmbed()
                                                    .setTitle("Event log Approved")
                                                    .setColor("#aba9f3")
                                                    .setDescription(`Event type: **${type}**\nHost: **<@${member.id}>**\nProof link: ${link}\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();

                                                    client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                                })

                                                if (message != null && message != undefined) {
                                                    message.delete().catch((err) => { });

                                                }

                                            } else {
                                                var robloxid1;

                                                try{
                                                    robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                                }catch(error){
                                                    const embed = new Discord.MessageEmbed()
                                                    .setTitle('Error :warning:')
                                                    .setColor("#ed0909")
                                                    .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();
            
                                                    const embed1 = new Discord.MessageEmbed()
                                                    .setTitle('Error :warning:')
                                                    .setColor("#ed0909")
                                                    .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();
            
                                                    member.send({embeds: [embed1]}).catch(err =>{});
                                        
                                                    message.channel.send({embeds: [embed]}).then((msg) =>{
                                                        setTimeout(()=>{
                                                            msg.delete().catch(err =>{});
                                                        }, 3000);
                                                    })
                                                    return;
                                                }

                                                handler.addMember(member.id, robloxid1, member).then(async () => {
                                                    handler.addHostingPoints(member.id, 1).then(async () => {
                                                        const txt = new Discord.MessageEmbed()
                                                        .setTitle("Event log Approved")
                                                        .setColor("#aba9f3")
                                                        .setDescription(`Event type: **${type}**\nHost: **<@${member.id}>**\nProof link: ${link}\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                                        .setFooter(Index.footer)
                                                        .setTimestamp();

                                                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                                    })

                                                    if (message != null && message != undefined) {
                                                        message.delete().catch((err) => { });
                                                    }
                                                })
                                            }
                                        })
                                    })

                                } else {
                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                        return;
                                    }
                                    return;
                                }
                            } else {
                                if (message != null && message != undefined) {
                                    message.delete().catch((err) => { });
                                    return;
                                }
                                return;
                            }
                        } else {
                            if (message != null && message != undefined) {
                                message.delete().catch((err) => { });
                                return;
                            }
                            return;
                        }
                        return;
                    }


                    const ids = embed.footer.text.split("+");
                    const author = ids[0];
                    
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                        if (!member) {
                            if (message != null && message != undefined) {
                                message.delete().catch((err) => { });
                                return;
                            }
                            return;
                        }

                        const eventtype = embed.description.split(" ")[3];

                        if (embed.title == "Activity log Approval Required") {
                            const args = embed.description.split("[");
                            var host = args[1].replace("]", "");


                            client.channels.cache.get(activity_logs).messages.fetch(ids[1]).then((msg) => {
                                if (msg) {
                                    if (msg != undefined && msg != null) {
                                        msg.delete().catch((err) => { });
                                    }
                                }
                            }).catch(d => {
                            })

                            handler.isOnSpreadsheet(member.id).then(async (bool) => {
                                if (bool) {
                                    handler.addAttendancePoints(member.id, 1).then(async () => {
                                        const txt = new Discord.MessageEmbed()
                                            .setTitle("Activity log Approved")
                                            .setColor("#e67e22")
                                            .setDescription(`Event type: **${eventtype}**\nAttendee: <@${member.id}>\nHost: **${host}**\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();

                                        client.channels.cache.get(react_logs).send({ embeds: [txt] })
                                    })

                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                    }

                                } else {
                                    var robloxid1;

                                    try{
                                        robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                    }catch(error){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        member.send({embeds: [embed1]}).catch(err =>{});
                            
                                        message.channel.send({embeds: [embed]}).then((msg) =>{
                                            setTimeout(()=>{
                                                msg.delete().catch(err =>{});
                                            }, 3000);
                                        })
                                        return;
                                    }

                                    handler.addMember(member.id, robloxid1, member).then(async () => {
                                        handler.addAttendancePoints(member.id, 1).then(async () => {
                                            const txt = new Discord.MessageEmbed()
                                            .setTitle("Activity log Approved")
                                            .setColor("#e67e22")
                                            .setDescription(`Event type: **${eventtype}**\nAttendee: <@${member.id}>\nHost: **${host}**\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();

                                            client.channels.cache.get(react_logs).send({ embeds: [txt] })
                                        })

                                        if (message != null && message != undefined) {
                                            message.delete().catch((err) => { });
                                        }
                                    })
                                }
                            })

                        }

                        if (embed.title == "Event log Approval Required") {

                            const args = embed.description.split("[");
                            var host = args[1].replace("]", "");

                            client.channels.cache.get(event_logs).messages.fetch(ids[1]).then((msg) => {
                                if (msg) {
                                    if (msg != undefined && msg != null) {
                                        msg.delete().catch((err) => { });
                                    }
                                }
                            }).catch(d => {
                            })
                            handler.isOnSpreadsheet(member.id).then(async (bool) => {
                                if (bool) {
                                    handler.addHostingPoints(member.id, 1).then(async () => {
                                        const txt = new Discord.MessageEmbed()
                                        .setTitle("Event log Approved")
                                        .setColor("#aba9f3")
                                        .setDescription(`Event type: **${eventtype}**\nHost: **<@${member.id}>**\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                    })

                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                    }

                                } else {
                                    var robloxid1;

                                    try{
                                        robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                    }catch(error){
                                        const embed = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Error :warning:')
                                        .setColor("#ed0909")
                                        .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        member.send({embeds: [embed1]}).catch(err =>{});
                            
                                        message.channel.send({embeds: [embed]}).then((msg) =>{
                                            setTimeout(()=>{
                                                msg.delete().catch(err =>{});
                                            }, 3000);
                                        })
                                        return;
                                    }

                                    handler.addMember(member.id, robloxid1, member).then(async () => {
                                        handler.addHostingPoints(member.id, 1).then(async () => {
                                            const txt = new Discord.MessageEmbed()
                                            .setTitle("Event log Approved")
                                            .setColor("#aba9f3")
                                            .setDescription(`Event type: **${eventtype}**\nHost: **<@${member.id}>**\nPoints added: **1**\nApproved by: <@${user.id}>`)
                                            .setFooter(Index.footer)
                                            .setTimestamp();

                                            client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                        })

                                        if (message != null && message != undefined) {
                                            message.delete().catch((err) => { });
                                        }
                                    })
                                }
                            })
                        }
                    })

                }

            }
            if(emoji.name == "2️⃣"){
                if(embed == undefined || embed == null){
                   if(message != null && message != undefined){
                       message.delete().catch((err) =>{});
                   } 
                }else{
                //Logs with IMAGE Link:
                if(embed.title != "Activity log Approval Required" && embed.title != "Event log Approval Required" && embed.title != "Patrol log Approval Required"){
                    //Event Log with IMAGE LINK:
                    var args = message.content.split(" ");
                    var type = args[0];

                    type = type.replace(/(\r\n|\n|\r)/gm, "");
                    type = type.replace(/\s+/g, '');

                    if(args[0] != undefined && args[0] != undefined){
                        var name = args[1];
                        var link = args[2];

                        name = name.replace(/(\r\n|\n|\r)/gm, "");
                        name = name.replace(/\s+/g, '');

                        link = link.replace(/(\r\n|\n|\r)/gm, "");
                        link = link.replace(/\s+/g, '');

                        if(name != undefined && link != undefined){
                            if(name != null && link != null){
                                const ids = message.content.split("+");
                                const author = ids[1]
                                client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member =>{
                                    if(!member){
                                        if(message != null && message != undefined){
                                            message.delete().catch((err) =>{});
                                            return;
                                        }
                                        return;
                                    }
                                    client.channels.cache.get(event_logs).messages.fetch(ids[2]).then((msg) =>{
                                        if(msg){
                                            if(msg != undefined && msg != null){
                                                msg.delete().catch((err) =>{});
                                            }
                                        }
                                    }).catch(d =>{
                                    })
    
                                    handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                        if(bool){
                                            handler.addHostingPoints(member.id, 2).then(async ()=>{
                                                const txt = new Discord.MessageEmbed()
                                                .setTitle("Event log Approved")
                                                .setColor("#aba9f3")
                                                .setDescription(`Event type: **${type}**\nHost: **<@${member.id}>**\nProof link: ${link}\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                                .setFooter(Index.footer)
                                                .setTimestamp();
                            
                                                client.channels.cache.get(react_logs).send({embeds: [txt]})                 
                                            })
                                
                                            if(message != null && message != undefined){
                                                message.delete().catch((err) =>{});
                                            }
                                            
                                        }else{
                                            var robloxid1;

                                            try{
                                                robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                            }catch(error){
                                                const embed = new Discord.MessageEmbed()
                                                .setTitle('Error :warning:')
                                                .setColor("#ed0909")
                                                .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                                .setFooter(Index.footer)
                                                .setTimestamp();
        
                                                const embed1 = new Discord.MessageEmbed()
                                                .setTitle('Error :warning:')
                                                .setColor("#ed0909")
                                                .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                                .setFooter(Index.footer)
                                                .setTimestamp();
        
                                                member.send({embeds: [embed1]}).catch(err =>{});
                                    
                                                message.channel.send({embeds: [embed]}).then((msg) =>{
                                                    setTimeout(()=>{
                                                        msg.delete().catch(err =>{});
                                                    }, 3000);
                                                })
                                                return;
                                            }

                                            handler.addMember(member.id, robloxid1, member).then(async ()=>{
                                                handler.addHostingPoints(member.id, 2).then(async ()=>{
                                                    const txt = new Discord.MessageEmbed()
                                                    .setTitle("Event log Approved")
                                                    .setColor("#aba9f3")
                                                    .setDescription(`Event type: **${type}**\nHost: **<@${member.id}>**\nProof link: ${link}\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                                    .setFooter(Index.footer)
                                                    .setTimestamp();
                                
                                                    client.channels.cache.get(react_logs).send({embeds: [txt]})        
                                                })
                                    
                                                if(message != null && message != undefined){
                                                    message.delete().catch((err) =>{});
                                                }
                                            })
                                        }
                                    })
                                })
                                
                            }else{
                                if(message != null && message != undefined){
                                    message.delete().catch((err) =>{});
                                    return;
                                }
                                return;
                            }
                        }else{
                            if(message != null && message != undefined){
                                message.delete().catch((err) =>{});
                                return;
                            }
                            return;
                        }
                    }else{
                        if(message != null && message != undefined){
                            message.delete().catch((err) =>{});
                            return;
                        }
                        return;
                    }
                    return;
                }


                const ids = embed.footer.text.split("+");
                const author = ids[0]

                client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member =>{
                    if(!member){
                        if(message != null && message != undefined){
                            message.delete().catch((err) =>{});
                            return;
                        }
                        return;
                    }
    
                    const eventtype = embed.description.split(" ")[3];
    
                    if(embed.title == "Activity log Approval Required"){
                        const name = member.nickname.split(" ")[2];
    
                        const args = embed.description.split("[");
                        var host = args[1].replace("]", "");
    
    
                       client.channels.cache.get(activity_logs).messages.fetch(ids[1]).then((msg) =>{
                        if(msg){
                            if(msg != undefined && msg != null){
                                msg.delete().catch((err) =>{});
                            }
                        }
                       }).catch(d =>{
                       })
    
                       handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                          if(bool){
                            handler.addAttendancePoints(member.id, 2).then(async ()=>{
                                const txt = new Discord.MessageEmbed()
                                .setTitle("Activity log Approved")
                                .setColor("#e67e22")
                                .setDescription(`Event type: **${eventtype}**\nAttendee: <@${member.id}>\nHost: **${host}**\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                client.channels.cache.get(react_logs).send({embeds: [txt]})  
                
                            })
                            if(message != null && message != undefined){
                                message.delete().catch((err) =>{}); 
                            }
                               
                         }else{
                               var robloxid1;
   
                               try{
                                   robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                               }catch(error){
                                   const embed = new Discord.MessageEmbed()
                                   .setTitle('Error :warning:')
                                   .setColor("#ed0909")
                                   .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                   .setFooter(Index.footer)
                                   .setTimestamp();
   
                                   const embed1 = new Discord.MessageEmbed()
                                   .setTitle('Error :warning:')
                                   .setColor("#ed0909")
                                   .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                   .setFooter(Index.footer)
                                   .setTimestamp();
   
                                   member.send({embeds: [embed1]}).catch(err =>{});
                       
                                   message.channel.send({embeds: [embed]}).then((msg) =>{
                                       setTimeout(()=>{
                                           msg.delete().catch(err =>{});
                                       }, 3000);
                                   })
                                   return;
                               }

                               handler.addMember(member.id, robloxid1, member).then(async () =>{ 
                                   handler.addAttendancePoints(member.id, 2).then(async ()=>{
                                       const txt = new Discord.MessageEmbed()
                                       .setTitle("Activity log Approved")
                                       .setColor("#e67e22")
                                       .setDescription(`Event type: **${eventtype}**\nAttendee: <@${member.id}>\nHost: **${host}**\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                       .setFooter(Index.footer)
                                       .setTimestamp();
                    
                                        client.channels.cache.get(react_logs).send({embeds: [txt]})          
                                    })

                                    if(message != null && message != undefined){
                                        message.delete().catch((err) =>{});
                                    }
                               })
                           }
                       })
    
                    }
                    
                    if(embed.title == "Event log Approval Required"){
                        const args = embed.description.split("[");
                        var host = args[1].replace("]", "");
    
                        client.channels.cache.get(event_logs).messages.fetch(ids[1]).then((msg) =>{
                            if(msg){
                                if(msg != undefined && msg != null){
                                    msg.delete().catch((err) =>{});
                                }
                            }
                        }).catch(d =>{})

                        handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                            if(bool){

                                handler.addHostingPoints(member.id, 2).then(async ()=>{
                                    const txt = new Discord.MessageEmbed()
                                    .setTitle("Event log Approved")
                                    .setColor("#aba9f3")
                                    .setDescription(`Event type: **${eventtype}**\nHost: **<@${member.id}>**\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                
                                    client.channels.cache.get(react_logs).send({embeds: [txt]})
                
                                })
                    
                                if(message != null && message != undefined){
                                    message.delete().catch((err) =>{}); 
                                }
                                
                            }else{
                                var robloxid1;

                                try{
                                    robloxid1 = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                }catch(error){
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle('Error :warning:')
                                    .setColor("#ed0909")
                                    .setDescription(`The user is not linked with Bloxlink. He has to run the /verify command.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Error :warning:')
                                    .setColor("#ed0909")
                                    .setDescription(`You are not linked with Bloxlink. You have to run the /verify command.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                    member.send({embeds: [embed1]}).catch(err =>{});
                        
                                    message.channel.send({embeds: [embed]}).then((msg) =>{
                                        setTimeout(()=>{
                                            msg.delete().catch(err =>{});
                                        }, 3000);
                                    })
                                    return;
                                }
                                handler.addMember(member.id, robloxid1, member).then(async ()=>{
                                    handler.addHostingPoints(member.id, 2).then(async ()=>{
                                        const txt = new Discord.MessageEmbed()
                                        .setTitle("Event log Approved")
                                        .setColor("#aba9f3")
                                        .setDescription(`Event type: **${eventtype}**\nHost: **<@${member.id}>**\nPoints added: **2**\nApproved by: <@${user.id}>`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                    
                                        client.channels.cache.get(react_logs).send({embeds: [txt]})
                    
                                    })
                        
                                    if(message != null && message != undefined){
                                        message.delete().catch((err) =>{});
                                    }
                                    
                                })
                            }
                        })
                    }
                })
                
              }                
            }
            if (emoji.name == "❌") {

                if (embed == null || embed == undefined) {
                    const ids = message.content.split("+");
                    client.channels.cache.get(patrol_logs).messages.fetch(ids[2]).then((msg) => {
                        if (msg) {
                            if (msg != undefined && msg != null) {
                                msg.delete().catch((err) => { });
                            }
                        }
                    }).catch(d => {
                    })

                    if (message != null && message != undefined) {
                        message.delete().catch((err) => { });
                    }
                    return;
                }

                if (embed.title != "Event log Approval Required" && embed.title != "Activity log Approval Required" && embed.title != "Patrol log Approval Required") {

                    const tempes = message.content.split("+");

                    //Patrol log with IMAGE LINK
                    if (tempes[3] != null && tempes[3] == "Patrol") {
                        var args = message.content.split(" ");

                        var time = args[0];

                        time = time.replace(/(\r\n|\n|\r)/gm, "");
                        time = time.replace(/\s+/g, '');
                        time = time.replace("**", "")

                        if (args[0] != undefined && args[0] != undefined) {
                            var link = args[3];

                            link = link.replace(/(\r\n|\n|\r)/gm, "");
                            link = link.replace(/\s+/g, '');

                            if (link != undefined) {
                                if (link != null) {
                                    const ids = message.content.split("+");
                                    const author = ids[1]

                                    client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                                        if (!member) {
                                            if (message != null && message != undefined) {
                                                message.delete().catch((err) => { });
                                                return;
                                            }
                                            return;
                                        }
                                        client.channels.cache.get(patrol_logs).messages.fetch(ids[2]).then((msg) => {
                                            if (msg) {
                                                if (msg != undefined && msg != null) {
                                                    msg.delete().catch((err) => { });
                                                }
                                            }
                                        }).catch(d => {
                                        })

                                        const txt = new Discord.MessageEmbed()
                                        .setTitle("Patrol log Denied")
                                        .setColor("#ed0909")
                                        .setDescription(`Stated time in minutes: **${time}**\nAmount of points: ${args[3]}\nProof link: ${link}\nUser: <@${member.id}>\nDenied by: <@${user.id}>`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                        const txt1 = new Discord.MessageEmbed()
                                        .setTitle("Your event log was DENIED")
                                        .setColor("#ed0909")
                                        .setDescription(`Stated time in minutes: **${time}**\nDenied by: <@${user.id}>\n __Contact the stated member of HiCom for more information__`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();

                                        member.send({embeds: [txt1]}).catch((err) => { });
                                        if (message != null && message != undefined) {
                                            message.delete().catch((err) => { });
                                        }
                                    })
                                } else {
                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                        return;
                                    }
                                    return;
                                }

                            } else {
                                if (message != null && message != undefined) {
                                    message.delete().catch((err) => { });
                                    return;
                                }
                                return;
                            }
                        }
                        return;
                    }





                    //Event logs       

                    var args = message.content.split(" ");
                    var type1 = args[0]

                    type1 = type1.replace(/(\r\n|\n|\r)/gm, "");
                    type1 = type1.replace(/\s+/g, '');

                    if (type1 == undefined && type1 == null) {
                        return;
                    }

                    var name1 = args[1];
                    var link1 = args[2];

                    name1 = name1.replace(/(\r\n|\n|\r)/gm, "");
                    name1 = name1.replace(/\s+/g, '');

                    link1 = link1.replace(/(\r\n|\n|\r)/gm, "");
                    link1 = link1.replace(/\s+/g, '');

                    if (name1 != undefined && link1 != undefined) {
                        if (name1 != null && link1 != null) {
                            const ids = message.content.split("+");
                            const author = ids[1];
                            client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                                if (!member) {
                                    if (message != null && message != undefined) {
                                        message.delete().catch((err) => { });
                                        return;
                                    }
                                    return;
                                }
                                client.channels.cache.get(event_logs).messages.fetch(ids[2]).then((msg) => {
                                    if (msg) {
                                        if (msg != undefined && msg != null) {
                                            msg.delete().catch((err) => { });
                                        }
                                    }
                                }).catch(d => {})
                                const txt = new Discord.MessageEmbed()
                                .setTitle("Event log Denied")
                                .setColor("#ed0909")
                                .setDescription(`Event type: **${type1}**\nHost: **${name1}**\nDenied by: <@${user.id}>`)
                                .setFooter(Index.footer)
                                .setTimestamp();

                                client.channels.cache.get(react_logs).send({ embeds: [txt] })

                                const txt1 = new Discord.MessageEmbed()
                                .setTitle("Your event log was DENIED")
                                .setColor("#ed0909")
                                .setDescription(`Event type: **${type1}**\nDenied by: <@${user.id}>\n __Contact the stated member of HiCom for more information__`)
                                .setFooter(Index.footer)
                                .setTimestamp();

                                member.send({embeds: [txt1]}).catch((err) => { });
                                if (message != null && message != undefined) {
                                    message.delete().catch((err) => { });
                                }
                            })
                        }
                    }
                    return;
                }



                //Logs with Embeds 
                const ids = embed.footer.text.split("+");
                const author = ids[0]
                
                client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                    if (!member) {
                        if (message != null && message != undefined) {
                            message.delete().catch((err) => { });
                            return;
                        }
                        return;
                    }


                    const eventtype = embed.description.split(" ")[3];

                    if (embed.title == "Event log Approval Required") {
                        const args = embed.description.split("[");
                        var host = args[1].replace("]", "");

                        client.channels.cache.get(event_logs).messages.fetch(ids[1]).then((msg) => {
                            if (msg) {
                                if (msg != undefined && msg != null) {
                                    msg.delete()
                                        .catch((err) => { });
                                }
                            }
                        }).catch(d => {})

                        const txt = new Discord.MessageEmbed()
                        .setTitle("Event log Denied")
                        .setColor("#ed0909")
                        .setDescription(`Event type: **${eventtype}**\nHost: **${host}**\nDenied by: <@${user.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                        const txt1 = new Discord.MessageEmbed()
                        .setTitle("Your event log was DENIED")
                        .setColor("#ed0909")
                        .setDescription(`Event type: **${eventtype}**\nDenied by: <@${user.id}>\n __Contact the stated member of HiCom for more information__`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        member.send({embeds: [txt1]}).catch((err) => { });

                        if (message != undefined) {
                            message.delete().catch((err) => { });
                        }
                    }


                    if (embed.title == "Patrol log Approval Required") {
                        const args = embed.description.split("[");
                        var host = args[1].replace("]", "");


                        client.channels.cache.get(patrol_logs).messages.fetch(ids[1]).then((msg) => {
                            if (msg) {
                                if (msg != undefined) {
                                    msg.delete().catch((err) => { });
                                }
                            }
                        }).catch(d => {
                        })

                        const variables = args[0].split(" ");
                        const time = parseInt(variables[3]);

                        var ppoints = Math.trunc(time / 30);


                        const txt = new Discord.MessageEmbed()
                        .setTitle("Patrol log Denied")
                        .setColor("#ed0909")
                        .setDescription(`Stated time in minutes: **${time}\nAmount of points: ${ppoints}\nUser: <@${member.id}>\nDenied by: <@${user.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                        const txt1 = new Discord.MessageEmbed()
                        .setTitle("Your patrol log was DENIED")
                        .setColor("#ed0909")
                        .setDescription(`Stated time in minutes: **${time}**\nDenied by: <@${user.id}>\n __Contact the stated member of HiCom for more information__`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        member.send({embeds: [txt1]}).catch((err) => { });
                        if (message != undefined) {
                            message.delete().catch((err) => { });
                        }
                    }


                    if (embed.title == "Activity log Approval Required") {
                        const args = embed.description.split("[");
                        var host = args[1].replace("]", "");

                        client.channels.cache.get(activity_logs).messages.fetch(ids[1]).then((msg) => {
                            if (msg) {
                                if (msg != undefined) {
                                    msg.delete().catch((err) => { });
                                }
                            }
                        }).catch(d => {})

                        const txt = new Discord.MessageEmbed()
                        .setTitle("Activity log Denied")
                        .setColor("#ed0909")
                        .setDescription(`Event type: **${eventtype}**\nAttendee: <@${member.id}>\nHost: **${host}**\nDenied by: <@${user.id}>`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        client.channels.cache.get(react_logs).send({ embeds: [txt] })

                        const txt1 = new Discord.MessageEmbed()
                        .setTitle("Your activity log was DENIED")
                        .setColor("#ed0909")
                        .setDescription(`Event type: **${eventtype}**\nHost: **${host}**\nDenied by: <@${user.id}>\n __Contact the stated member of HiCom for more information__`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        member.send({embeds: [txt1]}).catch((err) => { });

                        if (message != undefined) {
                            message.delete().catch((err) => { });
                        }
                    }
                })


            }
        }
    }
    if (message.channel.id == nick_appeals) {
        if (reaction.count < 3) {
            var embed = message.embeds[0];

            const ids = embed.footer.text.split("+");

            const author = ids[0];
            client.guilds.cache.get(handler.getGuildID()).members.fetch(author).then(member => {
                if (!member) {
                    message.delete().catch((err) => { });
                    return;
                }

                const oldname = embed.description.split(" ")[7];

                const args = embed.description.split("[");
                var newnick = args[1].replace("]", "");

                const newname = newnick.split(" ")[nameposition];


                if (emoji.name == "✅") {
                    if (member.roles.cache.some(r => r.name == "Guest")) {
                        member.setNickname(newnick)
                            .catch((err) => { });

                        var oldname1;
                        if (member.nickname == undefined || member.nickname == null) {
                            oldname1 = member.user.tag.split("#").shift();
                        } else {
                            oldname1 = member.nickname;
                        }

                        const embed = new Discord.MessageEmbed()
                        .setTitle("Nickname request approved")
                        .setColor("#56d402")
                        .setDescription(`Old Nickname: ** ${oldname1} **\nNew nickname: **${newnick}**`)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        member.send({ embeds: [embed] }).catch((err) => { });

                        if (message != undefined && message != null) {
                            message.delete()
                        }
                        return;
                    }
                    handler.isOnSpreadsheet(member.id).then((bool) => {
                        if (bool) {
                            handler.updateName(oldname, newname).then(() => {
                                member.setNickname(newnick)
                                    .catch((err) => { });

                                var oldname1;
                                if (member.nickname == undefined || member.nickname == null) {
                                    oldname1 = member.user.tag;
                                } else {
                                    oldname1 = member.nickname;
                                }

                                const embed = new Discord.MessageEmbed()
                                .setTitle("Nickname request approved")
                                .setColor("#56d402")
                                .setDescription(`Old Nickname: ** ${oldname1} **\nNew nickname: **${newnick}**`)
                                .setFooter(Index.footer)
                                .setTimestamp();

                                member.send({ embeds: [embed] }).catch((err) => { });

                                if (message != undefined && message != null) {
                                    message.delete()
                                }
                            })
                        } else {
                            if (message != undefined && message != null) {
                                message.delete()
                            }
                        }
                    })
                }
                if (emoji.name == "❌") {
                    var embed1 = message.embeds[0];

                    var oldname1;
                    if (member.nickname == undefined || member.nickname == null) {
                        oldname1 = member.user.tag;
                    } else {
                        oldname1 = member.nickname;
                    }

                    const args = embed1.description.split("[");
                    var newnick = args[1].replace("]", "");
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Nickname request denied")
                    .setColor("#ed0909")
                    .setDescription(`Old Nickname: ** ${oldname1} **\nNew nickname: **${newnick}**`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    member.send({ embeds: [embed] }).catch((err) => { });

                    if (message != undefined && message != null) {
                        message.delete()
                    }
                }
            })

        }

    }
}


module.exports.messageReaction = messageReaction;