import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'


import Home from '../frontend/src/components/Home'
import ReChartTest from '../frontend/src/components/ReChartTest'


const App = () => {
  return <>
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/runs' component={ReChartTest} />
      </Switch>
    </BrowserRouter>
  </>
}


export default App
