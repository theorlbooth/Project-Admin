import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment, { now } from 'moment'
import Toggle from 'react-toggle'


import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, AreaChart, Area } from 'recharts'

const ReChartTest = () => {

  const [data, updateData] = useState([])
  const token = localStorage.getItem('token')
  const [chartToggle, updateChartToggle] = useState(false)

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
    console.log(data)
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

        if (formData.distance === '' || formData.split === '') {
          updateFormData({ distance: '', split: '', _id: '' })
          return
        } else if (formData.distance !== '' && formData.split !== '' && formData._id === '') {

          if (lastDate < now) {
            while (lastDate < now) {
              datesBetween.push(lastDate + 86400000)
              lastDate += 86400000
            }
            datesBetween.forEach(date => {
              axios.post('/api/runs', { split: '', distance: '', date: date })
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
            updateFormData({ distance: '', split: '', _id: '' })
            return
          }
        } else if (formData.distance !== '' && formData.split !== '' && formData._id !== '') {
          const id = formData._id

          axios.put(`/api/runs/${id}`, formData)
            .then(resp => {
              resp.data.forEach(item => {
                item.date = moment(item.date).format('DD-MMM')
              })
              updateData(resp.data)
            })
          updateFormData({ distance: '', split: '', _id: '' })
          return
        } 
        
        axios.post('/api/runs', { distance: formData.distance, split: formData.split })
          .then(resp => {
            console.log(resp.data)
            resp.data.forEach(item => {
              item.date = moment(item.date).format('DD-MMM')
            })
            updateData(resp.data)
          })
      })
    updateFormData({ distance: '', split: '' })
  }


  return <>
    <div className="run-page" style={{ display: 'flex', alignItems: 'center' }}>
      {chartToggle === false && <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>
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
          <XAxis dataKey="date" padding={{ left: 20 }} tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="Distance (km)" type="monotone" dataKey="distance" stroke="#82ca9d" />
          <Line connectNulls name="1k Split (min)" type="linear" dataKey="split" stroke="#8884d8" />
        </LineChart>
      </div>}


      {chartToggle === true && <div className="charts" style={{ display: 'flex', flexDirection: 'column' }}>
        <LineChart
          width={1000}
          height={500}
          data={data}
          syncId='anyId'
          margin={{
            top: 5, right: 30, left: 20, bottom: 20
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" padding={{ left: 20 }} tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="Distance (km)" type="monotone" dataKey="distance" stroke="#82ca9d" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
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
          <XAxis dataKey="date" padding={{ left: 20 }} tick={{ fill: 'white' }} />
          <YAxis tick={{ fill: 'white' }} />
          <Tooltip />
          <Legend />
          <Line connectNulls name="1k Split (min)" type="linear" dataKey="split" stroke="#8884d8" label={{ fill: 'red', fontSize: 15, dy: -10 }} />
        </LineChart>
      </div>}
      <div style={{ border: '1px solid white', borderRadius: '5px', padding: '20px', margin: '10px' }}>
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
                })}
              </select>
            </div>
          </div>
          <div className="control" style={{ display: 'flex', justifyContent: 'center' }}>
            <button>Submit</button>
          </div>
        </form>
      </div>
    </div>
  </>
}



export default ReChartTest


