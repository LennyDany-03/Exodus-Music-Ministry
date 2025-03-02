"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion"
import NavBar from "../components/Nav"

import TeamPhoto from '../assets/Team Photo.jpg'
import TeamSecondPhoto from '../assets/Team @.jpg'
import Victor from '../assets/Victor1.jpg'
import Team3rdPhoto from '../assets/Team3rdPhoto.jpg'
import SundayEve from '../assets/SundayEVE.png'
import Gospel from '../assets/GospelPoster.jpg'
import Centenary from '../assets/Centenary.jpg'

import React from "react"

const Home = () => {
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()
  const [isLoading, setIsLoading] = useState(true)

  // Enhanced parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const missionY = useTransform(scrollYProgress, [0.1, 0.3], [150, 0])
  const missionOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const eventsY = useTransform(scrollYProgress, [0.25, 0.45], [150, 0])
  const eventsOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1])
  const testimonialRotate = useTransform(scrollYProgress, [0.4, 0.6], [-5, 0])

  // Initial animation sequence
  useEffect(() => {
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsLoading(false)
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, staggerChildren: 0.3 },
      })
    }

    sequence()
  }, [controls])

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
        delay: 0.7,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  }

  // Advanced card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    }),
    hover: {
      y: -12,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  // Loading screen animation
  const loadingVariants = {
    hidden: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  }

  const loadingTextVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  // Content data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Church Member",
      quote:
        "Exodus Music Ministry has transformed our worship experience with their anointed music and genuine passion.",
    },
    {
      name: "Pastor Michael Brown",
      role: "Lead Pastor",
      quote:
        "Their dedication to excellence in worship has helped our congregation connect with God on a deeper level.",
    },
    {
      name: "David Williams",
      role: "Worship Leader",
      quote: "The passion and skill they bring to every performance is truly inspirational and uplifting.",
    },
  ]

  const upcomingEvents = [
    {
      title: "Sunday Eve/Special Service",
      date: "December 29, 2024",
      location: "Mylapore",
      description: "An evening of praise and worship to lift our spirits and connect with God.",
      image: SundayEve,
      url: "https://www.youtube.com/live/ITVjeqALSJ0?si=rcYiNaNygn-jkPcg&fbclid=IwY2xjawIxrNpleHRuA2FlbQIxMQABHbh-4KabQAxXlxjUjf7ln9UEEOtnUYmWCH-Jfk4LJtrnMm0H57R-D1SBNw_aem_W8VvXOh2pWlEfw6PYYSD7w"
    },
    {
      title: "Centenary Celebration",
      date: "December 22, 2024",
      location: " IELC Ayanavaram",
      description: "The centenary celebration was truly blessed by God's grace.",
      image: Centenary,
      url: "https://www.facebook.com/victor.exodus.9/videos/950779669841576"
    },
    {
      title: "Gospel Musical Night",
      date: "August 16, 2022",
      location: "Madurai",
      description: "Training and mentoring for young musicians and worship leaders.",
      image: Gospel,
      url: "https://www.facebook.com/photo/?fbid=3201309720197618&set=a.1415500502111891"
    },
  ];

  const missionPoints = [
    {
      icon: "✝️",
      title: "Spirit-Led Worship",
      description: "Leading worship that is anointed by the Holy Spirit and facilitates genuine encounters with God.",
    },
    {
      icon: "🎵",
      title: "Musical Excellence",
      description: "Pursuing excellence in our musicianship as an offering to God and to inspire our congregation.",
    },
    {
      icon: "👥",
      title: "Community Building",
      description: "Creating a supportive family of musicians who grow together spiritually and musically.",
    },
  ]

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-indigo-950 z-50 flex flex-col items-center justify-center"
            variants={loadingVariants}
            initial="hidden"
            exit="exit"
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
            <motion.h2 className="text-white text-xl font-bold" variants={loadingTextVariants} animate="animate">
              EXODUS MUSIC MINISTRY
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NavBar Component */}
      <NavBar />

      <div className="overflow-x-hidden bg-indigo-950 text-white">
        {/* Hero Section */}
        <motion.section
          className="h-screen relative flex items-center justify-center overflow-hidden"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="absolute inset-0 bg-indigo-950 opacity-60 z-10"></div>
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${TeamPhoto})` }}
            ></motion.div>
          </div>

          {/* Particles */}
          <div className="absolute inset-0 z-5">
            {[...Array(20)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute text-yellow-400 opacity-60"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 z-20 text-center">
            <motion.h1 className="text-5xl md:text-7xl font-bold mb-6" variants={fadeInUp}>
              <span className="block tracking-widest">EXODUS</span>
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
                MUSIC MINISTRY
              </motion.span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-indigo-100" variants={fadeInUp}>
              Bringing souls closer to God through the power of anointed music
            </motion.p>

            <motion.div className="flex flex-col md:flex-row justify-center gap-4" variants={fadeInUp}>
              <a href="https://www.youtube.com/@EXODUSMusicMinistries">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-8 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
                >
                  Watch Latest Worship
                </motion.button>
              </a>

              <a href="https://www.facebook.com/Exoduschoir/?checkpoint_src=any">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-transparent border-2 border-white px-8 py-4 rounded-full text-lg font-bold tracking-wide"
                >
                  Join Our Ministry
                </motion.button>
              </a>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{
              y: [0, 10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.section>

        {/* Team Showcase Section */}
        <motion.section
          className="py-24 bg-gradient-to-b from-indigo-950 to-indigo-900 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Ministry Team</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                United in purpose and passion, our team brings diverse talents to create a powerful worship experience.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Team Photo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-500/20 to-indigo-600/20 rounded-xl blur-lg"></div>
                <motion.div
                  className="relative rounded-xl overflow-hidden shadow-2xl border border-indigo-700"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img src={TeamSecondPhoto} alt="Exodus Music Ministry Team" className="w-full h-auto" />

                </motion.div>
              </motion.div>

              {/* Ministry Leader */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col items-center md:items-start"
              >
                <div className="mb-8 relative">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-yellow-500/30 to-indigo-600/30 rounded-full blur-lg"></div>
                  <motion.div
                    className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-yellow-400 shadow-xl"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src= {Victor}
                      alt="Exodus Music Ministry Leader"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-center md:text-left"
                >
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Dr. Victor</h3>
                  <p className="text-yellow-400 text-lg mb-4">Founder & Director</p>
                  <p className="text-indigo-100 text-lg leading-relaxed max-w-lg">
                    With over 25 years of experience in music ministry, Victor has dedicated his life to using music as
                    a powerful tool for worship and evangelism. His vision and leadership have shaped Exodus Music
                    Ministry into a beacon of excellence in Christian worship.
                  </p>

                <a href="/fullbio">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-6 bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-6 py-3 rounded-full font-bold shadow-lg inline-flex items-center"
                  >
                    Read Full Bio
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
                  </motion.button></a>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Our Mission Section */}
        <motion.section
          className="py-32 bg-gradient-to-b from-indigo-900 to-indigo-900 overflow-hidden relative"
          style={{ y: missionY, opacity: missionOpacity }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-yellow-400"
                style={{
                  width: 200 + index * 100 + "px",
                  height: 200 + index * 100 + "px",
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 100 + "%",
                }}
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [0, 30, 0, -30, 0],
                }}
                transition={{
                  duration: 15 + index * 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Mission</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                To create a worship experience that draws people closer to God, develops musical excellence, and fosters
                spiritual growth through the ministry of music.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {missionPoints.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="bg-indigo-800/60 backdrop-blur-sm p-10 rounded-2xl text-center border border-indigo-600 shadow-xl"
                >
                  <motion.div
                    className="text-5xl mb-6 mx-auto bg-gradient-to-r from-yellow-500 to-yellow-300 w-20 h-20 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-indigo-100 text-lg">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Upcoming Events Section */}
        <motion.section
          className="py-32 bg-indigo-900 relative overflow-hidden"
          style={{ y: eventsY, opacity: eventsOpacity }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-indigo-950 to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Previous Events</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            </motion.div>

            {/* Replace this in the Upcoming Events section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="bg-indigo-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-indigo-700 group"
                >
                  <motion.div
                    className="h-56 bg-indigo-700 flex items-center justify-center overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="relative w-full h-full"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70 z-10"></div>
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }}></div>
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold">
                          {event.date}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-indigo-200 mb-3 flex items-center">
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
                    <p className="text-indigo-100 mb-6 text-lg">{event.description}</p>
                    <motion.a
                      href={event.url}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 py-3 rounded-full font-bold shadow-lg flex items-center justify-center"
                    >
                      Learn More
                    </motion.a>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, x: [0, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-transparent border-2 border-yellow-400 text-yellow-400 px-10 py-4 rounded-full text-lg font-bold flex items-center mx-auto"
              >
                View All Events
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
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="py-32 bg-gradient-to-b from-indigo-900 to-indigo-950 overflow-hidden relative"
          style={{ rotate: testimonialRotate }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Testimonials</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="bg-indigo-800/70 backdrop-blur-sm p-10 rounded-2xl relative border border-indigo-700 shadow-xl"
                >
                  <motion.div
                    className="text-7xl text-yellow-400 opacity-20 absolute top-6 left-6"
                    animate={{ rotate: [-2, 2, -2] }}
                    transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
                  >
                    ♪
                  </motion.div>
                  <p className="text-indigo-100 mb-8 relative z-10 text-lg leading-relaxed">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <motion.div
                      className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full flex items-center justify-center text-indigo-950 font-bold text-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {testimonial.name.charAt(0)}
                    </motion.div>
                    <div className="ml-4">
                      <p className="font-bold text-lg">{testimonial.name}</p>
                      <p className="text-yellow-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="py-32 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-indigo-950 opacity-80 z-10"></div>
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="w-full h-full bg-center"
              style={{ backgroundImage: `url(${Team3rdPhoto})`}}
            ></motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Join Our Ministry Today
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl mb-10 text-indigo-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Whether you sing, play an instrument, or have technical skills, there's a place for you in Exodus Music
                Ministry.
              </motion.p>

              <motion.div
                className="flex flex-col md:flex-row justify-center gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-10 py-5 rounded-full text-xl font-bold tracking-wide shadow-lg"
                >
                  Apply Now
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white px-10 py-5 rounded-full text-xl font-bold tracking-wide hover:border-yellow-400 hover:text-yellow-400 transition-colors"
                >
                  Contact Us
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Floating music notes */}
          {[...Array(15)].map((_, index) => (
            <motion.div
              key={index}
              className="absolute text-xl text-yellow-400 opacity-40"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 0.7, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
                ease: "easeOut",
              }}
            >
              {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
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
                <motion.span 
                  className="text-4xl font-bold text-white ml-2" 
                  whileHover={{ scale: 1.05 }}
                >
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
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    )
                  },
                  { 
                    name: "Instagram", 
                    url: "https://www.instagram.com/lenny_dany_3/",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    )
                  },
                  { 
                    name: "YouTube", 
                    url: "https://www.youtube.com/@EXODUSMusicMinistries",
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C1.763 3.36.366 5.55.366 8.627v6.745c0 3.078 1.395 5.267 4.02 5.444 3.603.245 11.626.246 15.23 0 2.625-.177 4.019-2.366 4.019-5.444V8.627c0-3.078-1.394-5.267-4.02-5.443zm-3.246 8.336l-6.26 3.626a.512.512 0 01-.752-.448V6.903a.51.51 0 01.752-.448l6.26 3.626a.51.51 0 010 .883z" />
                      </svg>
                    )
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
                  { name: "Contact", icon: "✉️" }
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
                      href={`/${link.name.toLowerCase().replace(/\s+/g, '-')}`}
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-indigo-200">+91 9876543210</span>
                </motion.li>
              </ul>
            </div>
          </div>
          
          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-indigo-600 to-transparent my-8"
          />
          
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
        
        {/* Floating music notes */}
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute text-xl text-yellow-400 opacity-40"
            style={{
              left: Math.random() * 100 + "%",
              bottom: "100%",
            }}
            animate={{
              y: [0, 120],
              opacity: [0, 0.7, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
              ease: "linear",
            }}
          >
            {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
      </footer>
      </div>
    </>
  )
}

export default Home

