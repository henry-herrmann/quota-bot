class DivisionDB {
    /**
     * Constuctor for each divisional database object which contains a set of functions designed to interact with a database for each discord guild.
     * @param {string} divisionname 
     * @param {string} guild_id 
     * @param {boolean} patrols 
     * @param {Pool} con 
     */
    constructor(divisionname, guild_id, patrols, con){
        this.divisionname = divisionname;
        this.con = con;
        this.guild_id = guild_id;
        this.patrols = patrols;
        this.filteredplayers = [];
        this.updatecooldown = [];



        //Create the table for command permission levels for the respective discord guild also referred to as division.
        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.permission(id TEXT, level INT NOT NULL DEFAULT 0)`, (err, result, field) =>{
            if(err) console.log(err);
        })

        //Checks if a certain type of points is enabled and then creates the respective table according to that that boolean variable. 
        if(patrols) {
            con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.quota(Id TEXT, RbxId TEXT, Attend FLOAT NOT NULL DEFAULT 0, Host FLOAT NOT NULL DEFAULT 0, Patrol FLOAT NOT NULL DEFAULT 0, Joined TEXT, Staff TEXT)`, (err, result, field) =>{
                if(err) console.log(err);
            })
        }else{
            con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.quota(Id TEXT, RbxId TEXT, Attend FLOAT NOT NULL DEFAULT 0, Host FLOAT NOT NULL DEFAULT 0, Joined TEXT, Staff TEXT)`, (err, result, field) =>{
                if(err) console.log(err);
            })
        }

        //The function calls below create another three different databases to store roblox rank ids, configurations and inactivity notices. 
        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.inactivity(Id TEXT, StartDate TEXT, EndDate TEXT, Reason TEXT, MessageID TEXT)`, (err, result, field) =>{
            if(err) console.log(err);
        })
        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.config(Name TEXT, Value TEXT)`, (err, result, field) =>{
            if(err) console.log(err);
        })
        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.roles(id TEXT, rankid INT NOT NULL, type TEXT)`, (err, result, field) =>{
            if(err) console.log(err);
        })

        this.loadConfig();
    }

    async loadConfig(){
        if(await this.existsInConfig("Prefix") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Prefix", "."], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Attend-Quota") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Attend-Quota", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Hosting-Quota") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Hosting-Quota", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Staff-Attendance-Quota") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Staff-Attendance-Quota", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Patrol-Quota") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Patrol-Quota", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Staff-Patrol-Quota") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Staff-Patrol-Quota", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Announce-Members") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Announce-Members", "1"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Announce-channel") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Announce-channel", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Personnel-Id") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Personnel-Id", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
        if(await this.existsInConfig("Division-Name") == false){
            this.con.query(`INSERT IGNORE INTO ${this.divisionname}.config (Name, Value) VALUES (?,?)`, ["Division-Name", "0"], (err, result, fields) =>{
                if(err) console.log(err);
            })
        }
    }

    /**
     * 
     * @returns {string} - Assigned name of the division.
     */
    getDivisionName(){
        return this.divisionname;
    }
    
    /**
     * 
     * @returns {boolean} - Guild Id of the division.
     */
    getGuildID(){
        return this.guild_id;
    }

    /**
     * 
     * @returns {boolean} - Whether patrol points are enabled or not.
     */
    supportsPatrols(){
        return this.patrols != false;
    }

    async existsInConfig(name){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.config WHERE Name = ?`, [name], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result.length != 0);
            })
        })
    }

    /**
     * Alters the quota table by adding a column "Patrol" with the type of float after the "Host" column, based on the value of patrols column in the divisions table in the quota database.
     * @returns {Promise} - Returned once the quota table has been modified.
     */
    async addPatrolTable(){
        return new Promise(async (resolve, reject) =>{
            this.con.query(`SELECT patrols FROM quota.divisions WHERE Name = ?`, [this.divisionname], (err, result, fields)=>{

                if(result[0].patrols == 0){
                    this.con.query(`ALTER TABLE ${this.divisionname}.quota ADD COLUMN Patrol INT NOT NULL DEFAULT 0 After Host;`, (err, result, fields) =>{
                        if(err) reject(err);
        
                        this.patrols = true;
                        return resolve();
                    })
                }
            })
        })
    }
    /**
     * Alters the quota table by removing the column "Patrol" after the "Host" column if the value of the column "Patrol" for that division name is 1
     * @returns {Promise} - Returned once the quota table has been modified.
     */
    async removePatrolTable(){
        return new Promise(async (resolve, reject) =>{
            this.con.query(`SELECT patrols FROM quota.divisions WHERE Name = ?`, [this.divisionname], (err, result, fields)=>{

                if(result[0].patrols == 1){
                    this.con.query(`ALTER TABLE ${this.divisionname}.quota DROP COLUMN Patrol`, (err1, result1, fields1) =>{
                        if(err1) reject(err1);
        
                        this.patrols = false;
                        return resolve();
                    })
                }
            })
        })
    }

    /**
     * Inserts/updates entries in the "config" table of the division's database based on whether the entry already exists or not. 
     * @returns {Promise}
     */
    async updateConfig(key, value){
        return new Promise((resolve, reject) =>{

            this.con.query(`SELECT Name FROM ${this.divisionname}.config WHERE Name = ?`, [key], (err, result, fields) =>{
                if(err) reject(err);

                if(result.length == 0){
                    this.con.query(`INSERT INTO ${this.divisionname}.config (Name, Value) VALUES (?, ?)`, [key, value], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }else{
                    this.con.query(`UPDATE ${this.divisionname}.config SET Value = ? WHERE Name = ?`, [value, key], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }
            })
        })
    }

    async getConfig(key){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.config WHERE Name = ?`, [key], (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined) return resolve("");

                return resolve(result[0]);
            })
        })
    }


    async updatePermission(id, level){
        return new Promise((resolve, reject) =>{

            this.con.query(`SELECT id FROM ${this.divisionname}.permission WHERE id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined){
                    this.con.query(`INSERT INTO ${this.divisionname}.permission (id, level) VALUES (?, ?)`, [id, level], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }else{
                    this.con.query(`UPDATE ${this.divisionname}.permission SET level = ? WHERE id = ?`, [level, id], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }
            })
        })
    }

    async isStaffRole(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'staff'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                var staff;

                for(const result of results){
                    if(result.id == id){
                        staff = result;
                    }
                }

                return resolve(staff);
            })
        })
    }

    async isCompanyRole(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'company'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                var company;

                for(const result of results){
                    if(result.id == id){
                        company = result;
                    }
                }

                return resolve(company);
            })
        })
    }

    async getCompanyRoles(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'company'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                return resolve(results);
            })
        })
    }

    async getStaffRoles(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'staff'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                return resolve(results);
            })
        })
    }

    async getTrooperRole(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'trooper'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                return resolve(results);
            })
        })
    }

    async getEnlistRole(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'enlist'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                return resolve(results);
            })
        })
    }

    async isTrooperRole(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'trooper'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                var trooper;

                for(const result of results){
                    if(result.id == id){
                        trooper = result;
                    }
                }

                return resolve(trooper);
            })
        })
    }

    async isEnlistRole(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.roles WHERE type = 'enlist'`, (err, results, fields) =>{
                if(err) reject(err);

                if(results == undefined) return resolve(undefined);

                var enlist;

                for(const result of results){
                    if(result.id == id){
                        enlist = result;
                    }
                }

                return resolve(enlist);
            })
        })
    }

    async setStaff(id, value){
        return new Promise((resolve, reject) =>{
            this.con.query(`UPDATE ${this.divisionname}.quota SET Staff = ? WHERE Id = ?`, [value, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }

    async getMembers(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.quota`, (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined) return resolve([]);

                return resolve(result);
            })
        })
    }

    async getInactivityNotices(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.inactivity`, (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined) return resolve([]);

                return resolve(result);
            })
        })
    }
    /**
     * Gets the sum of all values within the "Attend" column in the quota table of the division's database.
     * @returns {Promise}
     */
    async getTotalEventsAttended(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT SUM(Attend) AS Sum FROM ${this.divisionname}.quota`, (err, result, fields) =>{
                if(err) reject(err);

                if(result == undefined) return resolve(null);

                return resolve(result[0].Sum);
            })
        })
    }

    /**
     * Gets the sum of all values within the "Host" column in the quota table of the division's database.
     * @returns {Promise}
     */
    async getTotalEventsHosted(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT SUM(Host) AS Sum FROM ${this.divisionname}.quota`, (err, result, fields) =>{
                if(err) reject(err);

                if(result == undefined) return resolve(null);

                return resolve(result[0].Sum);
            })
        })
    }

    /**
     * Gets the sum of all values within the "Patrol" column in the quota table of the division's database.
     * @returns {Promise}
     */
    async getTotalPatrols(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT SUM(Patrol) AS Sum FROM ${this.divisionname}.quota`, (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined) return resolve([]);

                return resolve(result[0].Sum);
            })
        })
    }

    async updateRobloxRole(id, rankid, type){
        return new Promise((resolve, reject) =>{

            this.con.query(`SELECT id FROM ${this.divisionname}.roles WHERE id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined){
                    this.con.query(`INSERT INTO ${this.divisionname}.roles (id, rankid, type) VALUES (?, ?, ?)`, [id, rankid, type], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }else{
                    this.con.query(`UPDATE ${this.divisionname}.roles SET rankid = ? WHERE id = ?`, [rankid, id], (err1, result1, fields1) =>{
                        if(err1) reject(err1);

                        return resolve();
                    })
                }
            })
        })
    }

    async clearPermission(){
        return new Promise((resolve, reject) =>{

            this.con.query(`DELETE FROM ${this.divisionname}.permission`,  (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }

    async clearRoles(){
        return new Promise((resolve, reject) =>{

            this.con.query(`DELETE FROM ${this.divisionname}.roles`,  (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }
    async getRobloxRoles(){
        return new Promise((resolve, reject) =>{

            this.con.query(`SELECT * FROM ${this.divisionname}.roles`, (err, result, fields) =>{
                if(err) reject(err);

                if(result[0] == undefined) return resolve([{id: "0", rankid: 0}]);
                return resolve(result);
            })
        })
    }

    async setPatrol(id, value){
        return new Promise((resolve, reject) =>{

            this.con.query(`SELECT id FROM quota.divisions WHERE id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                this.con.query(`UPDATE quota.divisions SET patrols = ? WHERE id = ?`, [value, id], (err1, result1, fields1) =>{
                    if(err1) reject(err1);

                    return resolve();
                })
            })
        })
    }

    /**
     * Checks whether the value of the "configured" column for the division is set to 1 or 0.
     * @returns {Promise} - Resolves if there's an entry for the division and then passes over a boolean.
     */
    async isConfigured(){
        return new Promise((resolve, reject) =>{
            this.con.query("SELECT configured FROM quota.divisions WHERE name = ?", [this.divisionname], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result[0].configured == 1 ? true : false);
            })
        })
    }

    async setConfigured(bool){
        return new Promise((resolve, reject) =>{
            this.con.query("UPDATE quota.divisions SET configured = ? WHERE name = ?", [bool, this.divisionname], (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }

    async getPermissionLevel(member) {
        return new Promise((resolve, reject) =>{
            let perms = [];

            this.con.query(`SELECT * FROM ${this.divisionname}.permission`, (err, result, fields) =>{
                if(err) reject(err);

                for(const role of result){
                    if(member.roles.cache.some(r => r.id == role.id)){
                        perms.push(role.level);
                    }
                }

                if(perms.length == 0){
                    return resolve(0);
                }else{
                    return resolve(Math.max(...perms));
                }
            })
        })
    }

    async getHighestStaffRankId(member) {
        return new Promise((resolve, reject) =>{
            let rankids = [];

            this.con.query(`SELECT * FROM ${this.divisionname}.roles`, (err, result, fields) =>{
                if(err) reject(err);

                for(const role of result){
                    if(member.roles.cache.some(r => r.id == role.id)){
                        rankids.push(role.rankid);
                    }
                }

                if(rankids.length == 0){
                    return resolve(0);
                }else{
                    return resolve(Math.max(...rankids));
                }
            })
        })
    }

    async addMember(id, rbxid, member){
        return new Promise(async (resolve, reject) =>{
            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
            const date = new Date(now.toString())
            
            if(await this.getPermissionLevel(member) < 1){
                if(this.patrols){
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Id, RbxId, Attend, Host, Patrol, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, rbxid, 0, 0, 0, date.toString(), "no"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }else{
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Id, RbxId, Attend, Host, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?)`, [id, rbxid, 0, 0, date.toString(), "no"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }
            }else{
                if(this.patrols){
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Id, RbxId, Attend, Host, Patrol, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?, ?)`, [id, rbxid, 0, 0, 0, date.toString(), "yes"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }else{
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Id, RbxId, Attend, Host, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?)`, [id, rbxid, 0, 0, date.toString(), "yes"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }
            }
        })
    }

    async isOnInactivityNotice(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.inactivity WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result.length != 0);
            })
        })
    }

    async getNotices(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.inactivity`, (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result);
            })
        })
    }

    async removeInactivityNotice(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`DELETE FROM ${this.divisionname}.inactivity WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }

    /**
     * 
     * @param {string} id - The User Id
     * @param {string} startdate - The start date of the inactivity notice as a string.
     * @param {string} enddate 
     * @param {string} reason 
     * @param {string} messageid 
     * @returns {Promise}
     */
    async addInactivityNotice(id, startdate, enddate, reason, messageid){
        return new Promise((resolve, reject) =>{
            this.con.query(`INSERT INTO ${this.divisionname}.inactivity (id, StartDate, EndDate, Reason, MessageID) VALUES (?,?,?,?,?)`, [id, startdate, enddate, reason, messageid], (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }

    async getChannel(name){
        switch(name){
            case "react-logs":
                return (await this.getConfig("React-Logs-Channel")).Value;
                break;
            case "logging":
                return (await this.getConfig("Logging-Channel")).Value;
                break;
            case "rbx-audit-logs":
                return (await this.getConfig("Rbx-Audit-Channel")).Value;
                break;    
            case "nick-appeals":
                return (await this.getConfig("Nick-Appeals-Channel")).Value;
                break;   
            case "inactivity":
                return (await this.getConfig("Inactivity-Channel")).Value;
                break;  
            case "inactivity-appeals":
                return (await this.getConfig("Inactivity-Appeals-Channel")).Value;
                break;    
            case "automata":
                return (await this.getConfig("Automata-Channel")).Value;
                break;   
            case "activity-logs":
                return (await this.getConfig("Activity-Logs-Channel")).Value;
                break;
            case "event-logs":
                return (await this.getConfig("Event-Logs-Channel")).Value;
                break;
            case "patrol-logs":
                return (await this.getConfig("Patrol-Logs-Channel")).Value;
                break; 
            case "filtering":
                return (await this.getConfig("Filtering-Channel")).Value;
                break; 
            default:
                return "0";
        }
    }

    async getMember(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result[0]);
            })
        })
    }

    async getRobloxId(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT RbxId FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(parseInt(result[0].RbxId));
            })
        })
    }

    async updateRobloxId(userid, newrbxid){
        return new Promise((resolve, reject) =>{
            this.con.query(`UPDATE ${this.divisionname}.quota SET RbxId = ? WHERE Id = ?`, [newrbxid, userid], (err, result, fields) =>{
                if(err) reject(err);

                return resolve();
            })
        })
    }
    

    async resetPoints(){
        return new Promise((resolve, reject) =>{
            if(this.patrols){
                this.con.query(`UPDATE ${this.divisionname}.quota SET Attend = 0, Host = 0, Patrol = 0`, (err, result, fields) =>{
                    if(err) reject(err);

                    return resolve();
                })
            }else{
                this.con.query(`UPDATE ${this.divisionname}.quota SET Attend = 0, Host = 0`, (err, result, fields) =>{
                    if(err) reject(err);

                    return resolve();
                })
            }
        })
    }

    /**
     * Deletes the user from the divisional database
     * @param {string} id - Member id 
     * @returns {Promise} - Resolves if user was deleted from both the inactivity and quota table of the division's database
     */
    async removeMember(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`DELETE FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                this.con.query(`DELETE FROM ${this.divisionname}.inactivity WHERE Id = ?`, [id], (err1, result1, fields1) =>{
                    if (err1) reject(err1);
                })
                return resolve();
            })
        })
    }

    async getAttendancePoints(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Attend FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                if(result == undefined) return resolve(0);

                return resolve(result[0].Attend);
            })
        })
    }

    async getHostingPoints(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Host FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                if(result == undefined) return resolve(0);

                return resolve(result[0].Host);
            })
        })
    }

    async getPatrolPoints(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Patrol FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                if(result == undefined) return resolve(0);

                return resolve(result[0].Patrol);
            })
        })
    }

    async getJoinDate(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Joined FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result[0].Joined);
            })
        })
    }

    async isOnSpreadsheet(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT * FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result[0] != undefined);
            })
        })
    }

    async getAttendanceQuota(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Attend-Quota"], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(parseFloat(result[0].Value));
            })
        })
    }

    async getHostingQuota(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Hosting-Quota"], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(parseFloat(result[0].Value));
            })
        })
    }

    async getPatrolQuota(){
        return new Promise((resolve, reject) =>{
            if(this.patrols){
                this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Patrol-Quota"], (err, result, fields) =>{
                    if(err) reject(err);
    
                    return resolve(parseFloat(result[0].Value));
                })
            }else{
                return resolve(0);
            }
        })
    }

    async getStaffPatrolQuota(){
        return new Promise((resolve, reject) =>{
            if(this.patrols){
                this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Staff-Patrol-Quota"], (err, result, fields) =>{
                    if(err) reject(err);
    
                    return resolve(parseFloat(result[0].Value));
                })
            }else{
                return resolve(0);
            }
        })
    }

    async getStaffAttendQuota(){
        return new Promise((resolve, reject) =>{
            if(this.patrols){
                this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Staff-Attendance-Quota"], (err, result, fields) =>{
                    if(err) reject(err);
    
                    return resolve(parseFloat(result[0].Value));
                })
            }else{
                return resolve(0);
            }
        })
    }

    async isStaff(id){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Staff FROM ${this.divisionname}.quota WHERE Id = ?`, [id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(result[0].Staff != 0);
            })
        })
    }

    async getPrefix(){
        return new Promise((resolve, reject) =>{
            this.con.query(`SELECT Value FROM ${this.divisionname}.config WHERE Name = ?`, ["Prefix"], (err, result, fields) =>{
                if(err) reject(err);

                if(result.length == 0) return resolve(".");

                return resolve(result[0].Value);
            })
        })
    }

    async addAttendancePoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getAttendancePoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints+amount);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Attend = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }

    async addHostingPoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getHostingPoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints+amount);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Host = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }

    async addPatrolPoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getPatrolPoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints+amount);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Patrol = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }

    async removeAttendancePoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getAttendancePoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints-amount);

            if(newpoints < 0) return resolve(-1);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Attend = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }

    async removeHostingPoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getHostingPoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints-amount);

            if(newpoints < 0) return resolve(-1);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Host = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }

    async removePatrolPoints(id, amount){
        return new Promise(async (resolve, reject) =>{
            const points = await this.getPatrolPoints(id);

            let intpoints = parseFloat(points);
            let newpoints = parseFloat(intpoints-amount);

            if(newpoints < 0) return resolve(-1);

            this.con.query(`UPDATE ${this.divisionname}.quota SET Patrol = ? WHERE Id = ?`, [newpoints, id], (err, result, fields) =>{
                if(err) reject(err);

                return resolve(newpoints);
            })
        })
    }
}

module.exports = DivisionDB;