const dataBinding = require("../data-binding");
const { query, multiInsertQuery } = require("./access");
const domain = require("../domain");





//Returns a domain user object with all its info
function getUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    query("select * from football.user where username = ?",
        [username],(r) => callback(dataBinding.bindUsers(r)),errorCallback,noConnectionCallback)
    
}
//User will look be a domain user object 
function insertUser(user, callback, errorCallback, noConnectionCallback) 
{

    let params = [user.username,user.hash,user.admin,user.regkey,user.token,user.apikey]

    let sqlQuery = "insert into football.user(username,hash,admin,regkey,token,apikey) values(?,?,?,?,?,?)"

    query(sqlQuery,params,callback,errorCallback,noConnectionCallback);  
    
}

//Completely remove user
function deleteUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    
    query("delete from football.user where username = ?",[username],callback,errorCallback,noConnectionCallback);

}

//all this needs to do is change the isAdmin field to true 
function promoteUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    query("update football.user set admin = ? where username = ?",[true,username],callback,errorCallback,noConnectionCallback)

    
}

//all this needs to do is change the isAdmin field to false
function demoteUserByUsername(username, callback, errorCallback, noConnectionCallback) {

    query("update football.user set admin = ? where username = ?",[false,username],callback,errorCallback,noConnectionCallback)
        
}

//check if given username is in use
function checkUsernameInUse(username, callback, errorCallback, noConnectionCallback) {
       
    getUserByUsername(username,(result) => 
    {

        if(result.length > 0)
        {

            callback(true);

        }
        else
        {

            callback(false); 

        }

    },errorCallback,noConnectionCallback)

}

//return user with this token
function getUserByToken(token, callback, errorCallback, noConnectionCallback) {
    
    
    query("select * from football.user where token = ?",
    [token],(r) => callback(dataBinding.bindUsers(r)),errorCallback,noConnectionCallback)

    
}

//return user with this apikey
function getUserByAPIKey(apikey, callback, errorCallback, noConnectionCallback) {
    
    
    query("select * from football.user where apikey = ?",
    [apikey],(r) => callback(dataBinding.bindUsers(r)),errorCallback,noConnectionCallback)

    
}
//replace users token with new token (this can also be null for logging out)
function editTokenByUsername(username, token, callback, errorCallback, noConnectionCallback) {
    
    query("update football.user set token = ? where username = ?",[token,username],callback,errorCallback,noConnectionCallback)

    
    
}

//replace users token with new token (this can also be null for logging out)
function editRegkeyByUsername(username, regkey, callback, errorCallback, noConnectionCallback) {
    
    query("update football.user set regkey = ? where username = ?",[regkey,username],callback,errorCallback,noConnectionCallback)

    
    
}



//set password hash
function editPasswordByUsername(username, password, callback, errorCallback, noConnectionCallback) {
 
        
    query("update football.user set hash = ? where username = ?",[password,username],callback,errorCallback,noConnectionCallback)

    

}


module.exports = {
    getUserByUsername,
    insertUser,
    deleteUserByUsername,
    promoteUserByUsername,
    demoteUserByUsername,
    checkUsernameInUse,
    getUserByToken,
    editTokenByUsername,
    editPasswordByUsername,
    getUserByAPIKey,
    editRegkeyByUsername
    
}