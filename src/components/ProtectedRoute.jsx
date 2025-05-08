"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

// List of authorized emails
const authorizedEmails = ["lennydany3@gmail.com", "lennydanygpt@gmail.com"]

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setIsAuthenticated(false)
          setIsAuthorized(false)
          setLoading(false)
          return
        }

        setIsAuthenticated(true)

        // Check if email is in the authorized list
        const userEmail = session.user.email
        if (authorizedEmails.includes(userEmail)) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
          // Sign out unauthorized users
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthenticated(false)
        setIsAuthorized(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true)

        // Check if email is authorized
        const userEmail = session.user.email
        if (authorizedEmails.includes(userEmail)) {
          setIsAuthorized(true)
        } else {
          setIsAuthorized(false)
          // Sign out unauthorized users
          await supabase.auth.signOut()
        }
      }

      if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        setIsAuthorized(false)
      }
    })

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated or not authorized
  if (!isAuthenticated || !isAuthorized) {
    return <Navigate to="/" replace />
  }

  // Render children if authenticated and authorized
  return children
}

export default ProtectedRoute
