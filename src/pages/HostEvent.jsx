"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"

const HostEvent = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state

        console.log("Fetching events from host_event table...")
        const { data, error } = await supabase.from("host_event").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        console.log("Fetched events:", data)
        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching event requests:", error)
        setError("Failed to load event requests. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const handleViewEvent = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      setLoading(true)

      const { error } = await supabase.from("host_event").update({ status }).eq("id", id)

      if (error) throw error

      // Update the events list after status change
      setEvents(events.map((event) => (event.id === id ? { ...event, status } : event)))
      setShowModal(false)
    } catch (error) {
      console.error("Error updating event status:", error)
      setError("Failed to update status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    try {
      setLoading(true)

      const { error } = await supabase.from("host_event").delete().eq("id", id)

      if (error) throw error

      // Update the events list after deletion
      setEvents(events.filter((event) => event.id !== id))
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting event request:", error)
      setError("Failed to delete event request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Filter events based on status
  const filteredEvents = statusFilter === "all" ? events : events.filter((event) => event.status === statusFilter)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "approved":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-yellow-400">Event</span> Requests
              </h1>
              <div className="w-24 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-indigo-200 max-w-2xl">
                Manage requests from people who want to host events with Exodus Music Ministry.
              </p>
            </div>
          </motion.div>

          {/* Filter controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex flex-wrap justify-center gap-2"
          >
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-yellow-400 text-indigo-900"
                  : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50"
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-yellow-400 text-indigo-900"
                  : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("approved")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "approved"
                  ? "bg-yellow-400 text-indigo-900"
                  : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter("rejected")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "rejected"
                  ? "bg-yellow-400 text-indigo-900"
                  : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50"
              }`}
            >
              Rejected
            </button>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-indigo-200">Loading event requests...</span>
            </div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              variants={fadeIn}
              className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg text-center mb-8"
            >
              {error}
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-md text-white"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredEvents.length === 0 && (
            <motion.div
              variants={fadeIn}
              className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-8 text-center border border-indigo-800/50"
            >
              <div className="text-5xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-2">No Event Requests Found</h3>
              <p className="text-indigo-300">
                {statusFilter === "all"
                  ? "When people request to host events with your ministry, they will appear here."
                  : `There are no ${statusFilter} event requests at the moment.`}
              </p>
              {error && (
                <div className="mt-4 p-4 bg-indigo-800/30 rounded-lg">
                  <p className="text-yellow-300 font-medium">Troubleshooting:</p>
                  <ul className="text-indigo-200 text-sm text-left list-disc pl-5 mt-2">
                    <li>Make sure the 'host_event' table exists in your Supabase database</li>
                    <li>
                      Check that the table has the correct columns (name, email, event_date, location, details, status,
                      created_at)
                    </li>
                    <li>Verify that Row Level Security (RLS) policies are properly configured</li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Events list */}
          {!loading && !error && filteredEvents.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  variants={fadeIn}
                  className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/50 hover:border-indigo-700 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{event.name || "Anonymous"}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status || "pending")}`}
                        >
                          {(event.status || "pending").toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-indigo-300 mb-3">
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {event.email || "No email provided"}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                          {formatDate(event.event_date || event.created_at)}
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1 text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          {event.location || "No location specified"}
                        </div>
                      </div>

                      <p className="text-indigo-100 line-clamp-2">
                        {event.details || "No additional details provided"}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewEvent(event)}
                        className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-colors"
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Back to dashboard button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors flex items-center mx-auto"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Event detail modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-indigo-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Event Request Details</h3>
              <button onClick={() => setShowModal(false)} className="text-indigo-300 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Requester Name</h4>
                <p className="text-lg font-bold text-white">{selectedEvent.name || "Anonymous"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Email</h4>
                <p className="text-white">{selectedEvent.email || "No email provided"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Event Date</h4>
                <p className="text-white">{formatDate(selectedEvent.event_date) || "No date specified"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Location</h4>
                <p className="text-white">{selectedEvent.location || "No location specified"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Status</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status || "pending")}`}
                >
                  {(selectedEvent.status || "pending").toUpperCase()}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Event Details</h4>
                <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800">
                  <p className="text-white whitespace-pre-wrap">{selectedEvent.details || "No details provided"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Request Received On</h4>
                <p className="text-white">{formatDate(selectedEvent.created_at)}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between gap-2 mt-6 pt-4 border-t border-indigo-800">
              {selectedEvent.status === "pending" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedEvent.id, "approved")}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg flex items-center transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Approve Request
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedEvent.id, "rejected")}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Reject Request
                  </motion.button>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                Delete Request
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default HostEvent
