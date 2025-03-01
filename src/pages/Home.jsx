"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Music, Calendar, Users, PlayCircle, ChevronDown } from "lucide-react"
import React from "react"

const Home = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50])

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        id="home"
        style={{ opacity, scale, y }}
        className="h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-black/80 z-10" />
          <img
            src="/placeholder.svg?height=1080&width=1920"
            alt="Worship background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <Music className="h-16 w-16 mx-auto text-white mb-4" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            <span className="block">Exodus</span>
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Music Ministry
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10"
          >
            Inspiring worship through music and praise
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#events"
              className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-primary/50 transition-all"
            >
              Upcoming Events
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#music"
              className="px-8 py-3 bg-white text-primary font-medium rounded-full shadow-lg hover:shadow-white/50 transition-all"
            >
              Listen to Music
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
            <ChevronDown className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              About Our Ministry
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-10">
              Exodus Music Ministry is dedicated to creating an atmosphere of worship where people can encounter God
              through music. Our mission is to lead people into God's presence through anointed praise and worship.
            </motion.p>

            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-8">
              <motion.div
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Music className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Worship</h3>
                <p className="text-gray-600">Leading the congregation in heartfelt worship experiences.</p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Building a community of musicians passionate about serving God.</p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <PlayCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Music</h3>
                <p className="text-gray-600">Creating original music that inspires and uplifts the spirit.</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Upcoming Events</h2>
              <p className="text-lg text-gray-600">Join us for these special worship experiences</p>
            </motion.div>

            <motion.div variants={staggerContainer} className="grid gap-8">
              {[
                {
                  title: "Sunday Worship Service",
                  date: "Every Sunday, 10:00 AM",
                  location: "Main Sanctuary",
                  description: "Join us for our weekly worship service led by the Exodus Music Ministry team.",
                },
                {
                  title: "Night of Worship",
                  date: "June 15, 2024, 7:00 PM",
                  location: "Community Hall",
                  description: "A special evening dedicated to extended worship and prayer.",
                },
                {
                  title: "Worship Workshop",
                  date: "July 10, 2024, 6:00 PM",
                  location: "Music Room",
                  description: "Learn worship techniques and grow your musical skills with our team.",
                },
              ].map((event, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
                >
                  <div className="bg-primary/10 p-4 rounded-lg h-20 w-20 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                    <Calendar className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-center md:text-left">{event.title}</h3>
                    <p className="text-primary font-medium mb-1">{event.date}</p>
                    <p className="text-gray-600 mb-2">{event.location}</p>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="text-center mt-10">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-primary/50 inline-block transition-all"
              >
                View All Events
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Ministry
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-xl mb-10 text-white/90">
              Are you passionate about worship and music? We're always looking for dedicated musicians and vocalists to
              join our team.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-8 py-3 bg-white text-primary font-medium rounded-full shadow-lg hover:shadow-white/50 transition-all"
              >
                Contact Us
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#about"
                className="px-8 py-3 bg-transparent text-white border-2 border-white font-medium rounded-full shadow-lg hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home

