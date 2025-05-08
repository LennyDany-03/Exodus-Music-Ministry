"use client"
import React from "react"
import { useEffect, useState } from "react"
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from "framer-motion"
import NavBar from "../components/Nav"

import TeamPhoto from "../assets/Team Photo.jpg"
import Team3rdPhoto from "../assets/Team3rdPhoto.jpg"

const Music = () => {
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("albums")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)

  // Enhanced parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85])
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const albumsY = useTransform(scrollYProgress, [0.1, 0.3], [150, 0])
  const albumsOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const streamingY = useTransform(scrollYProgress, [0.25, 0.45], [150, 0])
  const streamingOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1])

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

  // Albums data
  const albums = [
    {
      id: 1,
      title: "Worship in Spirit",
      year: "2023",
      cover: "/placeholder.svg?height=400&width=400",
      tracks: [
        { title: "Holy Spirit", duration: "5:24" },
        { title: "Amazing Grace", duration: "4:18" },
        { title: "Hallelujah", duration: "6:02" },
        { title: "In Your Presence", duration: "4:45" },
        { title: "Worthy of Praise", duration: "5:10" },
      ],
    },
    {
      id: 2,
      title: "Songs of Devotion",
      year: "2021",
      cover: "/placeholder.svg?height=400&width=400",
      tracks: [
        { title: "Faithful God", duration: "4:56" },
        { title: "Surrender All", duration: "5:12" },
        { title: "Divine Love", duration: "4:38" },
        { title: "Everlasting Arms", duration: "5:30" },
        { title: "Shepherd's Heart", duration: "4:22" },
      ],
    },
    {
      id: 3,
      title: "Praise Awakening",
      year: "2019",
      cover: "/placeholder.svg?height=400&width=400",
      tracks: [
        { title: "Awaken My Soul", duration: "5:15" },
        { title: "Living Water", duration: "4:48" },
        { title: "Mighty Fortress", duration: "5:32" },
        { title: "Redeemer", duration: "4:20" },
        { title: "Glorious Day", duration: "5:05" },
      ],
    },
  ]

  // Singles data
  const singles = [
    {
      id: 1,
      title: "Glory to God",
      year: "2024",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "4:35",
    },
    {
      id: 2,
      title: "Heavenly Light",
      year: "2023",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "5:12",
    },
    {
      id: 3,
      title: "Divine Grace",
      year: "2022",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "4:48",
    },
    {
      id: 4,
      title: "Spirit's Calling",
      year: "2021",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "5:30",
    },
  ]

  // Live recordings data
  const liveRecordings = [
    {
      id: 1,
      title: "Easter Celebration",
      year: "2023",
      location: "St. Thomas Church, Chennai",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "1:15:24",
    },
    {
      id: 2,
      title: "Christmas Worship Night",
      year: "2022",
      location: "Bethel Convention Center, Bangalore",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "1:32:18",
    },
    {
      id: 3,
      title: "Youth Conference",
      year: "2021",
      location: "IELC Ayanavaram, Chennai",
      cover: "/placeholder.svg?height=400&width=400",
      duration: "1:08:45",
    },
  ]

  // Streaming platforms data
  const streamingPlatforms = [
    {
      name: "Spotify",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
      url: "https://open.spotify.com",
    },
    {
      name: "Apple Music",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.997 6.124c0-.738-.065-1.47-.24-2.19-.317-1.31-1.062-2.31-2.18-3.043C21.003.517 20.373.285 19.7.164c-.517-.093-1.038-.135-1.564-.15-.04-.003-.083-.01-.124-.013H5.988c-.152.01-.303.017-.455.026C4.786.07 4.043.15 3.34.428 2.004.958 1.04 1.88.448 3.208c-.207.458-.332.939-.384 1.442-.058.565-.07 1.132-.07 1.7v11.3c.01.567.022 1.14.081 1.706.084.852.34 1.643.827 2.35.64.942 1.523 1.612 2.6 2.02.8.307 1.63.448 2.483.482.963.036 1.93.023 2.896.023h10.751c.196-.016.392-.03.588-.052.701-.065 1.387-.211 2.028-.498 1.171-.52 2.038-1.325 2.574-2.47.263-.55.413-1.13.484-1.742.051-.437.065-.876.065-1.315V6.124zm-2.854 12.55c-.074.51-.21.98-.472 1.42-.338.56-.825.962-1.43 1.23-.35.157-.73.26-1.118.322-.57.087-1.144.1-1.72.1H6.59c-.077-.017-.155-.03-.232-.047-.457-.08-.902-.178-1.326-.354-.99-.414-1.65-1.078-1.974-2.1-.13-.42-.196-.845-.227-1.282-.033-.46-.04-.927-.04-1.4V7.89c.006-.37.012-.73.033-1.11.033-.51.1-1.01.262-1.495.366-1.08 1.02-1.9 2.082-2.414.422-.21.856-.353 1.307-.45.335-.07.67-.11 1.01-.133.13-.01.262-.016.394-.023h12.71c.4.004.79.013.118.023.33.02.656.056.98.126.89.197 1.668.6 2.26 1.3.345.41.582.873.722 1.4.17.625.172 1.26.175 1.892.007 2.31.007 4.618.002 6.93-.01 1.002-.03 2.01-.21 3z" />
          <path d="M12 10.11c-1.982 0-3.584 1.602-3.584 3.584S10.018 17.278 12 17.278s3.584-1.602 3.584-3.584S13.982 10.11 12 10.11zm0 5.38c-.992 0-1.796-.804-1.796-1.796S11.008 11.898 12 11.898s1.796.804 1.796 1.796S12.992 15.49 12 15.49z" />
          <path d="M17.733 9.108a.882.882 0 0 0-.882.882.882.882 0 0 0 .882.882.882.882 0 0 0 .882-.882.882.882 0 0 0-.882-.882z" />
        </svg>
      ),
      url: "https://music.apple.com",
    },
    {
      name: "YouTube Music",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L16.2 12l-6.516 3.54z" />
        </svg>
      ),
      url: "https://music.youtube.com",
    },
    {
      name: "Amazon Music",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.81 7.907l-4.968-1.103-.53 2.382 2.782.618c.366.082.61.445.527.811-.082.366-.445.61-.811.527l-2.782-.618-.616 2.77 4.968 1.103c.366.082.61.445.527.811-.082.366-.445.61-.811.527l-4.968-1.103-.523 2.351c-.082.366-.445.61-.811.527-.366-.082-.61-.445-.527-.811l.523-2.351-3.669-.815-.523 2.351c-.082.366-.445.61-.811.527-.366-.082-.61-.445-.527-.811l.523-2.351-4.968-1.103c-.366-.082-.61-.445-.527-.811.082-.366.445-.61.811-.527l4.968 1.103.616-2.77-2.782-.618c-.366-.082-.61-.445-.527-.811.082-.366.445-.61.811-.527l2.782.618.53-2.382-4.968-1.103c-.366-.082-.61-.445-.527-.811.082-.366.445-.61.811-.527l4.968 1.103.53-2.382c.082-.366.445-.61.811-.527.366.082.61.445.527.811l-.53 2.382 3.669.815.53-2.382c.082-.366.445-.61.811-.527.366.082.61.445.527.811l-.53 2.382 4.968 1.103c.366.082.61.445.527.811-.082.366-.445.61-.811.527zm-9.148.815l-3.669-.815-.616 2.77 3.669.815.616-2.77z" />
        </svg>
      ),
      url: "https://music.amazon.com",
    },
  ]

  // Handle play/pause track
  const togglePlay = (track) => {
    if (currentTrack && currentTrack.title === track.title) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

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
                MUSIC
              </motion.span>
            </motion.h1>

            <motion.p className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-indigo-100" variants={fadeInUp}>
              Explore our albums, singles, and live recordings that glorify God through anointed worship
            </motion.p>

            <motion.div variants={fadeInUp}>
              <a href="#music-section">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-10 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
                >
                  Listen Now
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

        {/* Music Section */}
        <motion.section
          id="music-section"
          className="py-32 bg-gradient-to-b from-indigo-950 to-indigo-900 overflow-hidden relative"
          style={{ y: albumsY, opacity: albumsOpacity }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Discography</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                Browse through our collection of worship albums, singles, and live recordings
              </p>
            </motion.div>

            {/* Music Tabs */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                { id: "albums", name: "Albums" },
                { id: "singles", name: "Singles" },
                { id: "live", name: "Live Recordings" },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-yellow-400 text-indigo-950"
                      : "bg-indigo-800/60 text-white hover:bg-indigo-700"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.name}
                </motion.button>
              ))}
            </motion.div>

            {/* Albums Tab Content */}
            {activeTab === "albums" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {albums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    className="bg-indigo-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-indigo-700 group"
                  >
                    <motion.div className="relative aspect-square overflow-hidden" whileHover={{ scale: 1.05 }}>
                      <img
                        src={album.cover || "/placeholder.svg"}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold">
                          {album.year}
                        </span>
                      </div>
                    </motion.div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-400 transition-colors">
                        {album.title}
                      </h3>
                      <div className="space-y-3 mb-6">
                        {album.tracks.map((track, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 hover:bg-indigo-700/50 rounded-lg cursor-pointer"
                            onClick={() => togglePlay(track)}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 flex items-center justify-center mr-3">
                                {currentTrack && currentTrack.title === track.title && isPlaying ? (
                                  <motion.div
                                    className="flex items-center space-x-1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                  >
                                    {[0, 1, 2].map((bar) => (
                                      <motion.span
                                        key={bar}
                                        className="w-1 bg-yellow-400"
                                        animate={{
                                          height: [3, 12, 3],
                                        }}
                                        transition={{
                                          repeat: Number.POSITIVE_INFINITY,
                                          repeatType: "loop",
                                          duration: 1,
                                          delay: bar * 0.2,
                                        }}
                                      />
                                    ))}
                                  </motion.div>
                                ) : (
                                  <svg
                                    className="w-5 h-5 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-indigo-100">{track.title}</span>
                            </div>
                            <span className="text-indigo-300 text-sm">{track.duration}</span>
                          </div>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 py-3 rounded-full font-bold shadow-lg flex items-center justify-center"
                      >
                        Stream Album
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Singles Tab Content */}
            {activeTab === "singles" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {singles.map((single, index) => (
                  <motion.div
                    key={single.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    className="bg-indigo-800/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-indigo-700 group"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={single.cover || "/placeholder.svg"}
                        alt={single.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold">
                          {single.year}
                        </span>
                      </div>
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => togglePlay(single)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
                        >
                          {currentTrack && currentTrack.title === single.title && isPlaying ? (
                            <svg
                              className="w-8 h-8 text-indigo-950"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-indigo-950"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold group-hover:text-yellow-400 transition-colors">
                        {single.title}
                      </h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-indigo-300 text-sm">{single.duration}</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm3-8h-6v2h6v-2z" />
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Live Recordings Tab Content */}
            {activeTab === "live" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {liveRecordings.map((recording, index) => (
                  <motion.div
                    key={recording.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    className="bg-indigo-800/70 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-indigo-700 group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={recording.cover || "/placeholder.svg"}
                        alt={recording.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-70"></div>
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        onClick={() => togglePlay(recording)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center"
                        >
                          {currentTrack && currentTrack.title === recording.title && isPlaying ? (
                            <svg
                              className="w-8 h-8 text-indigo-950"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg
                              className="w-8 h-8 text-indigo-950"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                        {recording.title}
                      </h3>
                      <p className="text-indigo-200 mb-3 flex items-center text-sm">
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
                        {recording.location}
                      </p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-yellow-400 text-sm">{recording.year}</span>
                        <span className="text-indigo-300 text-sm">{recording.duration}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-full font-bold shadow-lg flex items-center justify-center"
                      >
                        Watch Full Recording
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

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
                View Complete Discography
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

        {/* Streaming Platforms Section */}
        <motion.section
          className="py-32 bg-gradient-to-b from-indigo-900 to-indigo-950 overflow-hidden relative"
          style={{ y: streamingY, opacity: streamingOpacity }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Stream Our Music</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                Listen to our worship music on your favorite streaming platforms
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {streamingPlatforms.map((platform, index) => (
                <motion.a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="bg-indigo-800/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-indigo-700 shadow-xl"
                >
                  <motion.div className="text-yellow-400 mb-6 mx-auto" whileHover={{ rotate: 5, scale: 1.1 }}>
                    {platform.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">{platform.name}</h3>
                  <p className="text-indigo-100 text-lg mb-6">Listen on {platform.name}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-6 py-3 rounded-full font-bold shadow-lg"
                  >
                    Stream Now
                  </motion.button>
                </motion.a>
              ))}
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

        {/* Music Licensing Section */}
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
              style={{ backgroundImage: `url(${Team3rdPhoto})` }}
            ></motion.div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto">
              <motion.div
                className="bg-indigo-800/80 backdrop-blur-sm p-10 rounded-2xl border border-indigo-700 shadow-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Music Licensing</h2>
                  <div className="w-16 h-1 bg-yellow-400 mx-auto mb-4"></div>
                  <p className="text-indigo-100">
                    Interested in using our music for your church, event, or production?
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-indigo-700/50 p-6 rounded-xl border border-indigo-600"
                  >
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">Church Worship</h3>
                    <p className="text-indigo-100 mb-4">
                      Our music is freely available for use in church worship services. We simply ask that you credit
                      Exodus Music Ministry when displaying lyrics.
                    </p>
                    <a href="#" className="text-yellow-400 hover:underline inline-flex items-center">
                      Learn More
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-indigo-700/50 p-6 rounded-xl border border-indigo-600"
                  >
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">Media & Productions</h3>
                    <p className="text-indigo-100 mb-4">
                      For use in videos, films, podcasts, or other media productions, please contact us for licensing
                      information and rates.
                    </p>
                    <a href="#" className="text-yellow-400 hover:underline inline-flex items-center">
                      Contact for Licensing
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-indigo-700/50 p-6 rounded-xl border border-indigo-600"
                  >
                    <h3 className="text-xl font-bold mb-3 text-yellow-400">Custom Music</h3>
                    <p className="text-indigo-100 mb-4">
                      Need custom worship music for your event or project? Our team can create original compositions
                      tailored to your specific needs.
                    </p>
                    <a href="#" className="text-yellow-400 hover:underline inline-flex items-center">
                      Request Custom Music
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </a>
                  </motion.div>
                </div>

                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-10 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
                  >
                    Contact Our Licensing Team
                  </motion.button>
                </motion.div>
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
                    <span className="text-indigo-200">victorsingthegospel@gmail.com</span>
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
                    <span className="text-indigo-200">+91 9710405200</span>
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

export default Music

