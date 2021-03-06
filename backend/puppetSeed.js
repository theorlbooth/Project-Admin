const mongoose = require('mongoose')
const { dbURI } = require('./config/environment')
require('dotenv').config

const User = require('./models/user')
const Run = require('./models/run')

const puppeteer = require('puppeteer')
const moment = require('moment')
moment.locale('en-GB')

async function findRuns() {

  const objectArray = []

  const browser = await puppeteer.launch({ headless: true, slowMo: 0 })
  const page = await browser.newPage()

  const headlessUserAgent = await page.evaluate(() => navigator.userAgent)
  const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome')
  await page.setUserAgent(chromeUserAgent)
  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.8'
  })

  await page.goto('https://www.strava.com/login')

  await page.click('.btn-accept-cookie-banner')

  await page.type('#email', 'theorlbooth@googlemail.com')
  await page.type('#password', process.env.STRAVA_PASSWORD)

  await Promise.all([
    page.waitForNavigation(),
    page.click('#login-button')
  ])

  await page.goto('https://www.strava.com/athlete/training')

  await page.select('#activity_type', 'Run')

  await page.waitForFunction(() => document.querySelectorAll('#search-results tbody tr').length >= 3)
  await page.waitForTimeout(1000)

  function cleanDistance(distance) {
    const clean = distance.replace(/(\r\n|\n|\r)/gm, '')
    return clean.substring(0, clean.indexOf('<'))
  }

  function cleanDate(date, format) {
    const momentDate = date.split(' ').pop()
    if (format === 'DD-MMM') {
      return moment(momentDate).format('DD-MMM')
    } else if (format === 'YYYY') {
      return moment(momentDate).format('YYYY')
    }
  }

  function unixDate(date) {
    const newDate = date.split(' ').pop()
    const momentDate = new Date(newDate)
    const momentDate2 = moment(momentDate).isDST()

    if (momentDate2) {
      return moment(momentDate).unix() + 3600
    } else {
      return moment(momentDate).unix()
    }
  }

  function cleanTime(time) {
    if (time.length > 5) {
      return moment.duration(time).asSeconds()
    } else {
      return moment.duration(time).asMinutes()
    }
  }

  const cleanedData = []

  for (let i = 0; i < 2; i++) {

    const rows = await page.evaluate(() =>
      Array.from(document.querySelectorAll('tbody > tr')).map(row => [
        row.querySelector('td:nth-child(2)').innerHTML, // * Date
        row.querySelector('td:nth-child(4)').innerHTML, // * Time
        row.querySelector('td:nth-child(5)').innerHTML // * Distance
      ]))

    const requiredRows = []
    for (let i = 0; i < rows.length; i++) {
      if (i % 2 === 0) {
        requiredRows.push(rows[i])
      }
    }

    requiredRows.forEach(row => {
      const newArray = []
      newArray.push(cleanDate(row[0], 'DD-MMM'))
      newArray.push(cleanDistance(row[2]))

      const seconds = cleanTime(row[1])
      newArray.push(seconds)

      const distance = parseFloat(cleanDistance(row[2]))
      const split = (seconds / (distance / 1000))
      newArray.push(moment.utc(split).format('mm.ss'))

      newArray.push(row[1])
      newArray.push(unixDate(row[0]))
      newArray.push(cleanDate(row[0], 'YYYY'))

      cleanedData.push(newArray)
    })

    await page.click('.next_page')

    await page.waitForFunction(() => document.querySelectorAll('#search-results tbody tr').length >= 3)
    await page.waitForTimeout(1000)
  }

  const reversedData = cleanedData.reverse()

  // console.log(reversedData)
  let i = 0
  const newDates = []

  while (i < reversedData.length - 1) {
    let firstNumber = reversedData[i][5] + 86400
    const secondNumber = reversedData[i + 1][5]

    while (firstNumber < secondNumber) {
      const newDate = []

      newDate.push(moment.unix(firstNumber).format('DD-MMM'))
      newDate.push('')
      newDate.push('')
      newDate.push('')
      newDate.push('')
      newDate.push(firstNumber)
      newDate.push(moment.unix(firstNumber).format('YYYY'))
        
      newDates.push(newDate)
      firstNumber += 86400
    }
    i++
  }

  const concat = newDates.concat(reversedData)

  // const sortedArray = concat.sort((a, b) => a[1] - b[1])

  class Run {
    constructor(row) {
      this.date = row[0]
      this.distance = row[1]
      this.seconds = row[2]
      this.split = row[3]
      this.time = row[4]
      this.unixDate = row[5]
      this.year = row[6]
    }
  }

  concat.forEach(row => {
    objectArray.push(new Run(row))
  })

  console.log('done')

  await browser.close()

  // console.log(objectArray)
  return objectArray
}


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
      .then(async (users) => {
        const runs = await findRuns()
        return Run.create(runs)
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