const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const runSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  fiveK: { type: Number },
  distance: { type: Number },
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true }
})

runSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Run', runSchema)