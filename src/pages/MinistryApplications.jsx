"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"

const MinistryApplications = () => {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        const adminUserString = localStorage.getItem("adminUser")
        const adminUser = adminUserString ? JSON.parse(adminUserString) : null

        if (!session && !adminUser) {
          navigate("/login", { replace: true })
          return
        }

        const userEmail = session?.user?.email || adminUser?.email

        if (!userEmail) {
          navigate("/login", { replace: true })
          return
        }

        const { data: adminData } = await supabase
          .from("admin_access")
          .select("*")
          .eq("email", userEmail)
          .eq("is_active", true)
          .single()

        if (!adminData) {
          navigate("/login", { replace: true })
          return
        }

        await fetchApplications()
      } catch (error) {
        console.error("Authentication error:", error)
        navigate("/login", { replace: true })
      }
    }

    checkAuth()
  }, [navigate])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("Fetching applications from ministry_applications table...")
      const { data, error } = await supabase
        .from("ministry_applications")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Fetched applications:", data)
      setApplications(data || [])
    } catch (error) {
      console.error("Error fetching ministry applications:", error)
      setError("Failed to load ministry applications. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleViewApplication = (application) => {
    setSelectedApplication(application)
    setShowModal(true)
  }

  const handleUpdateStatus = async (id, status) => {
    try {
      setLoading(true)

      const { error } = await supabase.from("ministry_applications").update({ status }).eq("id", id)

      if (error) throw error

      // Update the applications list after status change
      setApplications(applications.map((app) => (app.id === id ? { ...app, status } : app)))
      setShowModal(false)
    } catch (error) {
      console.error("Error updating application status:", error)
      setError("Failed to update status. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteApplication = async (id) => {
    try {
      setLoading(true)

      const { error } = await supabase.from("ministry_applications").delete().eq("id", id)

      if (error) throw error

      // Update the applications list after deletion
      setApplications(applications.filter((app) => app.id !== id))
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting application:", error)
      setError("Failed to delete application. Please try again.")
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

  // Filter applications based on status
  const filteredApplications =
    statusFilter === "all" ? applications : applications.filter((app) => app.status === statusFilter)

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
      case "under_review":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
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
                <span className="text-yellow-400">Ministry</span> Applications
              </h1>
              <div className="w-24 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-indigo-200 max-w-2xl">
                Review and manage applications from people wanting to join Exodus Music Ministry.
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
              All Applications
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
              onClick={() => setStatusFilter("under_review")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === "under_review"
                  ? "bg-yellow-400 text-indigo-900"
                  : "bg-indigo-800/50 text-indigo-200 hover:bg-indigo-700/50"
              }`}
            >
              Under Review
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
              <span className="ml-3 text-indigo-200">Loading ministry applications...</span>
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
          {!loading && !error && filteredApplications.length === 0 && (
            <motion.div
              variants={fadeIn}
              className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-8 text-center border border-indigo-800/50"
            >
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="text-xl font-bold mb-2">No Ministry Applications Found</h3>
              <p className="text-indigo-300">
                {statusFilter === "all"
                  ? "When people apply to join your ministry, they will appear here."
                  : `There are no ${statusFilter.replace("_", " ")} applications at the moment.`}
              </p>
              {error && (
                <div className="mt-4 p-4 bg-indigo-800/30 rounded-lg">
                  <p className="text-yellow-300 font-medium">Troubleshooting:</p>
                  <ul className="text-indigo-200 text-sm text-left list-disc pl-5 mt-2">
                    <li>Make sure the 'ministry_applications' table exists in your Supabase database</li>
                    <li>Check that the table has the correct columns and structure</li>
                    <li>Verify that Row Level Security (RLS) policies are properly configured</li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* Applications list */}
          {!loading && !error && filteredApplications.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6"
            >
              {filteredApplications.map((application) => (
                <motion.div
                  key={application.id}
                  variants={fadeIn}
                  className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/50 hover:border-indigo-700 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{application.full_name || "Anonymous"}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status || "pending")}`}
                        >
                          {(application.status || "pending").replace("_", " ").toUpperCase()}
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
                          {application.email || "No email provided"}
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                          Age: {application.age || "N/A"} • {application.gender || "N/A"}
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
                          Applied: {formatDate(application.created_at)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-indigo-300 mb-1">Roles:</p>
                        <div className="flex flex-wrap gap-1">
                          {(application.roles || []).slice(0, 3).map((role, index) => (
                            <span key={index} className="bg-indigo-800/50 px-2 py-1 rounded text-xs text-indigo-200">
                              {role}
                            </span>
                          ))}
                          {(application.roles || []).length > 3 && (
                            <span className="bg-indigo-800/50 px-2 py-1 rounded text-xs text-indigo-200">
                              +{(application.roles || []).length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-indigo-100 line-clamp-2">{application.message || "No message provided"}</p>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewApplication(application)}
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

      {/* Application detail modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-indigo-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Ministry Application Details</h3>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Personal Information</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 space-y-3">
                    <div>
                      <span className="text-sm text-indigo-300">Full Name:</span>
                      <p className="text-white font-medium">{selectedApplication.full_name || "Not provided"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-indigo-300">Age:</span>
                        <p className="text-white">{selectedApplication.age || "Not provided"}</p>
                      </div>
                      <div>
                        <span className="text-sm text-indigo-300">Gender:</span>
                        <p className="text-white">{selectedApplication.gender || "Not provided"}</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-indigo-300">Email:</span>
                      <p className="text-white">{selectedApplication.email || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-indigo-300">Phone:</span>
                      <p className="text-white">{selectedApplication.phone || "Not provided"}</p>
                    </div>
                    {selectedApplication.address && (
                      <div>
                        <span className="text-sm text-indigo-300">Address:</span>
                        <p className="text-white">{selectedApplication.address}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Application Status</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedApplication.status || "pending")}`}
                    >
                      {(selectedApplication.status || "pending").replace("_", " ").toUpperCase()}
                    </span>
                    <p className="text-sm text-indigo-300 mt-2">
                      Applied on: {formatDate(selectedApplication.created_at)}
                    </p>
                  </div>
                </div>

                {/* Roles */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Selected Roles</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800">
                    <div className="flex flex-wrap gap-2">
                      {(selectedApplication.roles || []).map((role, index) => (
                        <span key={index} className="bg-indigo-800/50 px-3 py-1 rounded-lg text-sm text-indigo-200">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience & Details */}
              <div className="space-y-4">
                {/* Experience */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Experience & Skills</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 space-y-3">
                    <div>
                      <span className="text-sm text-indigo-300">Music Experience:</span>
                      <p className="text-white text-sm mt-1">
                        {selectedApplication.music_experience || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-indigo-300">Role Experience:</span>
                      <p className="text-white text-sm mt-1">{selectedApplication.role_experience || "Not provided"}</p>
                    </div>
                    {selectedApplication.instruments && (
                      <div>
                        <span className="text-sm text-indigo-300">Instruments/Skills:</span>
                        <p className="text-white text-sm mt-1">{selectedApplication.instruments}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Church Information */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Church Affiliation</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 space-y-3">
                    <div>
                      <span className="text-sm text-indigo-300">Church Member:</span>
                      <p className="text-white">{selectedApplication.church_member ? "Yes" : "No"}</p>
                    </div>
                    {selectedApplication.church_name && (
                      <div>
                        <span className="text-sm text-indigo-300">Church Name:</span>
                        <p className="text-white">{selectedApplication.church_name}</p>
                      </div>
                    )}
                    {selectedApplication.church_attendance && (
                      <div>
                        <span className="text-sm text-indigo-300">Attendance:</span>
                        <p className="text-white">{selectedApplication.church_attendance}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">Availability</h4>
                  <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 space-y-3">
                    <div>
                      <span className="text-sm text-indigo-300">Weekly Practices:</span>
                      <p className="text-white">
                        {selectedApplication.weekly_practices_available ? "Available" : "Not Available"}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-indigo-300">Available Days:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(selectedApplication.available_days || []).map((day, index) => (
                          <span key={index} className="bg-indigo-800/50 px-2 py-1 rounded text-xs text-indigo-200">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-indigo-300">Travel Available:</span>
                      <p className="text-white">{selectedApplication.travel_available ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">Personal Message</h4>
              <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800">
                <p className="text-white text-sm whitespace-pre-wrap">
                  {selectedApplication.message || "No message provided"}
                </p>
              </div>
            </div>

            {/* Files */}
            {(selectedApplication.video_url || selectedApplication.reference_url) && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Uploaded Files</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedApplication.video_url && (
                    <a
                      href={selectedApplication.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 hover:border-indigo-600 transition-colors flex items-center"
                    >
                      <svg
                        className="w-8 h-8 text-yellow-400 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <div>
                        <p className="text-white font-medium">Video/Audio Sample</p>
                        <p className="text-indigo-300 text-sm">Click to view</p>
                      </div>
                    </a>
                  )}
                  {selectedApplication.reference_url && (
                    <a
                      href={selectedApplication.reference_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800 hover:border-indigo-600 transition-colors flex items-center"
                    >
                      <svg
                        className="w-8 h-8 text-yellow-400 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <div>
                        <p className="text-white font-medium">Reference Letter</p>
                        <p className="text-indigo-300 text-sm">Click to view</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap justify-between gap-2 mt-6 pt-4 border-t border-indigo-800">
              {selectedApplication.status === "pending" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedApplication.id, "under_review")}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg flex items-center transition-colors"
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                    Under Review
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedApplication.id, "approved")}
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
                    Approve
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedApplication.id, "rejected")}
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
                    Reject
                  </motion.button>
                </>
              )}

              {selectedApplication.status === "under_review" && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedApplication.id, "approved")}
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
                    Approve
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdateStatus(selectedApplication.id, "rejected")}
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
                    Reject
                  </motion.button>
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteApplication(selectedApplication.id)}
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
                Delete
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

export default MinistryApplications
