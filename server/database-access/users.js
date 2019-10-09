const dataBinding = require("../data-binding");
const { query, multiInsertQuery } = require("./access");
const domain = require("../domain");



// class User
// {
//     constructor(id, username, hash, admin, regkey)
//     {
//         this.id = id; 
//         this.username = username; 
//         this.hash = hash;
//         this.admin = admin;
//         this.regkey = regkey;

//     }
// }


//Returns a domain user object with all its info
function getUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    
}
//User will look be a domain user object 
function insertUser(user, callback, errorCallback, noConnectionCallback) {
    
    
}

//Completely remove user
function deleteUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    
}

//all this needs to do is change the isAdmin field to true 
function promoteUserByUsername(username, callback, errorCallback, noConnectionCallback) {
    
    
}

//all this needs to do is change the isAdmin field to false
function demoteUserByUsername(username, callback, errorCallback, noConnectionCallback) {
        
}

//check if given username is in use
function checkUsernameInUse(username, callback, errorCallback, noConnectionCallback) {
        
}

//Might go in a different file?
//get all users by returning an array of user domain objects
function getAllUsers(callback, errorCallback, noConnectionCallback) {
    
}



module.exports = {
    getUserByUsername,
    insertUser,
    deleteUserByUsername,
    promoteUserByUsername,
    demoteUserByUsername,
    checkUsernameInUse,
    getAllUsers
}