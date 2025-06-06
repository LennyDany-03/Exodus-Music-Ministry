import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Portfolio from "./pages/Portfolio"
import About from "./pages/About"
import Music from "./pages/Music"
import Contact from "./pages/Contact"
import Events from "./pages/Events"
import Gallery from "./pages/Gallery"
import Donate from "./pages/Donate"
import CreateEvent from "./pages/CreateEvent"
import Login from "./pages/Login"
import ImageForm from "./pages/ImageUploadForm"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import PeopleMessage from "./pages/PeopleMessage"
import HostEvent from "./pages/HostEvent"
import JoinOurMinistryForm from './pages/JoinOutMinistryForm'
import MinistryApplications from './pages/MinistryApplications'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/music" element={<Music />} />
          <Route path="/music" element={<Music />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fullbio" element={<Portfolio />} />
          <Route path="/join-ministry" element={<JoinOurMinistryForm />} />
          <Route path="/ministry-applications" element={<MinistryApplications />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/image-upload-form"
            element={
              <ProtectedRoute>
                <ImageForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/people-message"
            element={
              <ProtectedRoute>
                <PeopleMessage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/host-event"
            element={
              <ProtectedRoute>
                <HostEvent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
