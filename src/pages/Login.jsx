"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      setSuccessMessage("Login successful!")
      setTimeout(() => {
        navigate("/events")
      }, 1500)
    } catch (error) {
      console.error("Error logging in:", error)
      setError(error.message || "Failed to log in")
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Login</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-6"></div>
              <p className="text-lg text-indigo-200">Sign in to manage events</p>
            </div>

            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-6 text-center">
                {successMessage}
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-center">
                {error}
              </div>
            )}

            <form
              onSubmit={handleLogin}
              className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-indigo-800"
            >
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="mb-8">
                <label htmlFor="password" className="block text-sm font-medium text-indigo-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  required
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                className={`w-full px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 font-bold rounded-lg flex items-center justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-950"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Login
