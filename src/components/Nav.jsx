"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import BGLogo from "../assets/BGLogo.png"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

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

      // Set user if either auth method is valid
      if (session?.user) {
        setUser(session.user)
      } else if (adminUser) {
        // Create a user-like object from localStorage data
        setUser({
          email: adminUser.email,
          user_metadata: {
            name: adminUser.name || adminUser.email.split("@")[0],
          },
        })
      } else {
        setUser(null)
      }
    }

    checkAuth()

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user)
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
        } else {
          setUser(null)
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

    // Then sign out from Supabase Auth
    await supabase.auth.signOut()

    // Navigate to home page
    navigate("/")
  }

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path))
  }

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Music", path: "/music" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contact" },
  ]

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const menuItemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 },
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-indigo-950/90 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"
      }`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      {/* Animated background gradient - only shows when scrolled */}
      {isScrolled && (
        <motion.div
          className="absolute inset-0 z-0 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950"
            animate={{
              backgroundPosition: ["0% 0%", "100% 0%"],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
            }}
            style={{ backgroundSize: "200% 100%" }}
          />
        </motion.div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
              <img src={BGLogo || "/placeholder.svg"} alt="Exodus Music Ministry" className="h-10 w-auto mr-3" />
              <div className="flex flex-col">
                <motion.span
                  className="text-xl font-bold text-yellow-400"
                  animate={
                    isScrolled
                      ? {}
                      : {
                          textShadow: [
                            "0px 0px 0px rgba(250, 204, 21, 0)",
                            "0px 0px 10px rgba(250, 204, 21, 0.5)",
                            "0px 0px 0px rgba(250, 204, 21, 0)",
                          ],
                        }
                  }
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  EXODUS
                </motion.span>
                <span className="text-sm text-white font-medium">MUSIC MINISTRY</span>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="bg-indigo-900/50 backdrop-blur-sm rounded-full p-1.5 border border-indigo-800">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive(link.path) ? "text-indigo-950 bg-yellow-400" : "text-white hover:text-yellow-400"
                    }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-yellow-400 -z-10"
                        layoutId="activeNav"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </motion.button>
                </Link>
              ))}
            </div>

            {/* Donate Button and Login/Dashboard */}
            <div className="flex items-center gap-3">
              <Link to="/donate">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0px 0px 15px rgba(250, 204, 21, 0.5)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-6 py-2.5 rounded-full text-sm font-bold shadow-md"
                >
                  Donate
                </motion.button>
              </Link>

              {user ? (
                <div className="flex items-center gap-2">
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-indigo-800/50 hover:bg-indigo-700/50 text-white px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogin}
                  className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
                >
                  Login
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2"
              aria-label="Toggle menu"
            >
              <div className="w-6 flex flex-col items-end justify-center gap-1.5">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className={`block h-0.5 ${isOpen ? "w-6" : "w-6"} bg-current transition-all duration-300`}
                ></motion.span>
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block h-0.5 w-4 bg-current transition-all duration-300"
                ></motion.span>
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className={`block h-0.5 ${isOpen ? "w-6" : "w-5"} bg-current transition-all duration-300`}
                ></motion.span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 bg-indigo-950/95 backdrop-blur-md border-t border-indigo-800 shadow-xl"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={menuItemVariants}>
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        isActive(link.path)
                          ? "bg-indigo-800/80 text-yellow-400"
                          : "text-white hover:bg-indigo-900/50 hover:text-yellow-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={menuItemVariants} className="pt-2">
                  <Link
                    to="/donate"
                    onClick={() => setIsOpen(false)}
                    className="block bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-4 py-3 rounded-lg text-base font-bold text-center shadow-md"
                  >
                    Donate
                  </Link>
                </motion.div>

                {user ? (
                  <>
                    <motion.div variants={menuItemVariants} className="pt-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="block bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg text-base font-medium text-center transition-colors"
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={menuItemVariants} className="pt-2">
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full bg-indigo-800/50 hover:bg-indigo-700/50 text-white px-4 py-3 rounded-lg text-base font-medium text-center transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div variants={menuItemVariants} className="pt-2">
                    <button
                      onClick={() => {
                        handleLogin()
                        setIsOpen(false)
                      }}
                      className="w-full bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-3 rounded-lg text-base font-medium text-center transition-colors"
                    >
                      Login
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavBar
