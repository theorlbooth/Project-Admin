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
  Run
    .create(req.body)
    .then(run => {
      Run
        .find()
        .then(runList => {
          runList.sort((a, b) => (a.date > b.date) ? 1 : -1)
          res.send(runList)
        })
    })
    .catch(error => res.send(error))
}

function amendRun(req, res) {
  const currentUser = req.currentUser
  const id = req.params.runId
  const body = req.body

  Run
    .findById(id)
    .then(run => {
      if (!run) return res.send({
        message: 'No such run!'
      })
      // if (!run.user.equals(currentUser._id)) {
      //   return res.status(401).send({
      //     message: 'Unauthorized'
      //   })
      // }
      run.set(body)
      console.log(body)
      run.save()
        .then(run => {
          Run
            .find()
            .then(runList => {
              runList.sort((a, b) => (a.date > b.date) ? 1 : -1)
              res.send(runList)
            })
        })
    })
    .catch(error => res.send(error))
}

function deleteRun(req, res) {
  const id = req.params.runId
  Run
    .findById(id)
    .then(run => {
      if (!run) return res.status(404).send({
        message: 'Not found'
      })
      run.deleteOne()
        .then(run => {
          Run
            .find()
            .then(runList => {
              runList.sort((a, b) => (a.date > b.date) ? 1 : -1)
              res.send(runList)
            })
        })
    })
    .catch(error => res.send(error))
}


module.exports = {
  getRuns,
  addRun,
  amendRun,
  deleteRun
}