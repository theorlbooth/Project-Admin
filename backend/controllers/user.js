const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { secret } = require('../config/environment')


function getUsers(req, res) {
  User
    .find()
    .then(userList => {
      res.send(userList)
      console.log(userList)
    })
}

function createUser(req, res) {
  const body = req.body
  body.isAdmin = false

  User
    .create(body)
    .then(user => {
      res.send(user)
    })
    .catch(error => res.send(error))
}


function loginUser(req, res) {
  const username = req.body.username
  User
    .findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.send({ message: 'Incorrect username/password' })
      }
      if (!user.validatePassword(req.body.password)) {
        return res.send({ message: 'Unauthorized login attempt' })
      }
      const token = jwt.sign(
        { sub: user._id },
        secret,
        { expiresIn: '3h' }
      )
      return res.status(202).send({ message: 'Login successful!', token })
    })
    .catch(error => res.send(error))
}

function getUserById(req, res) {
  const _id = req.params.userId
  console.log(req.params)
  User
    .findOne({ _id })
    .then(user => {
      res.send(user)
    })
    .catch(error => res.send(error))
}


module.exports = {
  getUsers,
  createUser,
  loginUser,
  getUserById
}