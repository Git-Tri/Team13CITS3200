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
function getUserByID(uid, callback, errorCallback, noConnectionCallback) {
    
    
}
//User will look be a domain user object 
function insertUser(user, callback, errorCallback, noConnectionCallback) {
    
    
}

//Completely remove user
function deleteUserByID(uid, callback, errorCallback, noConnectionCallback) {
    
    
}

//all this needs to do is change the isAdmin field to true 
function promoteUserByID(uid, callback, errorCallback, noConnectionCallback) {
    
    
}

//all this needs to do is change the isAdmin field to false
function demoteUserByID(uid, callback, errorCallback, noConnectionCallback) {
        
}

//check if given username is in use
function checkUsernameInUse(username, callback, errorCallback, noConnectionCallback) {
        
}

module.exports = {
    getUserByID,
    insertUser,
    deleteUserByID,
    promoteUserByID,
    demoteUserByID,
    checkUsernameInUse
}