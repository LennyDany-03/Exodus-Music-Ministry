"use client"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import NavBar from "../components/Nav"
import React from "react"
import TeamPhoto from "../assets/Team Photo.jpg"
import SundayEve from "../assets/SundayEVE.png"
import Gospel from "../assets/GospelPoster.jpg"
import Centenary from "../assets/Centenary.jpg"
import Team3rdPhoto from "../assets/Team3rdPhoto.jpg"
import Victor1 from "../assets/Victor1.jpg"

const Events = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const formRef = useRef(null)

  // Initial loading sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to form handler
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Past events data
  const pastEvents = [
    {
      title: "Sunday Eve/Special Service",
      date: "December 29, 2024",
      location: "Mylapore",
      description: "An evening of praise and worship to lift our spirits and connect with God.",
      image: SundayEve,
      url: "https://www.youtube.com/live/ITVjeqALSJ0?si=rcYiNaNygn-jkPcg&fbclid=IwY2xjawIxrNpleHRuA2FlbQIxMQABHbh-4KabQAxXlxjUjf7ln9UEEOtnUYmWCH-Jfk4LJtrnMm0H57R-D1SBNw_aem_W8VvXOh2pWlEfw6PYYSD7w",
    },
    {
      title: "Centenary Celebration",
      date: "December 22, 2024",
      location: "IELC Ayanavaram",
      description: "The centenary celebration was truly blessed by God's grace.",
      image: Centenary,
      url: "https://www.facebook.com/victor.exodus.9/videos/950779669841576",
    },
    {
      title: "Gospel Musical Night",
      date: "August 16, 2022",
      location: "Madurai",
      description: "Training and mentoring for young musicians and worship leaders.",
      image: Gospel,
      url: "https://www.facebook.com/photo/?fbid=3201309720197618&set=a.1415500502111891",
    },
    {
      title: "Christmas Cantata",
      date: "December 18, 2023",
      location: "St. Mark's Cathedral, Chennai",
      description: "A musical celebration of the birth of Christ featuring traditional and contemporary arrangements.",
      image: Team3rdPhoto,
      url: "#",
    },
    {
      title: "Worship Leaders Retreat",
      date: "October 5-7, 2023",
      location: "Yelagiri Hills",
      description: "A weekend of spiritual renewal and musical training for worship leaders from across Tamil Nadu.",
      image: Victor1,
      url: "#",
    },
    {
      title: "Community Outreach Concert",
      date: "July 22, 2023",
      location: "Marina Beach, Chennai",
      description: "A free public concert sharing the message of hope and love through music.",
      image: TeamPhoto,
      url: "#",
    },
    {
      title: "Easter Worship Night",
      date: "April 9, 2023",
      location: "St. Thomas Church, Chennai",
      description: "Join us for a special Easter celebration with powerful worship and fellowship.",
      image: SundayEve,
      url: "#",
    },
    {
      title: "Youth Worship Conference",
      date: "May 15-17, 2023",
      location: "Bethel Convention Center, Bangalore",
      description:
        "A three-day conference focused on equipping young worship leaders with skills and spiritual guidance.",
      image: Gospel,
      url: "#",
    },
    {
      title: "Summer Music Workshop",
      date: "June 5-10, 2023",
      location: "Exodus Music Academy, Chennai",
      description: "Learn worship instruments, vocal techniques, and sound engineering in this intensive workshop.",
      image: Centenary,
      url: "#",
    },
  ]

  // Responsive scroll animations that work on both mobile and desktop
  const { scrollYProgress } = useScroll()

  // Responsive scroll animations that work on both mobile and desktop
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const pastEventsY = useTransform(
    scrollYProgress,
    [0.1, 0.3],
    [typeof window !== "undefined" ? (window.innerWidth > 768 ? 100 : 50) : 100, 0],
  )
  const pastEventsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const hostEventY = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    [typeof window !== "undefined" ? (window.innerWidth > 768 ? 100 : 50) : 100, 0],
  )
  const hostEventOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
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

  // Display only 6 events initially
  const displayedEvents = showAllEvents ? pastEvents : pastEvents.slice(0, 6)

  // Add a useEffect to handle window resize for responsive animations
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render to update animations based on new window size
      setIsLoading(false)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-indigo-950 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-20 h-20 mb-8 relative"
            >
              <div className="w-full h-full rounded-full border-t-4 border-b-4 border-yellow-400"></div>
              <div className="absolute inset-0 flex items-center justify-center text-yellow-400 text-4xl">♪</div>
            </motion.div>
            <motion.h2
              className="text-white text-xl font-bold"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              EXODUS MUSIC MINISTRY
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NavBar Component */}
      <NavBar />

      <div className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white">
        {/* Hero Section */}
        <motion.section
          className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          style={{ opacity: heroOpacity }}
        >
          {/* Background */}
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="absolute inset-0 bg-indigo-950/70 z-10"></div>
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${TeamPhoto})` }}
            ></motion.div>
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 z-5 pointer-events-none">
            {[...Array(12)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-yellow-400 opacity-60"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [0, -15, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: Math.random() * 2,
                }}
              >
                {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 z-20 text-center">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={fadeInUp}>
                <span className="block">OUR</span>
                <motion.span
                  className="text-yellow-400 inline-block"
                  animate={{
                    textShadow: [
                      "0px 0px 0px rgba(250, 204, 21, 0)",
                      "0px 0px 20px rgba(250, 204, 21, 0.5)",
                      "0px 0px 0px rgba(250, 204, 21, 0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  EVENTS
                </motion.span>
              </motion.h1>

              <motion.p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-indigo-100" variants={fadeInUp}>
                Relive our powerful worship experiences and musical celebrations
              </motion.p>

              <motion.div variants={fadeInUp}>
                <motion.button
                  onClick={scrollToForm}
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-10 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
                >
                  Host an Event
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Past Events Section */}
        <motion.section
          className="py-24 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{
            y: pastEventsY,
            opacity: pastEventsOpacity,
          }}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/50 to-indigo-950/80 z-0"></div>

          {/* Animated background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-indigo-600/10"
                style={{
                  width: 100 + Math.random() * 300,
                  height: 100 + Math.random() * 300,
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  x: [0, Math.random() * 30 - 15],
                  y: [0, Math.random() * 30 - 15],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 8 + Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div className="text-center mb-16" variants={fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Past Events</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                Relive the moments of worship and praise from our previous events
              </p>
            </motion.div>

            {/* Event cards grid */}
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
              {displayedEvents.map((event, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative h-[450px] rounded-xl overflow-hidden group"
                >
                  {/* Card background image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/40 to-transparent opacity-60" />

                  {/* Date badge */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold">
                      {event.date}
                    </span>
                  </div>

                  {/* Bottom content - always visible */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold mb-2 text-white">{event.title}</h3>
                    <p className="text-yellow-300 flex items-center text-sm mb-2">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {event.location}
                    </p>
                  </div>

                  {/* Hover overlay with details */}
                  <div className="absolute inset-0 bg-indigo-800/80 backdrop-blur-sm flex flex-col justify-center items-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-2xl font-bold mb-4 text-white">{event.title}</h3>
                    <div className="w-12 h-1 bg-yellow-400 mb-4"></div>
                    <p className="text-white text-center mb-6">{event.description}</p>
                    <p className="text-yellow-300 flex items-center text-sm mb-6">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {event.location} • {event.date}
                    </p>
                    <motion.a
                      href={event.url}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-6 py-3 rounded-full font-bold shadow-lg flex items-center"
                    >
                      View Details
                      <svg
                        className="ml-2 w-4 h-4"
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
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* View More Button */}
            {pastEvents.length > 6 && (
              <motion.div variants={fadeInUp} className="text-center mt-16">
                <motion.button
                  onClick={() => setShowAllEvents(!showAllEvents)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden group px-10 py-4 rounded-full"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-700 to-indigo-600 group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300 rounded-full"></span>
                  <span className="relative flex items-center justify-center text-white font-bold text-lg">
                    {showAllEvents ? "Show Less" : "View More Events"}
                    <motion.svg
                      animate={{ x: showAllEvents ? 0 : [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: showAllEvents ? 0 : Number.POSITIVE_INFINITY }}
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={showAllEvents ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                      ></path>
                    </motion.svg>
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Host an Event Section */}
        <motion.section
          ref={formRef}
          className="py-32 relative overflow-hidden"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{
            y: hostEventY,
            opacity: hostEventOpacity,
          }}
        >
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-indigo-950/80 backdrop-blur-sm z-10"></div>
            <div className="w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${TeamPhoto})` }}></div>
          </div>

          {/* Animated particles */}
          <div className="absolute inset-0 z-5 pointer-events-none">
            {[...Array(8)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-xl text-yellow-400 opacity-40"
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  y: [0, -15],
                  opacity: [0.2, 0.5, 0.2],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: Math.random() * 2,
                }}
              >
                {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto">
              <motion.div className="rounded-2xl overflow-hidden shadow-2xl" variants={fadeInUp}>
                {/* Header section */}
                <div className="bg-gradient-to-r from-indigo-800 to-indigo-700 p-10 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%"],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "mirror",
                      }}
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 30% 50%, rgba(250, 204, 21, 0.4) 0%, transparent 25%), radial-gradient(circle at 70% 20%, rgba(250, 204, 21, 0.4) 0%, transparent 25%)",
                        backgroundSize: "150% 150%",
                      }}
                    />
                  </div>

                  <div className="relative z-10 text-center">
                    <motion.div variants={fadeInUp}>
                      <h2 className="text-3xl md:text-4xl font-bold mb-4">Host an Event with Us</h2>
                      <div className="w-20 h-1 bg-yellow-400 mx-auto mb-6"></div>
                    </motion.div>
                    <motion.p className="text-indigo-100 max-w-2xl mx-auto" variants={fadeInUp}>
                      Interested in having Exodus Music Ministry perform at your church, conference, or special event?
                      Fill out the form below and we'll get back to you soon.
                    </motion.p>
                  </div>
                </div>

                {/* Form section */}
                <div className="bg-indigo-900/90 backdrop-blur-md p-10 border-t border-indigo-700">
                  <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6" variants={staggerContainer}>
                    <motion.div className="space-y-2" variants={fadeInUp}>
                      <label className="block text-sm font-medium text-indigo-100">Your Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white pr-10"
                          placeholder="Enter your name"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
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
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={fadeInUp}>
                      <label className="block text-sm font-medium text-indigo-100">Email Address</label>
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white pr-10"
                          placeholder="Enter your email"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
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
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={fadeInUp}>
                      <label className="block text-sm font-medium text-indigo-100">Event Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div className="space-y-2" variants={fadeInUp}>
                      <label className="block text-sm font-medium text-indigo-100">Event Location</label>
                      <div className="relative">
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white pr-10"
                          placeholder="City, Venue"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-400">
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
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div className="space-y-2 mb-8" variants={fadeInUp}>
                    <label className="block text-sm font-medium text-indigo-100">Event Details</label>
                    <div className="relative">
                      <textarea
                        className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white h-32"
                        placeholder="Tell us about your event and requirements"
                      ></textarea>
                      <div className="absolute right-3 top-3 text-indigo-400">
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="text-center" variants={fadeInUp}>
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="relative overflow-hidden group px-10 py-4 rounded-full"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 to-yellow-400 group-hover:from-yellow-400 group-hover:to-yellow-300 transition-all duration-300 rounded-full"></span>
                      <span className="relative flex items-center justify-center text-indigo-950 font-bold text-lg">
                        Submit Request
                        <svg
                          className="ml-2 w-5 h-5"
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
                      </span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-indigo-950 py-16 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 z-0 opacity-15">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{
                duration: 25,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "mirror",
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-indigo-600 to-indigo-800"
              style={{ backgroundSize: "400% 400%" }}
            />
          </div>

          {/* Content container */}
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              {/* Logo and tagline */}
              <div className="flex flex-col items-center md:items-start">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center mb-4"
                >
                  <motion.span
                    className="text-4xl font-bold text-yellow-400"
                    whileHover={{
                      textShadow: "0px 0px 8px rgba(250, 204, 21, 0.7)",
                      scale: 1.05,
                    }}
                  >
                    EXODUS
                  </motion.span>
                  <motion.span className="text-4xl font-bold text-white ml-2" whileHover={{ scale: 1.05 }}>
                    MUSIC
                  </motion.span>
                </motion.div>
                <p className="text-indigo-200 text-center md:text-left mb-6">
                  Bringing God's people together through worship and music ministry
                </p>
                <div className="flex space-x-4">
                  {[
                    {
                      name: "Facebook",
                      url: "https://www.facebook.com/Exoduschoir/?checkpoint_src=any",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "Instagram",
                      url: "https://www.instagram.com/lenny_dany_3/",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fillRule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ),
                    },
                    {
                      name: "YouTube",
                      url: "https://www.youtube.com/@EXODUSMusicMinistries",
                      icon: (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C1.763 3.36.366 5.55.366 8.627v6.745c0 3.078 1.395 5.267 4.02 5.444 3.603.245 11.626.246 15.23 0 2.625-.177 4.019-2.366 4.019-5.444V8.627c0-3.078-1.394-5.267-4.02-5.443zm-3.246 8.336l-6.26 3.626a.512.512 0 01-.752-.448V6.903a.51.51 0 01.752-.448l6.26 3.626a.51.51 0 010 .883z" />
                        </svg>
                      ),
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.15,
                        backgroundColor: "#FBBF24",
                        color: "#312E81",
                        borderColor: "#FBBF24",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-indigo-800 hover:bg-yellow-400 
                                flex items-center justify-center text-gray-300 hover:text-indigo-900 
                                border border-indigo-700 transition-all duration-300"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div className="flex flex-col items-center md:items-start">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-xl font-bold text-white mb-6"
                >
                  Quick Links
                </motion.h3>
                <ul className="space-y-3">
                  {[
                    { name: "Home", icon: "🏠" },
                    { name: "About Us", icon: "♪" },
                    { name: "Events", icon: "🎵" },
                    { name: "Gallery", icon: "🎭" },
                    { name: "Contact", icon: "✉️" },
                  ].map((link, i) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <span className="text-yellow-400 text-sm">{link.icon}</span>
                      <a
                        href={`/${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="text-indigo-200 hover:text-yellow-400 transition-colors duration-300"
                      >
                        {link.name}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Contact info */}
              <div className="flex flex-col items-center md:items-start">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-xl font-bold text-white mb-6"
                >
                  Get In Touch
                </motion.h3>
                <ul className="space-y-4">
                  <motion.li
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center mr-3 text-yellow-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-indigo-200">Tamil Nadu, India</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center mr-3 text-yellow-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <span className="text-indigo-200">info@exodusmusic.org</span>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex items-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-800 flex items-center justify-center mr-3 text-yellow-400">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <span className="text-indigo-200">+91 9876543210</span>
                  </motion.li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-indigo-300 text-sm"
              >
                <p>© {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center mt-4 md:mt-0"
              >
                <span className="text-yellow-400 animate-pulse">♪</span>
                <span className="mx-2 text-indigo-300 text-sm">Glorifying God through music</span>
                <span className="text-yellow-400 animate-pulse">♪</span>
              </motion.div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Events
