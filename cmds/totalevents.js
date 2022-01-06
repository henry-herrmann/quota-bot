const Discord = require('discord.js')
const Index = require("../index")
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = {
    name: "totalevents",
    /**
     * 
     * @param {Message} message 
     * @param {Array} args 
     * @param {DivisionDB} handler 
     * @returns {undefined}
     */
    async execute(message, args, handler){

        //Checks if the guild member does not have a role with at least permission level 4.
        if(await  handler.getPermissionLevel(message.member) < 4){
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

        //Checks if the database of the divsion was already configured, meaning if all tables and config entries have been created.
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

        const supportsPatrols = handler.supportsPatrols();

        //Executes if the command has more than one argument
        if(args.length >= 1){
            const attendance = await handler.getTotalEventsAttended(); //Fetches the sum of all values in the "Attend" column of the quota table in the database for the division.
            const hosts = await handler.getTotalEventsHosted(); //Fetches the sum of all values in the "Host" column of the quota table in the database for the division.
            const patrols = await handler.getTotalPatrols(); // Fetches the sum of all values in the "Patrol" column of the quota table in the database for the division.

            //Defines the width and length of the graph.
            const width = 400; 
            const height = 400;

            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

            //Processes all arguments after the command name.
            var newargs = message.content.split(" ").splice(1); //Divides the message string into an array with space being the separator. Also removes the command name itself.

            var string = newargs.join("");

            //Removes all line breaks, spaces, etc.
            string = string.replace(/(\r\n|\n|\r)/gm, "");
            string = string.replace(/\s+/g, '');
            string = string.replace(" ", "");

            //Splits the string of joined arguments by each comma.
            var commaargs = string.split(",");

            //Checks if the arguments have a comma as separator.
            if(commaargs.length == 0){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`The different types of points have to be separated by a comma.`)
                .setFooter(Index.footer)
                .setTimestamp();
                      
                message.channel.send({embeds: [embed]})
                return;
            }
            
            if(commaargs.length > 3){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`You can state only 3 types of points to be displayed.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }

            var labels = []

            var backgroundColors = [];
            var borderColors = [];

            var datas = [];

            //Adds for all arguments which will later be bars in the graph their respective label, color and data.
            for(var i =0; i < commaargs.length; i++){
                if(commaargs[i].toUpperCase() == "ATTEND" || commaargs[i].toUpperCase() == "ACTIVITY" || commaargs[i].toUpperCase() == "ATTENDANCE"){
                    labels.push("Activity (" + attendance + ")");
                    datas.push(attendance);
                    backgroundColors.push("rgba(230, 126, 34, 0.2)")
                    borderColors.push("rgba(230, 126, 34, 1")
                }else if(commaargs[i].toUpperCase() == "HOSTS" || commaargs[i].toUpperCase() == "HOSTING" || commaargs[i].toUpperCase() == "HOST"){
                    labels.push("Hosts (" + hosts + ")");
                    datas.push(hosts);
                    backgroundColors.push("rgba(171, 169, 243, 0.2)")
                    borderColors.push("rgba(171, 169, 243, 1)")
                }else if(commaargs[i].toUpperCase() == "PATROLS" || commaargs[i].toUpperCase() == "PATROL"){
                    if(!supportsPatrols){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Patrols are disabled for this division. Please use the change command in order to activate patrols.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                              
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                    
                    labels.push("Patrols (" + patrols + ")");
                    datas.push(patrols);
                    backgroundColors.push("rgba(252, 197, 112, 0.2)")
                    borderColors.push("rgba(252, 197, 112, 1)")
                }
            }
            

            //Checks if there's only one argument so that the one bar present can be resized to fit better in the image.
            if(commaargs.length == 1){
                (async ()=> {

                    const config = {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                
                                data: datas,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1,
                                barThickness: 85, //Changes the thickness of the bar
                                maxBarThickness: 85 //Changes the thickness of the bar
                            }]
                        }, 
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true, //Makes it so that the legend of the graph starts at zero.
                                }
                            },
                            legend: {
                               display: true,
                               labels: {
                                   family: "sans-serif"
                               }
                            },
                            plugins: {
                                legend: {
                                    display: false, //disables the legend over the bar chart which would be for the identification of the bars but that isn't necessary due to the label below each bar.
                                }
                            }
                        } 
                    }
    
                    
    
                    var dataURL = await chartJSNodeCanvas.renderToDataURL(config)//Converts the rendered imaged to a data url
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, ""); //Gets the base64 part of the url
    
                    var buffer = new Buffer.from(data, "base64"); //Encodes that part to base64.
                    const attach = new Discord.MessageAttachment(buffer); //Creates a new attachment
    
                    message.channel.send({files: [attach]}) //Sends that attachments containing the bar chart.
                })();
            }else{
                //Same procedure just with resized bars.
                (async ()=> {
                    const config = {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [{
                                
                                data: datas,
                                backgroundColor: backgroundColors,
                                borderColor: borderColors,
                                borderWidth: 1
                            }]
                        }, 
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                }
                            },
                            legend: {
                               display: true,
                               labels: {
                                   family: "sans-serif"
                               }
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        } 
                    }
    
                    
    
                    var dataURL = await chartJSNodeCanvas.renderToDataURL(config)
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    
                    var buffer = new Buffer.from(data, "base64");
                    const attach = new Discord.MessageAttachment(buffer);
    
                    message.channel.send({files: [attach]})
                })();
            }



            
        }else if(args.length == 0){

            //Same as with the supplied args but this time it will display all three columns.
            const attendance = await handler.getTotalEventsAttended();
            const hosts = await handler.getTotalEventsHosted();
            const patrols = await handler.getTotalPatrols();


            const width = 400; //px
            const height = 400;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

            if(supportsPatrols){
                (async ()=> {
                    const config = {
                        type: 'bar',
                        data: {
                            labels: ["Activity (" + attendance + ")", "Hosts (" + hosts + ")" , "Patrols (" + patrols + ")"],
                            datasets: [{
                                
                                data: [attendance, hosts, patrols],
                                backgroundColor: [
                                    'rgba(230, 126, 34, 0.2)',
                                    'rgba(171, 169, 243, 0.2)',
                                    'rgba(252, 197, 112, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(230, 126, 34, 1)',
                                    'rgba(171, 169, 243, 1)',
                                    'rgba(252, 197, 112, 1)'
                                ],
                                borderWidth: 1
                            }]
                        }, 
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                }
                            },
                            legend: {
                               display: false,
                               labels: {
                                   family: "sans-serif"
                               }
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        } 
                    }
    
                    
    
                    var dataURL = await chartJSNodeCanvas.renderToDataURL(config)
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    
                    var buffer = new Buffer.from(data, "base64");
                    const attach = new Discord.MessageAttachment(buffer);
    
                    message.channel.send({files: [attach]})
                })();
            }else{
                (async ()=> {
                    const config = {
                        type: 'bar',
                        data: {
                            labels: ["Activity (" + attendance + ")", "Hosts (" + hosts + ")" ],
                            datasets: [{
                                
                                data: [attendance, hosts, patrols],
                                backgroundColor: [
                                    'rgba(230, 126, 34, 0.2)',
                                    'rgba(171, 169, 243, 0.2)'
                                    
                                ],
                                borderColor: [
                                    'rgba(230, 126, 34, 1)',
                                    'rgba(171, 169, 243, 1)'
                                ],
                                borderWidth: 1
                            }]
                        }, 
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                }
                            },
                            legend: {
                               display: false,
                               labels: {
                                   family: "sans-serif"
                               }
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        } 
                    }
    
                    
    
                    var dataURL = await chartJSNodeCanvas.renderToDataURL(config)
                    var data = dataURL.replace(/^data:image\/\w+;base64,/, "");
    
                    var buffer = new Buffer.from(data, "base64");
                    const attach = new Discord.MessageAttachment(buffer);
    
                    message.channel.send({files: [attach]})
                })();
            }

        }else{
            const embed = new Discord.MessageEmbed()
              .setTitle('Incorrect usage :warning:')
              .setColor("#ed0909")
              .setDescription(`>>> ${prefix}totalevents (<activity, hosts${supportsPatrols ? ", patrols" : ""}>) `)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return; 
        }
    }
}
