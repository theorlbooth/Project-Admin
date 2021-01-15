const mongoose = require('mongoose')
const { dbURI } = require('./config/environment')
require('dotenv').config

const User = require('./models/user')
const Run = require('./models/run')

mongoose.connect(
  dbURI, 
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) return console.log(err)

    console.log('Mongoose connected!')
    mongoose.connection.db.dropDatabase()
      .then(() => {
        return User.create([
          {
            username: 'Theo',
            email: 'theorlbooth@googlemail.com',
            password: 'password',
            passwordConfirmation: 'password',
            isAdmin: true
          }
        ])
      })
      .then(users => {
        console.log(`${users.length} users were created!`)
        return users
      })
      .then(users => {
        return Run.create([
          {
            date: 1609718400000,
            distance: 2.53,
            fiveK: 5.21,
            user: users[0]
          },
          {
            date: 1609804800000,
            distance: '',
            fiveK: '',
            user: users[0]
          },
          {
            date: 1609891200000,
            distance: '',
            fiveK: '',
            user: users[0]
          },
          {
            date: 1609977600000,
            distance: 3.79,
            fiveK: 5.26,
            user: users[0]
          },
          {
            date: 1610064000000,
            distance: '',
            fiveK: '',
            user: users[0]
          },
          {
            date: 1610150400000,
            distance: 5.01,
            fiveK: 5.02,
            user: users[0]
          },
          {
            date: 1610236800000,
            distance: '',
            fiveK: '',
            user: users[0]
          },
          {
            date: 1610323200000,
            distance: 5.02,
            fiveK: 5.11,
            user: users[0]
          },
          {
            date: 1610409600000,
            distance: 5.3,
            fiveK: 5.10,
            user: users[0]
          }
        ])
      })
      .then(run => {
        console.log(`${run.length} runs have been logged!`)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        mongoose.connection.close()
      })
  }
)