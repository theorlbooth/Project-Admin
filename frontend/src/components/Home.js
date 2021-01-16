import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import moment from 'moment'
import axios from 'axios'
import bulma from 'bulma'

import CurrentDay from './CurrentDay'
import NextTF from './NextTF'
import FutureDays from './FutureDays'
import SearchInput from './Search'
import LeagueTable from './LeagueTable'


//  51.564937, -0.007365

const Home = () => {
  const [location, updateLocation] = useState('e106nj')
  const [latLong, updateLatLong] = useState([])
  const [weatherInfo, updateWeatherInfo] = useState({})
  const [showHideTF, setShowHideTF] = useState(false)
  const [showHideFD, setShowHideFD] = useState(false)


  useEffect(() => {

    async function fetchData() {
      const { data } = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${location}&key=52535ae64e3048c58091a5065a58f57e`)
      updateLatLong([data.results[0].geometry.lat, data.results[0].geometry.lng])

      const { data: weatherData } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.results[0].geometry.lat}&lon=${data.results[0].geometry.lng}&exclude=minutely,alerts&units=metric&appid=73250291b5074399963b723e7870fafa`)
      updateWeatherInfo(weatherData)
      console.log(weatherData)
    }

    fetchData()
  }, [location])


  return <>
    <header></header>
    <main>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly', height: '846.67px', margin: '30px' }}>
        <div style={{ width: '400px' }}>
          <Link to ="/runs"><button className="run-button" style={{ width: '400px', height: '60px' }}>Run Logs</button></Link>
        </div>
        <div className="weather">
          <SearchInput location={location} updateLocation={updateLocation} />
          <CurrentDay weatherInfo={weatherInfo} />
          <button className="show-hide" id="show-hide-1" onClick={() => {
            setShowHideTF(!showHideTF)
          }}>Next 24 Hours</button>
          <NextTF weatherInfo={weatherInfo} showHideTF={showHideTF} />
          <button className="show-hide" id="show-hide-2" onClick={() => {
            setShowHideFD(!showHideFD)
          }}>Next 7 Days</button>
          <FutureDays weatherInfo={weatherInfo} showHideFD={showHideFD} />
        </div>
      </div>
      <LeagueTable />
    </main>
    <footer></footer>
  </>

}


export default Home
