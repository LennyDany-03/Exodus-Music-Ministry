"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"
import BGLogo from "../assets/BGLogo.png"

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    images: 0,
    events: 0,
    music: 0,
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Check if we have admin info in localStorage as a fallback
        const adminUserString = localStorage.getItem("adminUser")
        const adminUser = adminUserString ? JSON.parse(adminUserString) : null

        if (!session && !adminUser) {
          // No session or admin user, redirect to login
          console.log("No session or admin user found, redirecting to login")
          navigate("/login", { replace: true })
          return
        }

        // Get the email either from session or localStorage
        const userEmail = session?.user?.email || adminUser?.email

        if (!userEmail) {
          console.log("No user email found, redirecting to login")
          navigate("/login", { replace: true })
          return
        }

        // Check if email is authorized in admin_access table
        const { data: adminData, error: adminError } = await supabase
          .from("admin_access")
          .select("*")
          .eq("email", userEmail)
          .eq("is_active", true)
          .single()

        // Not authorized, redirect to home
        if (!adminData) {
          console.log("Unauthorized access attempt:", userEmail)
          localStorage.removeItem("adminUser")
          if (session) {
            await supabase.auth.signOut()
          }
          navigate("/login", { replace: true })
          return
        }

        // User is authorized, set user data
        setUser({
          id: session?.user?.id || adminUser?.id || "admin-user",
          email: userEmail,
          name:
            session?.user?.user_metadata?.full_name ||
            session?.user?.user_metadata?.name ||
            adminUser?.name ||
            userEmail.split("@")[0],
          avatar: session?.user?.user_metadata?.avatar_url || null,
        })

        // Fetch stats
        await fetchStats()
      } catch (error) {
        console.error("Authentication error:", error)
        navigate("/login", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [navigate])

  // Fetch stats from Supabase
  const fetchStats = async () => {
    try {
      // Get count of images
      const { count: imageCount, error: imageError } = await supabase
        .from("images")
        .select("*", { count: "exact", head: true })

      // Get count of events
      const { count: eventCount, error: eventError } = await supabase
        .from("events")
        .select("*", { count: "exact", head: true })

      if (imageError) throw imageError
      if (eventError) throw eventError

      setStats({
        images: imageCount || 0,
        events: eventCount || 0,
        music: 0, // Placeholder for future music feature
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem("adminUser")
      navigate("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Dashboard UI
  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header with welcome message */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* User avatar */}
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="relative">
                <motion.div
                  className="absolute inset-0 bg-yellow-400 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                />
                {user?.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-yellow-400 object-cover relative z-10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-indigo-800 border-4 border-yellow-400 flex items-center justify-center text-3xl font-bold relative z-10">
                    {user?.name.charAt(0)}
                  </div>
                )}
              </motion.div>

              {/* Welcome text */}
              <div className="text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  Welcome, <span className="text-yellow-400">{user?.name.split(" ")[0]}</span>
                </h1>
                <p className="text-indigo-200 text-lg mb-4">Exodus Music Ministry Admin Dashboard</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-indigo-800/50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <span>{stats.images} Images</span>
                  </div>
                  <div className="bg-indigo-800/50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
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
                    <span>{stats.events} Events</span>
                  </div>
                  <div className="bg-indigo-800/50 px-4 py-2 rounded-lg flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      ></path>
                    </svg>
                    <span>{stats.music} Music Tracks</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main dashboard grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Upload Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link to="/image-upload-form" className="block h-full">
                <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col">
                  <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Images</h3>
                  <p className="text-indigo-200 mb-4 flex-grow">
                    Add new photos to the gallery for the community to see.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">{stats.images} Images</span>
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Create Events */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link to="/create-event" className="block h-full">
                <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col">
                  <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-yellow-400"
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
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Events</h3>
                  <p className="text-indigo-200 mb-4 flex-grow">
                    Schedule and publish upcoming ministry events and gatherings.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">{stats.events} Events</span>
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Upload Music (Coming Soon) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">
                  Coming Soon
                </div>
                <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Music</h3>
                <p className="text-indigo-200 mb-4 flex-grow">
                  Share worship songs, performances, and audio recordings.
                </p>
                <div className="flex justify-between items-center opacity-50">
                  <span className="text-yellow-400 font-medium">Feature in Development</span>
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </div>
              </div>
            </motion.div>

            {/* Settings & Future Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-yellow-400 text-indigo-900 text-xs font-bold px-2 py-1 rounded-full">
                  Coming Soon
                </div>
                <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Settings & More</h3>
                <p className="text-indigo-200 mb-4 flex-grow">
                  Configure website settings and access upcoming features.
                </p>
                <div className="flex justify-between items-center opacity-50">
                  <span className="text-yellow-400 font-medium">Feature in Development</span>
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </div>
              </div>
            </motion.div>
            {/* People Messages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link to="/people-message" className="block h-full">
                <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col">
                  <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">People Messages</h3>
                  <p className="text-indigo-200 mb-4 flex-grow">
                    View and manage messages from people who have contacted the ministry.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">Contact Requests</span>
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Host Event Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Link to="/host-event" className="block h-full">
                <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800 shadow-lg h-full flex flex-col">
                  <div className="bg-yellow-400/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Event Requests</h3>
                  <p className="text-indigo-200 mb-4 flex-grow">
                    Manage requests from people who want to host events with the ministry.
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 font-medium">Host Requests</span>
                    <svg
                      className="w-5 h-5 text-yellow-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Recent Activity Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/50"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Actions</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      to="/gallery"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      View Gallery
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/events"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      View Events
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/music"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      View Music
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      Home Page
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/people-message"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      View Messages
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/host-event"
                      className="flex items-center gap-2 text-indigo-200 hover:text-yellow-400 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 6h16M4 10h16M4 14h16M4 18h16"
                        ></path>
                      </svg>
                      View Event Requests
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-yellow-400">Help & Resources</h3>
                <div className="bg-indigo-800/30 rounded-lg p-4">
                  <p className="text-indigo-200 mb-4">Need assistance with the admin dashboard?</p>
                  <div className="flex items-center gap-3">
                    <img src={BGLogo || "/placeholder.svg"} alt="Exodus Music Ministry" className="h-10 w-auto" />
                    <div>
                      <p className="font-medium">Exodus Music Ministry</p>
                      <p className="text-sm text-indigo-300">Admin Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
