"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formError, setFormError] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (formError) setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)

    try {
      // Validate form
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        throw new Error("Please fill in all required fields")
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address")
      }

      // Submit to Supabase
      const { error } = await supabase.from("people_messages").insert([
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          status: "unread",
        },
      ])

      if (error) throw error

      // Show success animation
      setShowSuccess(true)

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })

      // Hide success animation after 4 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 4000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactMethods = [
    {
      title: "Email Us",
      description: "For general inquiries and information",
      contact: "victorsingthegospel@gmail.com",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      action: "Send Email",
      href: "mailto:victorsingthegospel@gmail.com",
    },
    {
      title: "Call Us",
      description: "Speak directly with our ministry team",
      contact: "+91 99444 51426",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      action: "Call Now",
      href: "tel:+919944451426",
    },
    {
      title: "Follow Us",
      description: "Connect with us on social platforms",
      contact: "Facebook, Instagram, YouTube",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3.22l-1.14 1.14a.5.5 0 01-.64.064L8 15H5a2 2 0 01-2-2V5zm5.14 7.814L9.14 11.5H13a.5.5 0 000-1H7a.5.5 0 00-.5.5v4a.5.5 0 00.64.436z"
            clipRule="evenodd"
          />
        </svg>
      ),
      action: "Follow Us",
      href: "https://www.facebook.com/Exoduschoir/?checkpoint_src=any",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950">
      <NavBar />

      {/* Success Animation Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="bg-gradient-to-br from-indigo-800 to-indigo-900 p-8 rounded-3xl shadow-2xl border border-indigo-600 max-w-md w-full relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600"
                  style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)" }}
                />
              </div>

              <div className="text-center relative z-10">
                {/* Animated Check Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <motion.path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </motion.div>

                {/* Success Message */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="text-2xl font-bold text-white mb-3"
                >
                  Message Sent Successfully!
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="text-indigo-200 mb-6 leading-relaxed"
                >
                  Your message has been delivered to our team. We'll get back to you as soon as possible!
                </motion.p>

                {/* Floating Music Notes */}
                {[...Array(8)].map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute text-yellow-400 text-lg pointer-events-none"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                    }}
                    animate={{
                      y: [-10, -40, -10],
                      opacity: [0, 1, 0],
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3,
                      repeat: 1,
                      delay: 1 + Math.random() * 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
                  </motion.div>
                ))}

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  onClick={() => setShowSuccess(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-950 px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg"
                >
                  Continue
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 to-indigo-900/90" />
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400/20 text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -80],
                  opacity: [0, 0.6, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 5,
                  ease: "easeOut",
                }}
              >
                {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              Get In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Touch
              </span>
            </motion.h1>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-indigo-200 leading-relaxed"
            >
              We'd love to hear from you! Whether you have questions about our ministry, want to book us for an event,
              or simply want to connect, we're here for you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Multiple Ways to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Connect
              </span>
            </h2>
            <p className="text-xl text-indigo-300 max-w-2xl mx-auto">Choose the method that works best for you</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-indigo-800/80 to-indigo-900/80 backdrop-blur-sm p-8 rounded-3xl border border-indigo-600/50 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-950 shadow-lg group-hover:shadow-yellow-400/25 transition-all duration-300"
                    >
                      {method.icon}
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-3">{method.title}</h3>
                    <p className="text-indigo-300 mb-4 leading-relaxed">{method.description}</p>
                    <p className="text-white font-semibold mb-6 text-lg">{method.contact}</p>

                    <motion.a
                      href={method.href}
                      target={method.href.startsWith("http") ? "_blank" : undefined}
                      rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-950 px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {method.action}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Send Us a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                Message
              </span>
            </h2>
            <p className="text-xl text-indigo-300 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-indigo-800/60 to-indigo-900/60 backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-indigo-600/50 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {formError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <label htmlFor="name" className="block text-sm font-semibold text-indigo-200 mb-3">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-indigo-900/50 border border-indigo-600/50 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your full name"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <label htmlFor="email" className="block text-sm font-semibold text-indigo-200 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 bg-indigo-900/50 border border-indigo-600/50 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter your email address"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <label htmlFor="subject" className="block text-sm font-semibold text-indigo-200 mb-3">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 bg-indigo-900/50 border border-indigo-600/50 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    placeholder="What is this regarding?"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <label htmlFor="message" className="block text-sm font-semibold text-indigo-200 mb-3">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-indigo-900/50 border border-indigo-600/50 rounded-xl text-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm"
                    placeholder="Tell us more about your inquiry..."
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(250, 204, 21, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-950 px-12 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-950"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending Message...
                      </div>
                    ) : (
                      <>
                        Send Message
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          className="ml-2"
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 to-indigo-900 py-16 relative overflow-hidden border-t border-indigo-800/50">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-indigo-600 to-indigo-800"
            style={{ backgroundSize: "400% 400%" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo and tagline */}
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <h3 className="text-3xl font-bold">
                  <span className="text-yellow-400">Exodus</span>
                  <span className="text-white ml-2">Music Ministry</span>
                </h3>
              </motion.div>
              <p className="text-indigo-300 mb-6 leading-relaxed">
                Bringing God's people together through worship and music ministry
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
                {[
                  { name: "Facebook", url: "https://www.facebook.com/Exoduschoir/?checkpoint_src=any", icon: "📘" },
                  { name: "Instagram", url: "https://www.instagram.com/lenny_dany_3/", icon: "📷" },
                  { name: "YouTube", url: "https://www.youtube.com/@EXODUSMusicMinistries", icon: "📺" },
                ].map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-indigo-800 hover:bg-yellow-400 flex items-center justify-center text-2xl transition-all duration-300 border border-indigo-700 hover:border-yellow-400"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {["Home", "About Us", "Events", "Gallery", "Contact"].map((link, i) => (
                  <motion.li
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <a
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-indigo-300 hover:text-yellow-400 transition-colors duration-300 flex items-center justify-center md:justify-start"
                    >
                      <span className="mr-2">♪</span>
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact info */}
            <div className="text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-6">Get In Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start">
                  <span className="text-yellow-400 mr-3">📍</span>
                  <span className="text-indigo-300">Tamil Nadu, India</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <span className="text-yellow-400 mr-3">✉️</span>
                  <span className="text-indigo-300">victorsingthegospel@gmail.com</span>
                </li>
                <li className="flex items-center justify-center md:justify-start">
                  <span className="text-yellow-400 mr-3">📞</span>
                  <span className="text-indigo-300">+91 99444 51426</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-indigo-800/50">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-indigo-400 text-sm mb-4 md:mb-0"
            >
              © {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center"
            >
              <span className="text-yellow-400 animate-pulse mr-2">♪</span>
              <span className="text-indigo-400 text-sm">Glorifying God through music</span>
              <span className="text-yellow-400 animate-pulse ml-2">♪</span>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Contact
