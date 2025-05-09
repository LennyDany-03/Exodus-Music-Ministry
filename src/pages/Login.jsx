"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import Nav from "../components/Nav"
import BGLogo from "../assets/BGLogo.png"
import { supabase } from "../lib/supabaseClient"
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react"

const Login = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // Check if email is in admin_access table
        const { data: adminData, error: adminError } = await supabase
          .from("admin_access")
          .select("email")
          .eq("email", data.session.user.email)
          .eq("is_active", true)
          .single()

        if (adminData) {
          // Update last login time
          await supabase
            .from("admin_access")
            .update({ last_login: new Date().toISOString() })
            .eq("email", data.session.user.email)

          navigate("/dashboard")
        } else {
          // Not authorized, sign out and stay on login page
          await supabase.auth.signOut()
          setError("You don't have permission to access the admin area.")
        }
      }
    }
    checkUser()
  }, [navigate])

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Basic validation
    if (!email || !password) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("Attempting login with:", email)

      // First, directly query the admin_access table without RLS
      // This uses the service role to bypass RLS
      const { data: adminData, error: adminError } = await supabase
        .from("admin_access")
        .select("*") // Select all fields to debug
        .eq("email", email)
        .single()

      console.log("Admin data response:", adminData)
      console.log("Admin error:", adminError)

      // If no admin data found or there's an error, authentication fails
      if (adminError || !adminData) {
        console.error("Error fetching admin data or no data found:", adminError)
        throw new Error("Invalid email or password")
      }

      // Check if account is active
      if (!adminData.is_active) {
        throw new Error("Your account has been deactivated")
      }

      // Check if password matches exactly
      console.log("Comparing passwords - DB:", adminData.password, "Entered:", password)
      if (adminData.password !== password) {
        console.error("Password mismatch")
        throw new Error("Invalid email or password")
      }

      console.log("Password matched, proceeding with login")

      // If we get here, the credentials are valid
      // Now we need to either sign in or create a Supabase Auth user

      // Try to sign in with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // If sign in fails, try to create a new auth user
      if (signInError) {
        console.log("Auth sign-in failed, attempting to create auth user:", signInError)

        // Create a new auth user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })

        if (signUpError) {
          console.error("Failed to create auth user:", signUpError)
          // Continue anyway since we've already verified against admin_access
        } else {
          console.log("Created new auth user:", signUpData)
        }
      } else {
        console.log("Auth sign-in successful:", authData)
      }

      // Update last login time
      const { error: updateError } = await supabase
        .from("admin_access")
        .update({ last_login: new Date().toISOString() })
        .eq("email", email)

      if (updateError) {
        console.error("Error updating last login:", updateError)
        // Continue anyway, this is not critical
      }

      // Store user info in localStorage for dashboard welcome
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          email: adminData.email,
          name: adminData.email.split("@")[0], // Extract name from email
          lastLogin: new Date().toISOString(),
        }),
      )

      console.log("Login successful, navigating to dashboard")
      navigate("/dashboard")
    } catch (error) {
      console.error("Error in login process:", error)
      setError(error.message || "Failed to log in")
    } finally {
      setLoading(false)
    }
  }

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: window.location.origin + "/dashboard",
        },
      })

      if (error) {
        throw error
      }

      // Note: No need to navigate here as Supabase will handle the redirect
    } catch (error) {
      console.error("Error logging in with Google:", error)
      setError(error.message || "Failed to log in with Google")
    } finally {
      setGoogleLoading(false)
    }
  }

  // Particle animation for background
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 5,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white overflow-hidden">
      <Nav />

      {/* Animated background particles */}
      <div className="fixed inset-0 z-0 opacity-30">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-yellow-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pt-24 pb-20 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo animation */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
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
              <img
                src={BGLogo || "/placeholder.svg"}
                alt="Exodus Music Ministry"
                className="h-24 w-auto relative z-10"
              />
            </motion.div>
          </motion.div>

          {/* Login card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="bg-indigo-900/50 backdrop-blur-md rounded-2xl p-8 border border-indigo-800 shadow-xl"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold mb-2 text-yellow-400">Admin Login</h1>
              <p className="text-indigo-200">Sign in to access the admin dashboard</p>
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 flex items-start gap-3"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Email/Password Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-indigo-200">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 bg-indigo-950/50 border ${
                      formSubmitted && !email ? "border-red-500" : "border-indigo-700"
                    } rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-colors`}
                    placeholder="your@email.com"
                  />
                </div>
                {formSubmitted && !email && <p className="text-red-400 text-xs mt-1">Email is required</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-indigo-200">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-indigo-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-3 bg-indigo-950/50 border ${
                      formSubmitted && !password ? "border-red-500" : "border-indigo-700"
                    } rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-transparent transition-colors`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-indigo-400 hover:text-yellow-400 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-indigo-400 hover:text-yellow-400 transition-colors" />
                    )}
                  </button>
                </div>
                {formSubmitted && !password && <p className="text-red-400 text-xs mt-1">Password is required</p>}
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 font-semibold rounded-xl py-3 px-6 overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-300/30 to-yellow-400/0 z-0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Button text */}
                {!loading ? (
                  <span className="relative z-10">Sign In</span>
                ) : (
                  <div className="flex items-center justify-center">
                    <motion.div
                      className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                    <span className="ml-3 relative z-10">Signing In...</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-indigo-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-indigo-900/50 text-indigo-300">Or continue with</span>
              </div>
            </div>

            {/* Google login button */}
            <motion.button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="relative w-full bg-white text-gray-800 font-medium rounded-xl py-3 px-6 flex items-center justify-center gap-3 overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Button background animation */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 z-0"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />

              {/* Google icon */}
              {!googleLoading ? (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="relative z-10">Sign in with Google</span>
                </>
              ) : (
                <div className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <span className="ml-3">Connecting...</span>
                </div>
              )}
            </motion.button>

            {/* Admin note */}
            <motion.div
              className="mt-6 text-center text-sm text-indigo-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p>Only authorized administrators can access the dashboard.</p>
            </motion.div>

            {/* Return to home link */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Link to="/" className="text-indigo-300 hover:text-yellow-400 text-sm transition-colors">
                Return to home page
              </Link>
            </motion.div>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
