const mongoose = require('mongoose')

const User = require('./models/user')

mongoose.connect(
  'mongodb://localhost/rundb',
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
          },
          {
            username: 'Theo2',
            email: 'theorlbooth2@googlemail.com',
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
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        mongoose.connection.close()
      })
  }
)