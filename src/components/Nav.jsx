"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import BGLogo from "../assets/BGLogo.png"
import { ChevronDown, User, LogOut, Settings, Menu, X } from "lucide-react"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loginMethod, setLoginMethod] = useState(null) // Track login method

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      // Check Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Check localStorage for custom auth
      const adminUserString = localStorage.getItem("adminUser")
      const adminUser = adminUserString ? JSON.parse(adminUserString) : null

      // Check login method from localStorage
      const storedLoginMethod = localStorage.getItem("loginMethod")
      if (storedLoginMethod) {
        setLoginMethod(storedLoginMethod)
      }

      // Set user if either auth method is valid
      if (session?.user) {
        setUser(session.user)
        // If we have a session, it's likely Google login
        if (!storedLoginMethod) {
          setLoginMethod("google")
          localStorage.setItem("loginMethod", "google")
        }
      } else if (adminUser) {
        // Create a user-like object from localStorage data
        setUser({
          email: adminUser.email,
          user_metadata: {
            name: adminUser.name || adminUser.email.split("@")[0],
          },
        })
        // If we only have adminUser but no session, it's likely email login
        if (!storedLoginMethod) {
          setLoginMethod("email")
          localStorage.setItem("loginMethod", "email")
        }
      } else {
        setUser(null)
        setLoginMethod(null)
        localStorage.removeItem("loginMethod")
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user)
        // If signed in with Supabase Auth, it's Google
        setLoginMethod("google")
        localStorage.setItem("loginMethod", "google")
      } else if (event === "SIGNED_OUT") {
        // Check localStorage as fallback when signed out of Supabase
        const adminUserString = localStorage.getItem("adminUser")
        const adminUser = adminUserString ? JSON.parse(adminUserString) : null

        if (adminUser) {
          setUser({
            email: adminUser.email,
            user_metadata: {
              name: adminUser.name || adminUser.email.split("@")[0],
            },
          })
          // Keep existing login method if we still have adminUser
        } else {
          setUser(null)
          setLoginMethod(null)
          localStorage.removeItem("loginMethod")
        }
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  // Handle login
  const handleLogin = () => {
    navigate("/login")
  }

  // Handle logout
  const handleLogout = async () => {
    // Clear localStorage first
    localStorage.removeItem("adminUser")
    localStorage.removeItem("loginMethod")

    // Then sign out from Supabase Auth
    await supabase.auth.signOut()

    // Navigate to home page
    navigate("/")
    setShowUserMenu(false)
    setLoginMethod(null)
  }

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showUserMenu])

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Music", path: "/music" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ]

  // Get dashboard URL based on login method
  const getDashboardUrl = () => {
    console.log("Current login method:", loginMethod)
    return loginMethod === "google" ? "/login" : "/dashboard"
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-indigo-900 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.a href="/" className="flex items-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <img src={BGLogo || "/placeholder.svg"} alt="Exodus Music Ministry" className="h-12 w-auto" />
          </motion.a>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.path}>
                <motion.div
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.path) ? "text-yellow-400" : "text-white hover:text-yellow-400"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400 rounded-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </a>
            ))}
          </div>

          {/* Desktop Actions - Right */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Donate Button */}
            <a href="/donate">
              <motion.button
                className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Donate
              </motion.button>
            </a>

            {/* User Authentication */}
            {user ? (
              <div className="relative user-menu-container">
                <motion.button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-6 h-6 bg-indigo-900 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-yellow-400" />
                  </div>
                  <span className="text-sm font-medium max-w-24 truncate">
                    {user.user_metadata?.name || user.email?.split("@")[0] || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`}
                  />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.user_metadata?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">Login: {loginMethod || "unknown"}</p>
                      </div>

                      <a
                        href={getDashboardUrl()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>

                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 transition-all duration-200"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-semibold">Sign In</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-white hover:bg-indigo-800 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-indigo-800 border-t border-indigo-700"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="space-y-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <a
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                        isActive(link.path)
                          ? "text-yellow-400 bg-indigo-700"
                          : "text-white hover:text-yellow-400 hover:bg-indigo-700"
                      }`}
                    >
                      {link.name}
                    </a>
                  </motion.div>
                ))}

                <div className="pt-4 space-y-3 border-t border-indigo-700">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                  >
                    <a
                      href="/donate"
                      onClick={() => setIsOpen(false)}
                      className="block bg-yellow-400 hover:bg-yellow-500 text-indigo-900 px-4 py-3 rounded-lg text-base font-semibold text-center transition-colors duration-200"
                    >
                      Donate
                    </a>
                  </motion.div>

                  {user ? (
                    <>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 1) * 0.1 }}
                      >
                        <a
                          href={getDashboardUrl()}
                          onClick={() => setIsOpen(false)}
                          className="block bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg text-base font-medium text-center transition-colors duration-200"
                        >
                          Dashboard
                        </a>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + 2) * 0.1 }}
                      >
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg text-base font-medium text-center transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navLinks.length + 1) * 0.1 }}
                    >
                      <button
                        onClick={() => {
                          handleLogin()
                          setIsOpen(false)
                        }}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 px-4 py-3 rounded-lg text-base font-semibold text-center transition-colors duration-200"
                      >
                        Sign In
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavBar
