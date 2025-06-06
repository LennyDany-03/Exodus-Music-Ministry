"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const location = useLocation()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        setLoading(true)

        // Get current session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          if (isMounted) {
            setIsAuthorized(false)
            setLoading(false)
          }
          return
        }

        // Check if we have admin info in localStorage as a fallback
        const adminUserString = localStorage.getItem("adminUser")
        const adminUser = adminUserString ? JSON.parse(adminUserString) : null

        // If no session and no admin user, redirect to login
        if (!session && !adminUser) {
          console.log("No session or admin user found, redirecting to login")
          if (isMounted) {
            setIsAuthorized(false)
            setLoading(false)
          }
          return
        }

        // Get the email either from session or localStorage
        const userEmail = session?.user?.email || adminUser?.email

        if (!userEmail) {
          console.log("No user email found, redirecting to login")
          if (isMounted) {
            setIsAuthorized(false)
            setLoading(false)
          }
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

          // If it's a "not found" error, the user is not authorized
          if (adminError.code === "PGRST116") {
            console.log("User not found in admin_access table:", userEmail)
            if (isMounted) {
              setIsAuthorized(false)
              localStorage.removeItem("adminUser")
              if (session) {
                await supabase.auth.signOut()
              }
              setLoading(false)
            }
            return
          }

          // For other errors, still deny access but don't sign out
          if (isMounted) {
            setIsAuthorized(false)
            setLoading(false)
          }
          return
        }

        if (adminData) {
          console.log("User authorized:", userEmail)

          if (isMounted) {
            setIsAuthorized(true)

            // Store/update user info in localStorage for consistency
            localStorage.setItem(
              "adminUser",
              JSON.stringify({
                email: adminData.email,
                name: adminData.email.split("@")[0],
                lastLogin: new Date().toISOString(),
              }),
            )
          }

          // Update last_login timestamp (don't await to avoid blocking)
          supabase
            .from("admin_access")
            .update({ last_login: new Date().toISOString() })
            .eq("email", userEmail)
            .then(({ error: updateError }) => {
              if (updateError) {
                console.error("Error updating last_login:", updateError)
              }
            })
        } else {
          console.log("User not authorized:", userEmail)
          if (isMounted) {
            setIsAuthorized(false)
            localStorage.removeItem("adminUser")
            if (session) {
              await supabase.auth.signOut()
            }
            setLoading(false)
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        if (isMounted) {
          setIsAuthorized(false)
          localStorage.removeItem("adminUser")
          setLoading(false)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    // Set up auth state listener for real-time updates
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)

      if (!isMounted) return

      if (event === "SIGNED_IN" && session) {
        const userEmail = session.user.email

        try {
          // Check if email is authorized in admin_access table
          const { data: adminData, error: adminError } = await supabase
            .from("admin_access")
            .select("*")
            .eq("email", userEmail)
            .eq("is_active", true)
            .single()

          if (adminData && isMounted) {
            console.log("User authorized on state change:", userEmail)
            setIsAuthorized(true)
            setLoading(false)

            // Store in localStorage
            localStorage.setItem(
              "adminUser",
              JSON.stringify({
                email: adminData.email,
                name: adminData.email.split("@")[0],
                lastLogin: new Date().toISOString(),
              }),
            )

            // Update last login
            supabase.from("admin_access").update({ last_login: new Date().toISOString() }).eq("email", userEmail)
          } else if (isMounted) {
            console.log("User not authorized on state change:", userEmail)
            setIsAuthorized(false)
            setLoading(false)
            localStorage.removeItem("adminUser")
            await supabase.auth.signOut()
          }
        } catch (error) {
          console.error("Error in auth state change:", error)
          if (isMounted) {
            setIsAuthorized(false)
            setLoading(false)
          }
        }
      }

      if (event === "SIGNED_OUT") {
        console.log("User signed out")
        if (isMounted) {
          setIsAuthorized(false)
          setLoading(false)
          localStorage.removeItem("adminUser")
        }
      }

      if (event === "TOKEN_REFRESHED") {
        console.log("Token refreshed")
        // Don't change loading state, just log
      }
    })

    // Cleanup function
    return () => {
      isMounted = false
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [location.pathname]) // Add location.pathname to dependencies

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
