"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"

const PeopleMessage = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error state

        // Check if the table exists first
        const { data: tableExists, error: tableError } = await supabase
          .from("people_messages")
          .select("id")
          .limit(1)
          .maybeSingle()

        // If there's an error with the first table name, try the alternative
        if (tableError) {
          console.log("Trying alternative table name 'people_message'")
          const { data, error } = await supabase
            .from("people_message")
            .select("*")
            .order("created_at", { ascending: false })

          if (error) throw error

          console.log("Fetched messages:", data)
          setMessages(data || [])
        } else {
          // First table name worked
          const { data, error } = await supabase
            .from("people_messages")
            .select("*")
            .order("created_at", { ascending: false })

          if (error) throw error

          console.log("Fetched messages:", data)
          setMessages(data || [])
        }
      } catch (error) {
        console.error("Error fetching messages:", error)
        setError("Failed to load messages. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const handleViewMessage = (message) => {
    setSelectedMessage(message)
    setShowModal(true)
  }

  const handleDeleteMessage = async (id) => {
    try {
      setLoading(true)

      // Try both table names
      let deleteError = null

      try {
        const { error } = await supabase.from("people_messages").delete().eq("id", id)
        deleteError = error
      } catch (err) {
        deleteError = err
      }

      if (deleteError) {
        console.log("Trying alternative table for deletion")
        const { error } = await supabase.from("people_message").delete().eq("id", id)
        if (error) throw error
      }

      // Update the messages list after deletion
      setMessages(messages.filter((message) => message.id !== id))
      setShowModal(false)
    } catch (error) {
      console.error("Error deleting message:", error)
      setError("Failed to delete message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-yellow-400">People</span> Messages
              </h1>
              <div className="w-24 h-1 bg-yellow-400 mb-6"></div>
              <p className="text-indigo-200 max-w-2xl">
                View and manage messages from people who have reached out through the contact form.
              </p>
            </div>
          </motion.div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-indigo-200">Loading messages...</span>
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
          {!loading && !error && messages.length === 0 && (
            <motion.div
              variants={fadeIn}
              className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-8 text-center border border-indigo-800/50"
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold mb-2">No Messages Yet</h3>
              <p className="text-indigo-300">
                When people contact you through the website, their messages will appear here.
              </p>
            </motion.div>
          )}

          {/* Messages list */}
          {!loading && !error && messages.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={fadeIn}
                  className="bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/50 hover:border-indigo-700 transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{message.name || "Anonymous"}</h3>
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
                          {message.email || "No email provided"}
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
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                      <p className="text-indigo-100 line-clamp-2">{message.message || "No message content"}</p>
                    </div>
                    <div className="flex gap-2 self-end md:self-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewMessage(message)}
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

      {/* Message detail modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-indigo-900 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-white">Message Details</h3>
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
                <h4 className="text-sm font-medium text-indigo-300 mb-1">From</h4>
                <p className="text-lg font-bold text-white">{selectedMessage.name || "Anonymous"}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Email</h4>
                <p className="text-white">{selectedMessage.email || "No email provided"}</p>
              </div>

              {selectedMessage.phone && (
                <div>
                  <h4 className="text-sm font-medium text-indigo-300 mb-1">Phone</h4>
                  <p className="text-white">{selectedMessage.phone}</p>
                </div>
              )}

              {selectedMessage.subject && (
                <div>
                  <h4 className="text-sm font-medium text-indigo-300 mb-1">Subject</h4>
                  <p className="text-white">{selectedMessage.subject}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Received On</h4>
                <p className="text-white">{formatDate(selectedMessage.created_at)}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-indigo-300 mb-1">Message</h4>
                <div className="bg-indigo-950/50 p-4 rounded-lg border border-indigo-800">
                  <p className="text-white whitespace-pre-wrap">{selectedMessage.message || "No message content"}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6 pt-4 border-t border-indigo-800">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteMessage(selectedMessage.id)}
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
                Delete Message
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

export default PeopleMessage
