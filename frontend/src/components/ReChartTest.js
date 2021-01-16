import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment, { now } from 'moment'


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, AreaChart, Area } from 'recharts'

const ReChartTest = () => {

  const [data, updateData] = useState([])
  const token = localStorage.getItem('token')


  useEffect(() => {
    axios.get('/api/runs')
      .then(resp => {
        resp.data.forEach(item => {
          item.date = moment(item.date).format('DD-MMM')
        })
        updateData(resp.data)
      })
  }, [])

  const [formData, updateFormData] = useState({
    distance: '',
    fiveK: ''
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


  function handleSubmit(event) {
    event.preventDefault()

    let now = new Date()
    now = now.setHours(0, 0, 0, 0)
    now = now - 86400000
    const datesBetween = []

    axios.get('/api/runs')
      .then(resp => {
        const data = resp.data
        let lastDate = data[data.length - 1].date
        lastDate = moment(lastDate).unix() * 1000
        if (formData.distance === '' || formData.fiveK === '') {
          updateFormData({ distance: '', fiveK: '' })
          return
        } else if (lastDate < now) {
          while (lastDate < now) {
            datesBetween.push(lastDate + 86400000)
            lastDate += 86400000
          }
          datesBetween.forEach(date => {
            axios.post('/api/runs', { fiveK: '', distance: '', date: date })
          })
        } else if (lastDate > (now + 86400000)) {
          const id = data[data.length - 1]._id

          axios.put(`/api/runs/${id}`, formData)
            .then(resp => {
              resp.data.forEach(item => {
                item.date = moment(item.date).format('DD-MMM')
              })
              updateData(resp.data)
            })
          updateFormData({ distance: '', fiveK: '' })
          return
        }

        axios.post('/api/runs', formData)
          .then(resp => {
            resp.data.forEach(item => {
              item.date = moment(item.date).format('DD-MMM')
            })
            updateData(resp.data)
          })
      })
    updateFormData({ distance: '', fiveK: '' })
  }


  return <>
    <div className="run-page" style={{ display: 'flex', alignItems: 'center' }}>
      <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>
        <LineChart
          width={1000}
          height={500}
          data={data}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" padding={{ left: 20 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line connectNulls type="monotone" dataKey="distance" stroke="#82ca9d" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
        </LineChart>

        <LineChart
          width={1000}
          height={500}
          data={data}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" padding={{ left: 20 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line connectNulls type="linear" dataKey="fiveK" stroke="#8884d8" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
        </LineChart>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Distance:</label>
          <input
            className="input"
            type="text"
            onChange={handleChange}
            value={formData.distance}
            name="distance"
            placeholder="Distance..." />
        </div>
        <div className="field">
          <label>5k Split:</label>
          <input
            className="input"
            type="text"
            onChange={handleChange}
            value={formData.fiveK}
            name="fiveK"
            placeholder="5k Split..." />
        </div>
        <div className="control">
          <button>Submit</button>
        </div>
      </form>
    </div>
  </>
}



export default ReChartTest


