import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Music from './pages/Music'
import Contact from './pages/Contact'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Donate from './pages/Donate'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element= {<Home />}/>
          <Route path='/about' element= {<About />}/>
          <Route path='/music' element= {<Music />}/>
          <Route path='/contact' element= {<Contact />}/>
          <Route path='/events' element= {<Events />}/>
          <Route path='/gallery' element= {<Gallery />}/>
          <Route path='/events' element= {<Events />}/>
          <Route path='/donate' element= {<Donate />}/>
          <Route path='/fullbio' element= {<Portfolio />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
