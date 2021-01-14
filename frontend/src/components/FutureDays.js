import React from 'react'
import moment from 'moment'
import iconMapping from './Icons'


const FutureDays = (props) => {
  if (props.weatherInfo.daily === undefined || props.showHideFD === false) {
    return <></>
  } else {

    return <>
      {props.weatherInfo.daily.map((day, index) => {
        return <section className="futureDays" key={index} id={index}>
          <h3>{moment.unix(day.dt).format('Do MMM')}</h3>
          <img src={iconMapping[day.weather[0].description][0]}></img>
          <section>
            <p>{Math.round(day.temp.min * 10) / 10}°C - {Math.round(day.temp.max * 10) / 10}°C</p>
            <p>{moment.unix(day.sunrise).format('h:mm a')} - {moment.unix(day.sunset).format('h:mm a')}</p>
          </section>
        </section>
      })
      }
    </>
  }
}

export default FutureDays