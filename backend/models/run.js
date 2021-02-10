const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const moment = require('moment')


const runSchema = new mongoose.Schema({
  date: { type: String },
  distance: { type: Number },
  seconds: { type: Number },
  split: { type: Number },
  time: { type: String },
  unixDate: { type: Number },
  year: { type: Number }
  
  // user: { type: mongoose.Schema.ObjectId, ref: 'User' }
})


runSchema.methods.getDate = function() {
  return moment(this.unixDate * 1000).format('DD-MMM')
}


runSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Run', runSchema)