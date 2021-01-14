import React, { useState, useEffect } from 'react'
import moment from 'moment'
import iconMapping from './Icons'
import Clock from 'react-live-clock'


const CurrentDay = (props) => {

  let src = ''

  if (props.weatherInfo.current === undefined) {
    return <></>
  } else {

    if (props.weatherInfo.current.dt > props.weatherInfo.current.sunset) {
      src = iconMapping[props.weatherInfo.current.weather[0].description][1]
    } else {
      src = iconMapping[props.weatherInfo.current.weather[0].description][0]
    }

    return <>
      <section className="section-1">
        <Clock format={'HH:mm:ss'} ticking={true} timezone={props.weatherInfo.timezone} />
        {/* <h2>{moment.unix(props.weatherInfo.current.dt).format('h:mm a')}</h2> */}
        <h3>{moment.unix(props.weatherInfo.current.dt).format('Do MMMM YYYY')}</h3>
      </section>

      <section className="section-2">
        <article>
          <h2>{props.weatherInfo.timezone}</h2>
          <p>{props.weatherInfo.current.weather[0].description}</p>
        </article>
        <img src={src} alt="weather pic"></img>
      </section>

      <section className="section-3">
        <h2>{Math.round(props.weatherInfo.current.temp * 10) / 10}°C</h2>
        <article>
          <p>Feels Like: {Math.round(props.weatherInfo.current.feels_like * 10) / 10}°C</p>
          <p>Wind Speed: {Math.round(props.weatherInfo.current.wind_speed * 22.3694) / 10} mph</p>
          <p>Humidity: {props.weatherInfo.current.humidity}%</p>
        </article>
      </section>

      <section className="section-4">
        <div>
          <p>Sunrise:</p>
          <p>{moment.unix(props.weatherInfo.current.sunrise).format('h:mm a')}</p>
        </div>
        <div>
          <p>Sunset:</p>
          <p>{moment.unix(props.weatherInfo.current.sunset).format('h:mm a')}</p>
        </div>
      </section>
    </>
  }
}

export default CurrentDay