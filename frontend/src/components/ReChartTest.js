import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import moment, { now } from 'moment'
import Toggle from 'react-toggle'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import { secondConverter } from './Functions/TimeConversion'


const ReChartTest = () => {

  const [data, updateData] = useState([])
  const [showData, updateShowData] = useState([])
  const token = localStorage.getItem('token')
  const [chartToggle, updateChartToggle] = useState(false)
  const [totalDistance, updateTotalDistance] = useState(0)
  const [averageSpeed, updateAverageSpeed] = useState(0)
  const [buttonStatus, updateButtonStatus] = useState('2021')


  useEffect(() => {
    axios.get('/api/runs')
      .then(resp => {
        console.log(resp.data)
        updateData(resp.data)
      })
  }, [])

  useEffect(() => {
    let newData = []
    if (buttonStatus === 'All') {
      newData = data
    } else {
      newData = data.filter(run => {
        return run.year === parseInt(buttonStatus)
      })
    }
    updateShowData(newData)

    const distance = newData.reduce(function (acc, obj) {
      return acc + obj.distance
    }, 0)
    updateTotalDistance(Math.round(distance * 100) / 100)

    const totalTime = newData.reduce(function (acc, obj) {
      return acc + obj.seconds
    }, 0)

    const singleTime = totalTime / distance
    const duration = moment.duration(singleTime, 'seconds')
    const averageSpeed = duration.format('m:ss')
    updateAverageSpeed(averageSpeed)

  }, [buttonStatus, data])


  const [formData, updateFormData] = useState({
    distance: '',
    split: '',
    _id: ''
  })

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value

    const data = {
      ...formData,
      [name]: value
    }
    updateFormData(data)
  }

  function cleanTime(time) {
    const newTime = time.replaceAll('.', ':')
    if (newTime.length > 5) {
      return moment.duration(newTime).asSeconds()
    } else {
      return moment.duration(newTime).asMinutes()
    }
  }



  function handleSubmit(event) {
    event.preventDefault()

    let now = new Date()

    now = now.setHours(0, 0, 0, 0) / 1000
    const datesBetween = []

    axios.get('/api/runs')
      .then(resp => {
        const data = resp.data
        let lastDate = data[data.length - 1].unixDate

        if (formData.distance === '' && formData.split === '' && formData._id === '') {
          if (lastDate < now) {
            while (lastDate < now) {
              datesBetween.push(lastDate + 86400)
              lastDate += 86400
            }
            datesBetween.forEach(date => {
              console.log(date)
              axios.post('/api/runs', { date: moment.unix(date).format('DD-MMM'), distance: '', seconds: '', split: '', time: '', unixDate: date, year: moment.unix(date).format('YYYY') })
                .then(resp => {
                  console.log(resp.data)
                  updateData(resp.data)
                })
            })
            updateFormData({ distance: '', split: '', _id: '' })
            return
          } else {
            updateFormData({ distance: '', split: '', _id: '' })
            return
          }
        } else if ((formData.distance === '' && formData._id === '') || (formData.split === '' && formData._id === '')) {
          updateFormData({ distance: '', split: '', _id: '' })
          return
        } else if (formData.distance === '' && formData.split === '' && formData._id !== '') {

          const id = formData._id

          axios.delete(`/api/runs/${id}`)
            .then(resp => {
              console.log(resp.data)
              updateData(resp.data)
            })
          updateFormData({ distance: '', split: '', _id: '' })
          return

        } else if (formData.distance !== '' && formData.split !== '' && formData._id === '') {

          if (lastDate < now - 86400) {
            while (lastDate < now - 86400) {
              datesBetween.push(lastDate + 86400)
              lastDate += 86400
            }
            datesBetween.forEach(date => {
              axios.post('/api/runs', { date: moment.unix(date).format('DD-MMM'), distance: '', seconds: '', split: '', time: '', unixDate: date, year: moment.unix(date).format('YYYY') })
            })
          } else if (lastDate > now) {
            const id = data[data.length - 1]._id

            axios.put(`/api/runs/${id}`, { ...formData, seconds: (cleanTime(formData.split) * formData.distance), time: secondConverter((cleanTime(formData.split) * formData.distance)) })
              .then(resp => {
                console.log(resp.data)
                updateData(resp.data)
              })
            updateFormData({ distance: '', split: '', _id: '' })
            return
          }
        } else if (formData.distance !== '' && formData.split !== '' && formData._id !== '') {
          const id = formData._id

          axios.put(`/api/runs/${id}`, { ...formData, seconds: (cleanTime(formData.split) * formData.distance), time: secondConverter((cleanTime(formData.split) * formData.distance)) })
            .then(resp => {
              console.log(resp.data)
              updateData(resp.data)
            })
          updateFormData({ distance: '', split: '', _id: '' })
          return
        }
        axios.post('/api/runs', { date: moment.unix(now).format('DD-MMM'), distance: formData.distance, seconds: (cleanTime(formData.split) * formData.distance), split: formData.split, time: secondConverter((cleanTime(formData.split) * formData.distance)), unixDate: now, year: moment.unix(now).format('YYYY') })
          .then(resp => {
            console.log(resp.data)
            updateData(resp.data)
          })
      })
    updateFormData({ distance: '', split: '', _id: '' })
  }


  


  return <>

    <div className="run-page" style={{ display: 'flex', alignItems: 'center' }}>

      {chartToggle === false && <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="run-data" style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', margin: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h3>Total Distance:</h3>
            <h3 style={{ fontSize: '34px' }}>{totalDistance} km</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h3>Average Split Speed:</h3>
            <h3 style={{ fontSize: '34px' }}>{averageSpeed} min</h3>
          </div>
        </div>

        <LineChart
          width={1000}
          height={500}
          data={showData}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="Distance (km)" type="monotone" dataKey="distance" stroke="#82ca9d" />
          <Line connectNulls name="1k Split (min)" type="linear" dataKey="split" stroke="#8884d8" />
        </LineChart>
      </div>}


      {chartToggle === true && <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>

        <div className="run-data" style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', margin: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h3>Total Distance:</h3>
            <h3>{totalDistance} km</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h3>Average Split Speed:</h3>
            <h3>{averageSpeed} min</h3>
          </div>
        </div>

        <LineChart
          width={1000}
          height={500}
          data={showData}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="Distance (km)" type="monotone" dataKey="distance" stroke="#82ca9d" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
        </LineChart>

        <LineChart
          width={1000}
          height={500}
          data={showData}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="1k Split (min)" type="linear" dataKey="split" stroke="#8884d8" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
        </LineChart>
      </div>}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ border: '1px solid white', borderRadius: '5px', padding: '20px', margin: '10px' }}>
          
          <div className="buttons" style= {{ display: 'flex', justifyContent: 'space-evenly', margin: '0px' }}>
            <button id='button-1' className='graph-button' value='All' onClick={(event) => updateButtonStatus(event.target.value)}>All</button>
            <button id='button-2' className='graph-button' value='2020' onClick={(event) => updateButtonStatus(event.target.value)}>2020</button>
            <button id='button-3' className='graph-button' value='2021' onClick={(event) => updateButtonStatus(event.target.value)}>2021</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '6%' }}>
            <Toggle
              id='chart-toggle'
              defaultChecked={false}
              onChange={(event) => updateChartToggle(event.target.checked)} />
            <label htmlFor='chart-toggle' style={{ color: 'white', marginLeft: '5%' }}>Split Charts</label>
          </div>
          <form onSubmit={handleSubmit} >
            <div className="field">
              <label style={{ color: 'white' }}>Distance (km):</label>
              <input
                className="input"
                type="text"
                onChange={handleChange}
                value={formData.distance}
                name="distance"
                placeholder="Distance..." />
            </div>
            <div className="field">
              <label style={{ color: 'white' }}>1k Split (min):</label>
              <input
                className="input"
                type="text"
                onChange={handleChange}
                value={formData.split}
                name="split"
                placeholder="1k Split..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '0.75rem' }}>
              <label style={{ color: 'white' }}>Date to amend:</label>
              <div className="select">
                <select style={{ width: '100%' }} name="_id" onChange={handleChange}>
                  <option>{formData._id}</option>
                  {data.map((run, index) => {
                    return <option key={index} value={run._id}>{run.date}</option>
                  }).reverse()}
                </select>
              </div>
            </div>
            <div className="control" style={{ display: 'flex', justifyContent: 'center' }}>
              <button className="submit-button">Submit</button>
            </div>
          </form>
        </div>
        <Link to="/"><button className="run-button" style={{ width: '200px', height: '40px', borderRadius: '5px' }}>Back</button></Link>
      </div>
    </div>
  </>
}



export default ReChartTest


