import React from 'react'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, AreaChart, Area } from 'recharts'

const ReChartTest = () => {

  const data = [
    {
      date: '4-Jan', fiveK: 5.21, distance: 2.53
    },
    {
      date: '5-Jan'
    },
    {
      date: '6-Jan'
    },
    {
      date: '7-Jan', fiveK: 5.26, distance: 3.79
    },
    {
      date: '8-Jan'
    },
    {
      date: '9-Jan', fiveK: 5.02, distance: 5.01
    },
    {
      date: '10-Jan'
    },
    {
      date: '11-Jan', fiveK: 5.11, distance: 5.02
    },
    {
      date: '12-Jan'
    },
    {
      date: '13-Jan'
    },
    {
      date: '14-Jan', fiveK: 5.10, distance: 5.30
    },
    {
      date: '15-Jan'
    }
  ]

  const now = new Date()
  let millisTillTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 47, 0, 0) - now
  if (millisTillTime < 0) {
    millisTillTime += 86400000
  }

  function timeUpdate() {
    console.log('Its Time')
  }
  
  // setTimeout(function(){ alert('Its Time') }, millisTillTime)
  setTimeout(function(){ console.log('Its Time') }, millisTillTime)



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


