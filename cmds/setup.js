const Discord = require("discord.js");
const Index = require("../index");


module.exports = {
    name: "setup",
    async execute(message, args, handler, client, prefix){
        if(!message.member.permissions.has("ADMINISTRATOR")){
            const embed = new Discord.MessageEmbed()
            .setTitle('Insufficient permissions :warning:')
            .setColor("#ed0909")
            .setDescription(`You are missing the required permissions to execute this command.`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;
        }

        if(await handler.isConfigured() == true){
            const embed = new Discord.MessageEmbed()
            .setTitle('Division already configured :warning:')
            .setColor("#ed0909")
            .setDescription(`The setup process is finished already. Please use the **${prefix}change** command.`)
            .setFooter(Index.footer)
            .setTimestamp();
                  
            message.channel.send({embeds: [embed]})
            return;
        }


        let questions = [
            {
                question: "What prefix would you like to use? :one:",
                key: "Prefix",
                desc: "Please reply with a letter.",
                reply: "Sucessfully set the prefix to: "
            },
            {
                question: "What is your divisional color? :two:",
                key: "Divisional-Color",
                require: "Hex",
                desc: "Please reply with a hex-code to identify your color.",
                reply: "Sucessfully set the divisional-color to: "
            },
            {
                question: "Would you like to enable patrols? :three:",
                key: "Patrols",
                desc: "Please reply with Yes or No",
                reply: "Sucessfully set patrol support to: "
            },
            {
                question: "If you enabled patrol points, how many minutes are worth one patrol point? :four:",
                key: "Patrol-Minutes",
                desc: "Reply with a number. __Default is **30**. __Reply with 0 if you disabled patrol logs!!!!**",
                require: "Number",
                reply: "Sucessfully set value of one patrol point to: "
            },
            {
                question: "What is the attendance quota for non-staff? :five:",
                key: "Attend-Quota",
                desc: "Please reply with a number.",
                require: "Number",
                reply: "Sucessfully set the attendance quota to: "
            },
            {
                question: "What is the patrol quota for non-staff? :six:",
                key: "Patrol-Quota",
                desc: "Reply with a number. **Reply with 0 if you don't want patrol points!!!!**",
                require: "Number",
                reply: "Sucessfully set the patrol quota to: "
            },
            {
                question: "What is the hosting quota for staff? :seven:",
                key: "Hosting-Quota",
                desc: "Please reply with a number.",
                require: "Number",
                reply: "Sucessfully set the hosting quota to: "
            },
            {
                question: "What is the attendance quota for staff? :eight:",
                key: "Staff-Attendance-Quota",
                desc: "Please reply with a number.",
                require: "Number",
                reply: "Sucessfully set the staff attendance quota to: "
            },
            {
                question: "What is the patrol quota for staff? :nine:",
                key: "Staff-Patrol-Quota",
                desc: "Please reply with a number. **Reply with 0 if you don't want patrol points!!!**",
                require: "Number",
                reply: "Sucessfully set the staff patrol quota to: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 5. :one::zero:",
                level: 5,
                permission: true,
                desc: "Please ping all roles that are meant to have access to all commands. Normally this is given to the Commander and XO.",
                require: "Role-Mention",
                reply: "The following roles now have access to all commands: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 4. :one::one:",
                level: 4,
                permission: true,
                desc: "Please ping all roles that have access to almost all commands except resetpoints. Normally this is given to AOs.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 4: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 3. :one::two:",
                level: 3,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 3 which grants access to standard commands only. This is normally given to CCs or CC like roles to identify them as CC.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 3: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 2. :one::three:",
                level: 2,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 2 which grants access to standard commands only. This is reserved for LTs and JCs.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 2: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 1. :one::four:",
                level: 1,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 1 which grants access to standard commands only. This is the level for normal staff members like Ensigns, Corporals, etc.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 1: "
            },
            {
                question: "Please ping all company roles. :one::five:",
                permission: false,
                type: "company",
                desc: "This is necessary in order for the auto rank roblox group feature to work.",
                require: "Role-Mention",
                reply: "Company roles: "
            },
            {
                question: "Please ping the trooper role. :one::six:",
                permission: false,
                type: "trooper",
                desc: "If you don't have one, simply say 'No'",
                require: "Role-Mention",
                reply: "Trooper role: "
            },
            {
                question: "Please ping the enlist role. :one::seven:",
                permission: false,
                type: "enlist",
                desc: "This is necessary for the auto rank feature to work.",
                require: "Role-Mention",
                reply: "Enlist role: "
            },
            {
                question: "What permission level should be the minimum to use the filter and announce command? :one::eight:",
                key: "Filter-Permission-Level",
                desc: "Reply with a number. __Default is **4**.",
                require: "Number",
                reply: "Successfully set the minimu perm level for the filter command to: "
            },
            {
                question: "What is the id of the roblox group? :one::nine:",
                level: 1,
                key: "Roblox-Group-Id",
                desc: "Please reply with a number.",
                require: "Roblox-Group-Id",
                reply: "Roblox Group Id: "
            },
            {
                question: "We will now ask you a few questions about the roblox group tied to this discord. :two::zero:",
                dummy: true,
                desc: `Once you are ready to proceed, reply with Yes`,
                require: "Roblox-Rank-Id",
                reply: "Rank id: "
            },
            {
                question: "Would you like to enable the auto rank feature? :two::one:",
                key: "Auto-Rank",
                require: "bool",
                desc: "If enabled, this feature will log role changes and update the roblox rank automatically based on the previous information.\nPlease reply with **Yes** or **No**",
                reply: "Auto ranked feature enabled: "
            },
            {
                question: "Would you like to have two pictures for patrol logs? :two::two:",
                key: "Two-Pictures-Patrols",
                require: "bool",
                desc: "If enabled, members will be required to post the links of two pictures.\n**Reply with NO if you don't want patrol logs.**\nPlease reply with **Yes** or **No**",
                reply: "Two pictures for patrol logs enabled: "
            },
            {
                question: "Would you like to have new members announced in a channel? :two::three:",
                key: "Announce-Members",
                require: "bool",
                desc: "If enabled, you will be able to use the announce command.\nPlease reply with **Yes** or **No**",
                reply: "Announce members enabled: "
            },
            {
                question: "If you chose to announce new members, please state the channel id. :two::four:",
                key: "Announce-channel",
                require: "Channel-Mention",
                desc: "Please reply with a channel id. **Reply with 0 if you chose to disable the feature.**",
                reply: "Announcement channel for new members: "
            },
            {
                question: "Please ping the personnel role :two::five:",
                key: "Personnel-Id",
                require: "Role-Mention",
                desc: "Please mention the personnel role.",
                reply: "Personnel role Id: "
            },
            {
                question: "Please ping the inactivity notice role :two::six:",
                key: "Inacitivty-Role-Id",
                require: "Role-Mention",
                desc: "Please mention the IN role.",
                reply: "Inactivity notice role Id: "
            },
            {
                question: "Please ping the new role :two::seven:",
                key: "New-Role-Id",
                require: "Role-Mention",
                desc: "The new role is typically the role for those who just returned from IN or who are new to the division.",
                reply: "New role Id: "
            },
            {
                question: "Please ping the new staff role :two::eight:",
                key: "New-Staff-Role-Id",
                require: "Role-Mention",
                desc: "The new staff role is typically the role for those who just returned from IN or just got staff.",
                reply: "New staff role Id: "
            },
            {
                question: "What's the full name of the division? :two::nine:",
                key: "Division-Name",
                desc: "Please reply with the full name of your division e.g. Senate Guard or 501st Legion.",
                reply: "Division Name: "
            },
            {
                question: "Under what category falls this division? :three::zero:",
                key: "Division-Type",
                desc: "Reply with a valid type like main, aux, sub.",
                reply: "Division type: "
            },
            {
                question: "In which channel should the bot post log approvals? :three::one:",
                key: "Logging-Channel",
                desc: "For instance if somone logs an event, their log will be posted in this channel.\nReply with a channel mention",
                reply: "Logging channel: ",
                require: "Channel-Mention"
            },
            {
                question: "In which channel should the bot log interactions with the bot? :three::two:",
                key: "React-Logs-Channel",
                desc: "For instance if someone accepts logs posted into that channel, the bot will log it here. Think of it as an **audit log channel**.\nReply with a channel mention",
                reply: "React logs channel: ",
                require: "Channel-Mention"
            },
            {
                question: "In which channel should the bot post inactivity appeals? :three::three:",
                key: "Inactivity-Appeals-Channel",
                desc: "When someone requests an IN, the bot will post their log in this channel.\nReply with a channel mention",
                reply: "Inactivity appeals: ",
                require: "Channel-Mention"
            },
            {
                question: "In which channel should the bot post roblox audit logs? :three::four:",
                key: "Rbx-Audit-Channel",
                desc: "All rank changes, exiles and join request approvals will be logged in that channel.\nReply with a channel mention",
                reply: "Roblox audit logs: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your inactivity notices channel? :three::five:",
                key: "Inactivity-Channel",
                desc: "This is required to monitor INs.\nReply with a channel mention",
                reply: "Inactivity notices: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your bot commands channel? :three::six:",
                key: "Automata-Channel",
                desc: "This is required to limit normal user interaction to that channel.\nReply with a channel mention",
                reply: "Bot commands: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your activity logs channel? :three::seven:",
                key: "Activity-Logs-Channel",
                desc: "This is required to monitor activity logs.\nReply with a channel mention",
                reply: "Activity logs: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your event logs channel? :three::eight:",
                key: "Event-Logs-Channel",
                desc: "This is required to monitor event logs.\nReply with a channel mention",
                reply: "Event logs: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your patrol channel? :three::nine:",
                key: "Patrol-Logs-Channel",
                desc: "This is required to monitor patrol logs.\nReply with a channel mention **or 0 if you disabled patrol points.**",
                reply: "Patrol logs: ",
                require: "Channel-Mention"
            },
            {
                question: "What is your filtering channel? :four::zero:",
                key: "Filtering-Channel",
                desc: "This is required to monitor filtering.\nReply with a channel mention",
                reply: "Filtering: ",
                require: "Channel-Mention"
            },
            {
                question: "If you enabled patrol logs, would you like to have patrols award activity points? :four::one:",
                key: "Patrols-Award-Activity",
                require: "bool",
                desc: "If enabled all patrols will award activity points.\n**If you disabled patrols, please reply with No**.\nPlease reply with **Yes** or **No**",
                reply: "Announce members enabled: "
            },
            {
                question: "What's the minimum number of days of an Inactivity Notice? :four::two:",
                key: "Inactivity-Notice-Minimum",
                require: "Number",
                desc: "Please reply with a number.",
                reply: "Minimum number of days for INs set to: "
            },
            {
                question: "What's the maximum number of days of an Inactivity Notice? :four::three:",
                key: "Inactivity-Notice-Maximum",
                require: "Number",
                desc: "Please reply with a number.",
                reply: "Maximum number of days for INs set to: "
            },
            {
                question: "What welcome message should the bot sent upon announcement of new members? :four::four:",
                key: "Welcome-Message",
                require: "string",
                desc: "You can use placeholders to even more customize your message:\n- {users} - Representing the pings of users that just got filtered\n- {div-name} - Full division name without 'The' before it.",
                reply: "Welcome message: "
            },
        ]

        if(args.length == 0){

            const embed = new Discord.MessageEmbed()
            .setTitle('Welcome to the Quota Bot Setup process :robot:')
            .setColor("#0e64e6")
            .setDescription(`During this process, we will ask you a few questions in order to adjust the database to your needs.\n**Please say 'Yes' in order to continue.**`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})

            const filter = m => m.author.id === message.author.id;

            const start = await awaitMessage(filter, message.channel).catch(err => {return;});

            if(start.content.toUpperCase() != "YES"){
                const embed1 = new Discord.MessageEmbed()
                .setTitle('Setup process cancelled :x:')
                .setColor("#ed0909")
                .setDescription(`The setup process was cancelled due to manual cancellation.`)
                .setFooter(Index.footer)
                .setTimestamp();
                  
                message.channel.send({embeds: [embed1]})
                return;
            }
            
            for(question of questions){

                if(question.key == "Patrols"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle(question.question)
                    .setColor("#0e64e6")
                    .setDescription(question.desc)
                    .setFooter(Index.footer)
                    .setTimestamp();
                
                    message.channel.send({embeds: [embed]})

                    const answer = await awaitMessage(filter, message.channel).catch(err =>{});

                    if(answer.content.toUpperCase() == "CANCEL"){
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Cancelled :x:')
                        .setColor("#ed0909")
                        .setFooter(Index.footer)
                        .setTimestamp();
                                  
                        message.channel.send({embeds: [embed1]})
                        return;
                    }

                    if(answer.content.toUpperCase() == "YES" || answer.content.toUpperCase() == "NO"){
                        handler.setPatrol(message.guild.id, answer.content.toUpperCase() == "YES" ? 1 : 0);

                        if(answer.content.toUpperCase() == "YES"){
                            handler.addPatrolTable();
                        }else{
                            handler.removePatrolTable();
                        }

                        const embed1 = new Discord.MessageEmbed()
                        .setTitle(question.reply + answer.content)
                        .setColor("#56d402")
                        .setDescription(``)
                        .setFooter(Index.footer)
                        .setTimestamp();
        
                        message.channel.send({embeds: [embed1]})
                    }else{
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Incorrect answer :x:')
                        .setColor("#ed0909")
                        .setDescription(`Only reply with Yes or No.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                                  
                        message.channel.send({embeds: [embed1]})

                        const answer1 = await awaitMessage(filter, message.channel);

                        if(answer1.content.toUpperCase() == "CANCEL"){
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle('Cancelled :x:')
                            .setColor("#ed0909")
                            .setFooter(Index.footer)
                            .setTimestamp();
                                      
                            message.channel.send({embeds: [embed1]})
                            return;
                        }

                        handler.setPatrol(message.guild.id, answer1.content.toUpperCase() == "YES" ? 1 : 0);

                        const embed2 = new Discord.MessageEmbed()
                        .setTitle(question.reply + answer1.content)
                        .setColor("#56d402")
                        .setDescription(``)
                        .setFooter(Index.footer)
                        .setTimestamp();
        
                        message.channel.send({embeds: [embed2]})
                    }
                }else{
                    const embed = new Discord.MessageEmbed()
                    .setTitle(question.question)
                    .setColor("#0e64e6")
                    .setDescription(question.desc)
                    .setFooter(Index.footer)
                    .setTimestamp();
                
                    message.channel.send({embeds: [embed]})
    
                    const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                    if(answer.content.toUpperCase() == "CANCEL"){
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Cancelled :x:')
                        .setColor("#ed0909")
                        .setFooter(Index.footer)
                        .setTimestamp();
                                  
                        message.channel.send({embeds: [embed1]})
                        return;
                    }

                    if(question.require == "Number"){
                        if(isNaN(answer.content)){
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle('Incorrect answer :x:')
                            .setColor("#ed0909")
                            .setDescription(`Please reply with a number.`)
                            .setFooter(Index.footer)
                            .setTimestamp();

                            message.channel.send({embeds: [embed1]})

                            const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                            if(answer1.content.toUpperCase() == "CANCEL"){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Cancelled :x:')
                                .setColor("#ed0909")
                                .setFooter(Index.footer)
                                .setTimestamp();
                                          
                                message.channel.send({embeds: [embed1]})
                                return;
                            }

                            handler.updateConfig(question.key, answer1.content);
            
                            const embed2 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer1.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed2]})
                        }else{
                            handler.updateConfig(question.key, answer.content);
            
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed1]})
                        }
                    }else if(question.require == "bool"){

                        if(answer.content.toUpperCase() == "YES" || answer.content.toUpperCase() == "NO"){
                            handler.updateConfig(question.key, answer.content.toUpperCase() == "YES" ? 1 : 0);

                            const embed2 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed2]})
                        }else{
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle('Incorrect answer :x:')
                            .setColor("#ed0909")
                            .setDescription(`Please reply with **Yes** or **No**.`)
                            .setFooter(Index.footer)
                            .setTimestamp();

                            message.channel.send({embeds: [embed1]})

                            const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                            if(answer1.content.toUpperCase() == "CANCEL"){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Cancelled :x:')
                                .setColor("#ed0909")
                                .setFooter(Index.footer)
                                .setTimestamp();
                                          
                                message.channel.send({embeds: [embed1]})
                                return;
                            }

                            handler.updateConfig(question.key, answer1.content.toUpperCase() == "YES" ? 1 : 0);
            
                            const embed2 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer1.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed2]})
                        }
                    }else if(question.require == "Hex"){
                        if(!answer.content.startsWith("#")){
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle('Incorrect answer :x:')
                            .setColor("#ed0909")
                            .setDescription(`Please reply with a hex code starting with #.`)
                            .setFooter(Index.footer)
                            .setTimestamp();

                            message.channel.send({embeds: [embed1]})

                            const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                            if(answer1.content.toUpperCase() == "CANCEL"){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Cancelled :x:')
                                .setColor("#ed0909")
                                .setFooter(Index.footer)
                                .setTimestamp();
                                          
                                message.channel.send({embeds: [embed1]})
                                return;
                            }

                            handler.updateConfig(question.key, answer1.content);
            
                            const embed2 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer1.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed2]})
                        }else{
                            handler.updateConfig(question.key, answer.content);
            
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle(question.reply + answer.content)
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed1]})
                        }
                    }else if(question.require == "format"){
                        const arr = answer.content.split(" ");

                        if(arr.length == 0){
                            const embed1 = new Discord.MessageEmbed()
                            .setTitle('Incorrect answer :x:')
                            .setColor("#ed0909")
                            .setDescription(`Please reply with a valid format such as: Name | Timezone or Paygrade | Name | Timezone`)
                            .setFooter(Index.footer)
                            .setTimestamp();

                            message.channel.send({embeds: [embed1]}) 

                            const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                            if(answer1.content.toUpperCase() == "CANCEL"){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Cancelled :x:')
                                .setColor("#ed0909")
                                .setFooter(Index.footer)
                                .setTimestamp();
                                          
                                message.channel.send({embeds: [embed1]})
                                return;
                            }

                            const arr1 = answer1.content.split(" ");

                            if(!arr1.includes("|")){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Please reply with a valid format such as: Name | Timezone or Paygrade | Name | Timezone`)
                                .setFooter(Index.footer)
                                .setTimestamp(); 

                                message.channel.send({embeds: [embed1]}) 

                                const answer2 = await awaitMessage(filter, message.channel).catch(err => {return;});

                                if(answer2.content.toUpperCase() == "CANCEL"){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Cancelled :x:')
                                    .setColor("#ed0909")
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                              
                                    message.channel.send({embeds: [embed1]})
                                    return;
                                }
    
                                handler.updateConfig(question.key, answer2.content);
    
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer2.content)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }else{
                                handler.updateConfig(question.key, answer1.content);
    
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer1.content)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed1]})
                            }

                        }else{
                            if(!arr.includes("|")){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Please reply with a valid format such as: Name | Timezone or Paygrade | Name | Timezone`)
                                .setFooter(Index.footer)
                                .setTimestamp(); 

                                message.channel.send({embeds: [embed1]}) 

                                const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                                if(answer1.content.toUpperCase() == "CANCEL"){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Cancelled :x:')
                                    .setColor("#ed0909")
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                              
                                    message.channel.send({embeds: [embed1]})
                                    return;
                                }

                                const arr1 = answer1.content.split(" ");

                                const index1 = arr1.findIndex(f => f == "Name");
    
                                handler.updateConfig(question.key, answer1.content);
    
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer1.content)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }else{
                                const index = arr.findIndex(f => f == "Name");

                                handler.updateConfig(question.key, answer.content);
    
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer.content)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed1]})
                            }
                        }
                    }else if(question.require == "Channel-Mention"){
                        if(answer.content == "0"){
                            handler.updateConfig(question.key, "0");
    
                            const embed2 = new Discord.MessageEmbed()
                            .setTitle(question.reply + "0")
                            .setColor("#56d402")
                            .setDescription(``)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [embed2]})
                        }else{
                            if(answer.mentions.channels.first() == undefined || answer.mentions.channels.first() == null){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Please mention a role.`)
                                .setFooter(Index.footer)
                                .setTimestamp();
    
                                message.channel.send({embeds: [embed1]})
    
                                const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});
    
                                if(answer1.content.toUpperCase() == "CANCEL"){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Cancelled :x:')
                                    .setColor("#ed0909")
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                              
                                    message.channel.send({embeds: [embed1]})
                                    return;
                                }
    
                                if(answer1.mentions.channels.first() == undefined || answer1.mentions.channels.first() == null) return;
    
                                handler.updateConfig(question.key, answer1.mentions.channels.first().id);
    
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer1.mentions.channels.first().id)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }else{
                                handler.updateConfig(question.key, answer.mentions.channels.first().id);
    
                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer.mentions.channels.first().id)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }
                        }
                    }else if(question.require == "Role-Mention"){

                        if(question.permission == undefined){
                            if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Please mention a role.`)
                                .setFooter(Index.footer)
                                .setTimestamp();
    
                                message.channel.send({embeds: [embed1]})
    
                                const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});

                                if(answer1.content.toUpperCase() == "CANCEL"){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Cancelled :x:')
                                    .setColor("#ed0909")
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                              
                                    message.channel.send({embeds: [embed1]})
                                    return;
                                }

                                if(answer1.mentions.roles.first() == undefined || answer1.mentions.roles.first() == null) return;

                                handler.updateConfig(question.key, answer1.mentions.roles.first().id);

                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer1.mentions.roles.first().id)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }else{
                                handler.updateConfig(question.key, answer.mentions.roles.first().id);

                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + answer.mentions.roles.first().id)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }
                        }else{
                            if(question.type == "trooper"){
                                if(answer.content.toUpperCase() == "NO"){
                                    handler.updateRobloxRole("0", 0, "trooper");

                                    const embed2 = new Discord.MessageEmbed()
                                    .setTitle(question.reply + "0")
                                    .setColor("#56d402")
                                    .setDescription(``)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed2]})
                                }else{
                                    if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Incorrect answer :x:')
                                        .setColor("#ed0909")
                                        .setDescription(`Please mention a role.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
            
                                        message.channel.send({embeds: [embed1]})
            
                                        const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});
        
                                        if(answer1.content.toUpperCase() == "CANCEL"){
                                            const embed1 = new Discord.MessageEmbed()
                                            .setTitle('Cancelled :x:')
                                            .setColor("#ed0909")
                                            .setFooter(Index.footer)
                                            .setTimestamp();
                                                      
                                            message.channel.send({embeds: [embed1]})
                                            return;
                                        }
            
                                        var roles = answer1.mentions.roles.first(answer1.mentions.roles.size);
            
                                        for(role of roles){
                                            if(question.permission){
                                                handler.updatePermission(role.id, question.level)
                                            }
            
                                            if(question.type == "company"){
                                                handler.updateRobloxRole(role.id, 0, "company"); 
                                            }else if(question.type == "trooper"){
                                                handler.updateRobloxRole(role.id, 0, "trooper");
                                            }else if(question.type == "enlist"){
                                                handler.updateRobloxRole(role.id, 0, "enlist");
                                            }else{
                                                handler.updateRobloxRole(role.id, 0, "staff");
                                            } 
                                            
                                        }
            
                                        var string = roles.map(r => r.id).join(", ");
                                        
                                        const embed2 = new Discord.MessageEmbed()
                                        .setTitle(question.reply + string)
                                        .setColor("#56d402")
                                        .setDescription(``)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed2]})
                                    }else{
                                        var roles = answer.mentions.roles.first(answer.mentions.roles.size);
            
                                        for(role of roles){
                                            if(question.permission){
                                                handler.updatePermission(role.id, question.level)
                                            }
                                            if(question.type == "company"){
                                                handler.updateRobloxRole(role.id, 0, "company"); 
                                            }else if(question.type == "trooper"){
                                                handler.updateRobloxRole(role.id, 0, "trooper");
                                            }else if(question.type == "enlist"){
                                                handler.updateRobloxRole(role.id, 0, "enlist");
                                            }else{
                                                handler.updateRobloxRole(role.id, 0, "staff");
                                            } 
                                        }
            
                                        var string = roles.map(r => r.id).join(", ");
                                        
                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle(question.reply + string)
                                        .setColor("#56d402")
                                        .setDescription(``)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [embed1]})
                                    }
                                }
                            }else{
                                if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Incorrect answer :x:')
                                    .setColor("#ed0909")
                                    .setDescription(`Please mention a role.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
        
                                    message.channel.send({embeds: [embed1]})
        
                                    const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});
    
                                    if(answer1.content.toUpperCase() == "CANCEL"){
                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Cancelled :x:')
                                        .setColor("#ed0909")
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                                                  
                                        message.channel.send({embeds: [embed1]})
                                        return;
                                    }
        
                                    var roles = answer1.mentions.roles.first(answer1.mentions.roles.size);
        
                                    for(role of roles){
                                        if(question.permission){
                                            handler.updatePermission(role.id, question.level)
                                        }
        
                                        if(question.type == "company"){
                                            handler.updateRobloxRole(role.id, 0, "company"); 
                                        }else if(question.type == "trooper"){
                                            handler.updateRobloxRole(role.id, 0, "trooper");
                                        }else if(question.type == "enlist"){
                                            handler.updateRobloxRole(role.id, 0, "enlist");
                                        }else{
                                            handler.updateRobloxRole(role.id, 0, "staff");
                                        } 
                                        
                                    }
        
                                    var string = roles.map(r => r.id).join(", ");
                                    
                                    const embed2 = new Discord.MessageEmbed()
                                    .setTitle(question.reply + string)
                                    .setColor("#56d402")
                                    .setDescription(``)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed2]})
                                }else{
                                    var roles = answer.mentions.roles.first(answer.mentions.roles.size);
        
                                    for(role of roles){
                                        if(question.permission){
                                            handler.updatePermission(role.id, question.level)
                                        }
                                        if(question.type == "company"){
                                            handler.updateRobloxRole(role.id, 0, "company"); 
                                        }else if(question.type == "trooper"){
                                            handler.updateRobloxRole(role.id, 0, "trooper");
                                        }else if(question.type == "enlist"){
                                            handler.updateRobloxRole(role.id, 0, "enlist");
                                        }else{
                                            handler.updateRobloxRole(role.id, 0, "staff");
                                        } 
                                    }
        
                                    var string = roles.map(r => r.id).join(", ");
                                    
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle(question.reply + string)
                                    .setColor("#56d402")
                                    .setDescription(``)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed1]})
                                }
                            }
                        }
                    }else if(question.require == "Roblox-Rank-Id"){
                        const robloxroles1 = await handler.getRobloxRoles();

                        if(answer.content.toUpperCase() == "YES"){
                            for(let i=0; i<robloxroles1.length; i++){
                                if(robloxroles1[i].id != 0){
                                    const embed = new Discord.MessageEmbed()
                                    .setTitle("What is the rank id of the following role?")
                                    .setColor("#0e64e6")
                                    .setDescription(`Role: <@&${robloxroles1[i].id}>`)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                                
                                    message.channel.send({embeds: [embed]})
        
                                    const answer1 = await awaitMessage(filter, message.channel).catch(err => {return;});
    
                                    if(answer1.content.toUpperCase() == "CANCEL"){
                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Cancelled :x:')
                                        .setColor("#ed0909")
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                                                  
                                        message.channel.send({embeds: [embed1]})
                                        return;
                                    }
        
                                    if(isNaN(answer1.content)){
                                        const embed1 = new Discord.MessageEmbed()
                                        .setTitle('Incorrect answer :x:')
                                        .setColor("#ed0909")
                                        .setDescription(`Please reply with a number.`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
            
                                        message.channel.send({embeds: [embed1]})
            
                                        const answer2 = await awaitMessage(filter, message.channel).catch(err => {return;});
    
                                        if(answer2.content.toUpperCase() == "CANCEL"){
                                            const embed1 = new Discord.MessageEmbed()
                                            .setTitle('Cancelled :x:')
                                            .setColor("#ed0909")
                                            .setFooter(Index.footer)
                                            .setTimestamp();
                                                      
                                            message.channel.send({embeds: [embed1]})
                                            return;
                                        }
            
                                        handler.updateRobloxRole(robloxroles1[i].id, parseInt(answer2.content));
        
                                        const txt1 = new Discord.MessageEmbed()
                                        .setTitle("Rank id update")
                                        .setColor("#56d402")
                                        .setDescription(`Role <@&${robloxroles1[i].id}>\nRank Id: ${answer2.content}`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [txt1]})
                                    }else{
                                        handler.updateRobloxRole(robloxroles1[i].id, parseInt(answer1.content));
        
                                        const txt1 = new Discord.MessageEmbed()
                                        .setTitle("Rank id update")
                                        .setColor("#56d402")
                                        .setDescription(`Role <@&${robloxroles1[i].id}>\nRank Id: ${answer1.content}`)
                                        .setFooter(Index.footer)
                                        .setTimestamp();
                        
                                        message.channel.send({embeds: [txt1]})
                                    }
                                }
                            }
                        }
                    }else {
                        handler.updateConfig(question.key, answer.content);
            
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle(question.reply + answer.content)
                        .setColor("#56d402")
                        .setDescription(``)
                        .setFooter(Index.footer)
                        .setTimestamp();
            
                        message.channel.send({embeds: [embed1]})
                    }
                }
            }

            handler.setConfigured(1);

            const end = new Discord.MessageEmbed()
            .setTitle("Thank you for using this bot!")
            .setColor("#ede90e")
            .setDescription(`The setup process is now finished and you can now start using the bot. Any settings changed during this process can modified using the **${await handler.getPrefix()}change** command. For events, you will be able to add 1 or 2 points per log and you can add custom event types which will give different amounts of points. If you encounter any bugs, please contact Colonel Henryhre. `)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [end]})

        }
    }
}

async function awaitMessage(filter, channel){
    return new Promise(async (resolve, reject) =>{
        await channel.awaitMessages({filter, max: 1, time: 600000, errors: ['time']})
        .then(collected =>{
            return resolve(collected.first());
        })
        .catch(collected =>{
            return resolve({
                content: "cancel"
            });
        })
    })
}