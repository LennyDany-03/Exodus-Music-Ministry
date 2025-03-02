import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element= {<Home />}/>
          <Route path='/fullbio' element= {<Portfolio />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
