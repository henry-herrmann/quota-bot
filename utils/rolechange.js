const RbxManager = require('./RbxManager');
const DivisionHandler = require("../db/DivisionHandler")

async function roleChanged(oldMember, newMember, handler, client, rbx){
    const autorank = parseInt((await handler.getConfig("Auto-Rank")).Value);
    if(autorank == 0) return;

    if (oldMember.roles.cache.size < newMember.roles.cache.size){

        const logs = await newMember.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_ROLE_UPDATE' });
        const log = logs.entries.first();
        if(!log) return;
        if(!log.targetType == "USER") return;
        if(!log.target.id == newMember.id) return;


        if (Date.now() - log.createdTimestamp < 5000) {

            var role = log.changes[0].new;

            const isstaff = await handler.isStaffRole(role[0].id);
            const iscompany = await handler.isCompanyRole(role[0].id);
            const istrooper = await handler.isTrooperRole(role[0].id);

            if(isstaff != undefined){
                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                    if(executor != null && executor != undefined){
                        const experm = await handler.getPermissionLevel(executor);
                        if(experm > 2){
                            client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{

                                handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                    if(bool){
                                        var id = await handler.getRobloxId(member.id);
                                        var rank = await RbxManager.getRankInGroup(rbx, handler, id);

                                        if(isstaff.rankid > rank){
                                            handler.setStaff(member.id, "yes")
                                            if(RbxManager.setRank(rbx, handler, id, isstaff.rankid) != false){
            
                                            }
                                        }
                                    }else{
                                        var robloxid;

                                        try{
                                            robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                        }catch(error){
                                            console.log(error)
                                            return;
                                        }

                                        var rank = await RbxManager.getRankInGroup(rbx, handler, robloxid);

                                        if(isstaff.rankid > rank){
                                            if(RbxManager.setRank(rbx, handler, robloxid, isstaff.rankid) != false){
        
                                            }
                                        }
                                        return;
                                    }
                                })
                            })
                        }else{
                            client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(member =>{
                                handler.isOnSpreadsheet(member.id).then((bool) =>{
                                    if(bool){
                                        handler.setStaff(member.id, "yes")
                                    }else{
                                        return;
                                    }
                                })
                            })
                            
                        }
                    }
                })
            }else if(iscompany != undefined){
                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                    if(executor != null && executor != undefined){
                        const experm = await handler.getPermissionLevel(executor);
                        if(experm > 2){
                            client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{

                                const mperm = await handler.getPermissionLevel(member);
        
                                if(mperm < 1){
                                    handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                        if(bool){
                                            var id = await handler.getRobloxId(member.id);
                                            if(RbxManager.setRank(rbx, handler, id, iscompany.rankid) != false){
                                            }
                                        }else{
                                            var robloxid;
    
                                            try{
                                                robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                            }catch(error){
                                                console.log(error)
                                                return;
                                            }
    
                                            if(RbxManager.setRank(rbx, handler, robloxid, iscompany.rankid) != false){
                                            }
                                            return;
                                        }
                                    })
                                }
                            })
                        }
                    }
                })

                
            }else if(istrooper != undefined){
                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                    if(executor != null && executor != undefined){
                        const experm = await handler.getPermissionLevel(executor);
                        if(experm > 2){
                            client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{
                                const mperm = await handler.getPermissionLevel(member);
        
                                if(mperm < 1){
                                    handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                        if(bool){
                                            var id = await handler.getRobloxId(member.id);

                                            if(RbxManager.setRank(rbx, handler, id, istrooper.rankid) != false){
                                            }
                                        }else{
                                            var robloxid;
    
                                            try{
                                                robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                            }catch(error){
                                                console.log(error)
                                                return;
                                            }
    
                                            if(RbxManager.setRank(rbx, handler, robloxid, istrooper.rankid) != false){
                                            }
                                            return;
                                        }
                                    })
                                }
                            })
                            
    
                        }
                    }
                })
            }
        }

    }else if(oldMember.roles.cache.size > newMember.roles.cache.size){
        const logs = await newMember.guild.fetchAuditLogs({ limit: 1, type: 'MEMBER_ROLE_UPDATE' });
        const log = logs.entries.first();
        if(!log) return;
        if(!log.targetType == "USER") return;
        if(!log.target.id == newMember.id) return;

        if (Date.now() - log.createdTimestamp < 5000){
            var temp = log.changes[0]
            if(temp.key == "$remove"){
                var role = temp.new;

                const isstaff = await handler.isStaffRole(role[0].id);
                const iscompany = await handler.isCompanyRole(role[0].id);
                const istrooper = await handler.isTrooperRole(role[0].id);
    
                const companyroles = await handler.getCompanyRoles();
                const trooperrole = await handler.getTrooperRole();
                const enlistrole = await handler.getEnlistRole();

                if(isstaff != undefined){
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                        if(executor != null && executor != undefined){
                            const experm = await handler.getPermissionLevel(executor);
                            if(experm > 2){
                                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{
        
                                    const higheststaffrank = await handler.getHighestStaffRankId(member);

                                    handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                        if(bool){
                                            var id = await handler.getRobloxId(member.id);

                                            if(higheststaffrank != 0){
                                                if(RbxManager.setRank(rbx, handler, id, higheststaffrank) != false){
                                                }

                                                return;
                                            }

                                            handler.setStaff(member.id, "no")

                                            var isincompany;
                                            for(const company of companyroles){
                                                if(member.roles.cache.some(r => r.id == company.id)){
                                                    isincompany = company;
                                                }
                                            }

                                            if(isincompany != undefined){
                                                if(RbxManager.setRank(rbx, handler, id, isincompany.rankid) != false){
                                                }
                                            }else{
                                                if(member.roles.cache.some(r => r.id == trooperrole[0].id)){
                                                    if(RbxManager.setRank(rbx, handler, id, trooperrole[0].rankid) != false){
        
                                                    }
                                                }else{
                                                    if(RbxManager.setRank(rbx, handler, id, enlistrole[0].rankid) != false){
        
                                                    }
                                                }
                                            }
                                        }else{
                                            var robloxid;
    
                                            try{
                                                robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                            }catch(error){
                                                console.log(error)
                                                return;
                                            }

                                            if(higheststaffrank != 0){
                                                if(RbxManager.setRank(rbx, handler, robloxid, higheststaffrank) != false){
                                                }
                                                
                                                return;
                                            }

                                            var isincompany;
                                            for(const company of companyroles){
                                                if(member.roles.cache.some(r => r.id == company.id)){
                                                    isincompany = company;
                                                }
                                            }

                                            if(isincompany != undefined){
                                                if(RbxManager.setRank(rbx, handler, robloxid, isincompany.rankid) != false){
        
                                                }
                                            }else{
                                                if(member.roles.cache.some(r => r.id == trooperrole[0].id)){
                                                    if(RbxManager.setRank(rbx, handler, robloxid, trooperrole[0].rankid) != false){
        
                                                    }
                                                }else{
                                                    if(RbxManager.setRank(rbx, handler, robloxid, enlistrole[0].rankid) != false){
        
                                                    }
                                                }
                                            }
                                            return;
                                        }
                                    })
                                })
                            }else{
                                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(member =>{
        
                                    handler.isOnSpreadsheet(member.id).then((bool) =>{
                                        if(bool){
                                            handler.setStaff(member.id, "no")
                                        }else{
                                            return;
                                        }
                                    })
                                })
                            }
                        }
                    })

                    

                }else if(iscompany != undefined){
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                        if(executor != null && executor != undefined){
                            const experm = await handler.getPermissionLevel(executor);
                            if(experm > 2){
                                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{
                                    
                                    const mperm = await handler.getPermissionLevel(member);

                                    if(mperm < 1){
                                        var isincompany;
                                        for(const company of companyroles){
                                            if(member.roles.cache.some(r => r.id == company.id)){
                                                isincompany = company;
                                            }
                                        }

                                        if(isincompany == undefined){
                                            handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                                if(bool){
                                                    var id = await handler.getRobloxId(member.id);

                                                    if(!member.roles.cache.some(r => r.id == trooperrole[0].id)){
                                                        if(RbxManager.setRank(rbx, handler, id, enlistrole[0].rankid) != false){
                    
                                                        }
                                                    }else{
                                                        if(RbxManager.setRank(rbx, handler, id, trooperrole[0].rankid) != false){
                    
                                                        }
                                                    }
                                                }else{
                                                    var robloxid;
    
                                                    try{
                                                        robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                                    }catch(error){
                                                        console.log(error)
                                                        return;
                                                    }

                                                    if(!member.roles.cache.some(r => r.id == trooperrole[0].id)){
                                                        if(RbxManager.setRank(rbx, handler, robloxid, enlistrole[0].rankid) != false){
                    
                                                        }
                                                    }else{
                                                        if(RbxManager.setRank(rbx, handler, robloxid, trooperrole[0].rankid) != false){
                    
                                                        }
                                                    }
                                                }
                                            })      
                                        }
                                        
                                    }
                                })
                            }
                        }
                    })
                }else if(istrooper != undefined){
                    client.guilds.cache.get(handler.getGuildID()).members.fetch(log.executor).then(async executor =>{
                        if(executor != null && executor != undefined){
                            const experm = await handler.getPermissionLevel(executor);
                            if(experm > 2){
                                client.guilds.cache.get(handler.getGuildID()).members.fetch(log.target).then(async member =>{
                                    
                                    const mperm = await handler.getPermissionLevel(member);
                                    if(mperm < 1){
                                        var isincompany;
                                        for(const company of companyroles){
                                            if(member.roles.cache.some(r => r.id == company.id)){
                                                isincompany = company;
                                            }
                                        }

                                        if(isincompany == undefined){
                                            handler.isOnSpreadsheet(member.id).then(async (bool) =>{
                                                if(bool){
                                                    const id = await handler.getRobloxId(member.id);

                                                    if(RbxManager.setRank(rbx, handler, id, enlistrole[0].rankid) != false){
            
                                                    }
                                                }else{
                                                    var robloxid;
    
                                                    try{
                                                        robloxid = await DivisionHandler.getRobloxId(member.id, handler.getGuildID());
                                                    }catch(error){
                                                        console.log(error)
                                                        return;
                                                    }

                                                    if(RbxManager.setRank(rbx, handler, robloxid, enlistrole[0].rankid) != false){
            
                                                    }
                                                }
                                            })
                                        }     
                                    }
                                }) 
                            }
                        }
                    })
                }
            }
        }



    }
}
module.exports.roleChanged = roleChanged;