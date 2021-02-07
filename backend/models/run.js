const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const runSchema = new mongoose.Schema({
  unixDate: { type: Number },
  split: { type: Number },
  distance: { type: Number }
  // user: { type: mongoose.Schema.ObjectId, ref: 'User' }
})

runSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Run', runSchema)