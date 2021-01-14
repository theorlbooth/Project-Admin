const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const mongooseHidden = require('mongoose-hidden')
const uniqueValidator = require('mongoose-unique-validator')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, validate: [ validator.isEmail, 'Invalid email!' ] },
  password: { type: String, required: true },
  isAdmin: { type: Boolean }
})

userSchema.plugin(uniqueValidator)

userSchema.plugin(mongooseHidden({ defaultHidden: { password: true, email: true } }))

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .pre('validate', function checkPassword(next) {
    if (this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Passwords do not match!')
    }
    next()
  })

userSchema.pre('save', function hashPassword(next) {
  this.password - bcrypt.hashSync(this.password, bcrypt.genSaltSync())
  next()
})

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)