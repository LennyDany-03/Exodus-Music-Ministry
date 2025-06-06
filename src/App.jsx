import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Music from "./pages/Music"
import Events from "./pages/Events"
import Gallery from "./pages/Gallery"
import Contact from "./pages/Contact"
import Donate from "./pages/Donate"
import Portfolio from "./pages/Portfolio"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateEvent from "./pages/CreateEvent"
import ImageUploadForm from "./pages/ImageUploadForm"
import JoinOutMinistryForm from "./pages/JoinOutMinistryForm"
import PeopleMessage from "./pages/PeopleMessage"
import HostEvent from "./pages/HostEvent"
import MinistryApplications from "./pages/MinistryApplications"
import PartnerWithUs from "./pages/PartnerWithUs"
import PartnerView from "./pages/PartnerView"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/music" element={<Music />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/join-our-ministry" element={<JoinOutMinistryForm />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
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
                <ImageUploadForm />
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
          <Route
            path="/ministry-applications"
            element={
              <ProtectedRoute>
                <MinistryApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/partner-view"
            element={
              <ProtectedRoute>
                <PartnerView />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
