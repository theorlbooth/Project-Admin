const port = process.env.PORT || 8000

const env = process.env.NODE_ENV || 'development'

const dbURI = env === 'production'
  ? process.env.MONGODB_URI
  : `mongodb://localhost/rundb-${env}`

const secret = 'This is our secret to be moved to another folder'


module.exports = {
  secret, port, dbURI
}
