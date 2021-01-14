import React, { useState } from 'react'
import moment from 'moment'
import iconMapping from './Icons'


function setIcon(props, nextTF, index) {
  if (nextTF[index].dt < props.weatherInfo.current.sunset || nextTF[index].dt > props.weatherInfo.daily[1].sunrise && nextTF[index].dt < props.weatherInfo.daily[1].sunset) {
    return iconMapping[nextTF[index].weather[0].description][0]
  } else if (nextTF[index].dt > props.weatherInfo.current.sunset || nextTF[index].dt > props.weatherInfo.daily[1].sunset) {
    return iconMapping[nextTF[index].weather[0].description][1]
  }
}

const NextTF = (props) => {

  if (props.weatherInfo.hourly === undefined || props.showHideTF === false) {
    return <></>
  } else {

    const nextTF = props.weatherInfo.hourly.slice(0, 25)

    return <>
      {nextTF.map((hour, index) => {
        return <section className="nexttf" key={index} id={index}>
          <h3>{moment.unix(hour.dt).format('h:mm a')}</h3>
          <img src={setIcon(props, nextTF, index)}></img>
          <section className="section-nexttf">
            <p>{Math.round(hour.temp * 10) / 10}°C  ({Math.round(hour.feels_like * 10) / 10}°C)</p>
            <p>WS: {Math.round(hour.wind_speed * 22.3694) / 10} mph</p>
            <p>Humidity: {hour.humidity}%</p>
          </section>
        </section>
      })
      }
    </>
  }
}







export default NextTF
