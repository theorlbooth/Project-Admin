const Run = require('../models/run')


function getRuns(req, res) {
  Run
    .find()
    .then(runList => {
      runList.sort((a, b) => (a.date > b.date) ? 1 : -1)
      res.send(runList)
    })
    .catch(error => res.send(error))
}

function addRun(req, res) {
  req.body.user = req.currentUser
  console.log(req.body)
  Run
    .create(req.body)
    .then(run => {
      res.send(run)
    })
    .catch(error => res.send(error))
}


module.exports = {
  getRuns,
  addRun
}