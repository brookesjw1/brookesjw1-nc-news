const { fetchUserByUsername, fetchUsers } = require('../models/usersModels')

exports.getUserByUsername = (req,res,next) => {
    const {username} = req.params;
    fetchUserByUsername(username)
    .then(user => {
        res.status(200).send({user})
    })
    .catch(next)
}

exports.getUsers = (req,res,next) => {
    fetchUsers()
    .then(users => {
        res.status(200).send({ users })
    })
    .catch(next)
}