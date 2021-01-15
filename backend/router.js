const express = require('express')
const router = express.Router()

const userController = require('./controllers/user')
const runController = require('./controllers/run')
const secureRoute = require('./middleware/secureRoute')

router.route('/users')
  .get(userController.getUsers)
  .post(userController.createUser)

router.route('/login')
  .post(userController.loginUser)

router.route('/users/:userId')
  .get(userController.getUserById)

router.route('/runs')
  .get(runController.getRuns)
  .post(runController.addRun)

module.exports = router