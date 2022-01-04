module.exports = {
    
    async getRobloxID(rbx, name){
        const id = await rbx.getIdFromUsername(name).catch((err) => {return null;});
        return id;
    },
    async isPending(rbx, handler, id){
        const requests = await rbx.getJoinRequests(parseInt((await handler.getConfig("Roblox-Group-Id")).Value));
        for(user of requests.data){
            if(user.requester.userId == id){
                return user.requester.userId;
            }
        }
        return false;
    },
    async acceptIntotheGroup(rbx, handler, id){
        rbx.handleJoinRequest(parseInt((await handler.getConfig("Roblox-Group-Id"))).Value, id, true)
        .catch((err) =>{
            return false;
        })
    },
    async isInGroup(rbx, handler, id){
        const groups = await rbx.getGroups(id);
        for(g of groups){
            if(g.Id == parseInt((await handler.getConfig("Roblox-Group-Id")).Value)){
                    return true;
            }
        }
        return false;
    },
    async exileUser(rbx, handler, id){
        const isInGroup = await this.isInGroup(rbx, handler, id);

        if(isInGroup != false){
            rbx.exile(parseInt((await handler.getConfig("Roblox-Group-Id")).Value), id)
            .catch((err) =>{
                return false;
            })
        }else {
            return false;
        }
        
    },
    async setRank(rbx, handler, id, rank){
        if(rank == 0) return;
        
        const isInGroup = await this.isInGroup(rbx, handler, id);

        const groupid = (await handler.getConfig("Roblox-Group-Id")).Value;

        if(isInGroup != false){
            rbx.setRank(parseInt(groupid), id, rank).catch((err) =>{
                return false;
            })
        }else{
            return false;
        }
    },
    async getNameFromId(rbx, id){
        const profile = await rbx.getPlayerInfo(id);

        return profile.username;
    },
    async getRankInGroup(rbx, handler, id){
        const isInGroup = await this.isInGroup(rbx, handler, id);

        if(isInGroup){
            const groupid = (await handler.getConfig("Roblox-Group-Id")).Value;

            const rank = await rbx.getRankInGroup(groupid, id);
            return rank;
        }else{
            return false;
        }
    }
}