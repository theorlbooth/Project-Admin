const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')

const getUsers = (req, res) => {
  User
    .find()
    .then(userList => {
      res.send(userList)
      console.log(userList)
    })
}

module.exports = {
  getUsers
}