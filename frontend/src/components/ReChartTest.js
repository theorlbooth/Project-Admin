import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment, { now } from 'moment'


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, AreaChart, Area } from 'recharts'

const ReChartTest = () => {

  const [data, updateData] = useState([])

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
    const name = event.targer.name
    const value = event.target.value

    const data = {
      ...formData,
      [name]: value
    }
    updateFormData(data)
  }

  // console.log(moment(new Date() - 86400000).format())


  function handleSubmit(event) {
    event.preventDefault()

    now = moment(new Date() - 86400000).format()
    const datesBetween = []

    axios.get('/api/runs')
      .then(resp => {
        let lastDate = moment(resp.data[-1].date.format())
        if (lastDate < now) {
          while (lastDate < now) {
            datesBetween.push(lastDate + 86400000)
            lastDate += 86400000
          }
        }

        datesBetween.forEach(date => {
          axios.post('/api/runs', { fiveK: '', distance: '', date: date })
        })

        axios.post('/api/runs', formData)
          .then(resp => {
            updateData(resp.data)
          })
      })
  }


  return <>
    <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>
      <LineChart
        width={1000}
        height={500}
        data={data}
        syncId='anyId'
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" padding={{ left: 20 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line connectNulls type="linear" dataKey="fiveK" stroke="#8884d8" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
      </LineChart>

      <LineChart
        width={1000}
        height={500}
        data={data}
        syncId='anyId'
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" padding={{ left: 20 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line connectNulls type="monotone" dataKey="distance" stroke="#82ca9d" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
      </LineChart>
    </div>
  </>
}



export default ReChartTest


