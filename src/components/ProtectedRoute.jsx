"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        // Check if we have admin info in localStorage as a fallback
        const adminUserString = localStorage.getItem("adminUser")
        const adminUser = adminUserString ? JSON.parse(adminUserString) : null

        if (!session && !adminUser) {
          console.log("No session or admin user found, redirecting to login")
          setIsAuthorized(false)
          setLoading(false)
          return
        }

        // Get the email either from session or localStorage
        const userEmail = session?.user?.email || adminUser?.email

        if (!userEmail) {
          console.log("No user email found, redirecting to login")
          setIsAuthorized(false)
          setLoading(false)
          return
        }

        // Check if email is in the admin_access table and is active
        const { data: adminData, error: adminError } = await supabase
          .from("admin_access")
          .select("*")
          .eq("email", userEmail)
          .eq("is_active", true)
          .single()

        if (adminError) {
          console.error("Error checking admin access:", adminError)
          setIsAuthorized(false)
          // Clear localStorage if there's an error
          localStorage.removeItem("adminUser")
          // Only sign out if we have a session
          if (session) {
            await supabase.auth.signOut()
          }
        } else if (adminData) {
          console.log("User authorized:", userEmail)
          setIsAuthorized(true)

          // Update last_login timestamp
          const { error: updateError } = await supabase
            .from("admin_access")
            .update({ last_login: new Date().toISOString() })
            .eq("email", userEmail)

          if (updateError) {
            console.error("Error updating last_login:", updateError)
          }
        } else {
          console.log("User not authorized:", userEmail)
          setIsAuthorized(false)
          // Clear localStorage
          localStorage.removeItem("adminUser")
          // Only sign out if we have a session
          if (session) {
            await supabase.auth.signOut()
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setIsAuthorized(false)
        localStorage.removeItem("adminUser")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session) {
        // Check if email is authorized in admin_access table
        const userEmail = session.user.email
        const { data: adminData, error: adminError } = await supabase
          .from("admin_access")
          .select("*")
          .eq("email", userEmail)
          .eq("is_active", true)
          .single()

        if (adminData) {
          console.log("User authorized on state change:", userEmail)
          setIsAuthorized(true)

          // Store in localStorage as well
          localStorage.setItem(
            "adminUser",
            JSON.stringify({
              email: adminData.email,
              name: adminData.email.split("@")[0],
              lastLogin: new Date().toISOString(),
            }),
          )
        } else {
          console.log("User not authorized on state change:", userEmail)
          setIsAuthorized(false)
          // Sign out unauthorized users
          localStorage.removeItem("adminUser")
          await supabase.auth.signOut()
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out")
        setIsAuthorized(false)
        localStorage.removeItem("adminUser")
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

  // If not authorized, redirect to login
  if (!isAuthorized) {
    console.log("Not authorized, redirecting to login")
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If we made it here, we're authorized
  console.log("Authorized, rendering protected content")
  return children
}

export default ProtectedRoute
