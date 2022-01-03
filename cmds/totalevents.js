const Discord = require('discord.js')
const Index = require("../index")
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

module.exports = {
    name: "totalevents",
    async execute(message, args, handler){
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

        if(args.length >= 1){
            const attendance = await handler.getTotalEventsAttended();
            const hosts = await handler.getTotalEventsHosted();
            const patrols = await handler.getTotalPatrols();
            const width = 400; //px
            const height = 400;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

            var newargs = message.content.split(" ").splice(1);
            var string = "";
            for(var i=0; i< newargs.length;i++){
                string = string + newargs[i];
            }
            string = string.replace(/(\r\n|\n|\r)/gm, "");
            string = string.replace(/\s+/g, '');
            string = string.replace(" ", "");

            var commaargs = string.split(",");

            

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

            for(var i =0; i < commaargs.length; i++){
                if(commaargs[i].toUpperCase() == "ACTIVITY" || commaargs[i].toUpperCase() == "ATTENDANCE"){
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
                    labels.push("Patrols (" + patrols + ")");
                    datas.push(patrols);
                    backgroundColors.push("rgba(252, 197, 112, 0.2)")
                    borderColors.push("rgba(252, 197, 112, 1)")
                }
            }

            

            

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
                                barThickness: 85,
                                maxBarThickness: 85
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



            
        }else if(args.length == 0){
            const attendance = await handler.getTotalEventsAttended();
            const hosts = await handler.getTotalEventsHosted();
            const patrols = await handler.getTotalPatrols();


            const width = 400; //px
            const height = 400;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });


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
            const embed = new Discord.MessageEmbed()
              .setTitle('Incorrect usage :warning:')
              .setColor("#ed0909")
              .setDescription(`>>> ${prefix}totalevents (<activity, hosts, patrols>) `)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return; 
        }
    }
}
