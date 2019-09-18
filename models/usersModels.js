const connection = require('../db/connection');

exports.fetchUserByUsername = (username) => {
    return connection("users")
            .select("username", "avatar_url", "name")
            .where("username", "=", username)
            .returning('*')
            .then(userArray => {
                if (userArray.length === 0) 
                return Promise.reject({
                    status: 404,
                    msg: 'User not found'
                })
                else return userArray[0];
            })

}

exports.fetchUsers = () => {
    return connection("users")
            .select('*')
            .then(userArray => {
                return userArray
            })
}