"use client"

import { useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Youtube,
  Facebook,
  Mail,
  Phone,
  MapPin,
  Award,
  Book,
  Music,
  Video,
  Globe,
  Star,
  Heart,
  Users,
} from "lucide-react"

import NavBar from "../components/Nav"
import Victor from "../assets/Victor1.jpg"

const Portfolio = () => {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
    hover: {
      y: -8,
      transition: { duration: 0.3 },
    },
  }

  // Floating music notes component
  const FloatingNote = ({ delay = 0, duration = 3, x = 0, y = 0 }) => (
    <motion.div
      className="absolute text-yellow-400/20 text-2xl pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [-20, -40, -20],
        rotate: [0, 10, -10, 0],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    >
      ♪
    </motion.div>
  )

  // Section component for consistent styling
  const Section = ({ title, children, icon, delay = 0 }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      className="bg-indigo-800/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-700 shadow-xl mb-8"
    >
      <div className="flex items-center mb-4 pb-3 border-b border-indigo-600">
        {icon && <span className="mr-3 text-yellow-400 text-xl">{icon}</span>}
        <h3 className="text-xl font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </motion.div>
  )

  // List item component
  const ListItem = ({ children, icon, className = "" }) => (
    <div className={`flex items-start space-x-3 ${className}`}>
      {icon && <span className="text-yellow-400 mt-1 flex-shrink-0">{icon}</span>}
      <div className="text-gray-200">{children}</div>
    </div>
  )

  return (
    <>
      <NavBar />

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 -z-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(30, 27, 75, 0.5), rgba(88, 28, 135, 0.5))",
              "linear-gradient(45deg, rgba(88, 28, 135, 0.5), rgba(30, 27, 75, 0.5))",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        />

        {/* Floating Background Elements */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-40 right-20 w-24 h-24 bg-indigo-400/10 rounded-full blur-xl"
        />

        {/* Floating Music Notes */}
        <FloatingNote delay={0} x={10} y={20} />
        <FloatingNote delay={1} x={85} y={15} duration={4} />
        <FloatingNote delay={2} x={70} y={60} duration={3.5} />
        <FloatingNote delay={0.5} x={20} y={70} duration={4.5} />
      </div>

      <div className="min-h-screen text-white pt-24 pb-20 relative">
        <div className="container mx-auto px-4">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/"
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div
            className="bg-indigo-800/60 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl mb-12 border border-indigo-700"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col lg:flex-row">
              {/* Profile Image */}
              <div className="lg:w-1/3 relative p-8">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full border-4 border-yellow-400 shadow-2xl mx-auto max-w-sm">
                  <img
                    src={Victor || "/placeholder.svg"}
                    alt="Dr. C. Victor"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=400&width=400"
                    }}
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 text-yellow-400/30">
                  <Star className="h-8 w-8" />
                </div>
                <div className="absolute bottom-4 left-4 text-yellow-400/30">
                  <Heart className="h-6 w-6" />
                </div>
              </div>

              {/* Header Content */}
              <div className="lg:w-2/3 p-8 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
                    EVA.DR.C.VICTOR
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-yellow-400">EXODUS MUSIC MINISTRIES</h2>
                  <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
                    EFFECTIVELY COMMUNICATE THE WORD OF GOD THROUGH CHRISTHAVA KEERTHANAIKAI
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6 mt-8">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium">Ministry Leader</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Music className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium">80+ Songs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm font-medium">5 Countries</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column */}
            <div>
              <Section title="Profile" icon={<Users />}>
                <ListItem>
                  <div>
                    <p className="font-semibold text-yellow-400">FOUNDER & DIRECTOR</p>
                    <p className="text-gray-300">EXODUS MUSIC MINISTRIES</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="Contact Information" icon={<Phone />}>
                <ListItem icon={<Phone className="h-4 w-4" />}>
                  <p className="font-medium">99 444 51426</p>
                </ListItem>
                <ListItem icon={<Mail className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium">victorexodus2000@gmail.com</p>
                    <p className="font-medium">victorsingsgospel@gmail.com</p>
                  </div>
                </ListItem>
                <ListItem icon={<MapPin className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium">21 A GANAPATHY NAGAR,</p>
                    <p>KATTUPAKKAM CHENNAI 600056</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="Digital Presence" icon={<Globe />}>
                <ListItem icon={<Youtube className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium text-yellow-400">YouTube Channels:</p>
                    <p>• EXODUS MUSIC MINISTRIES</p>
                    <p>• EXODUS GOSPEL MINISTRIES</p>
                  </div>
                </ListItem>
                <ListItem icon={<Facebook className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium text-yellow-400">Facebook:</p>
                    <p>EXODUS EVANGELIST VICTOR</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="International Ministry" icon={<Globe />}>
                <ListItem>
                  <div>
                    <p className="font-medium text-yellow-400">Countries Visited:</p>
                    <p>USA • CANADA • MALAYSIA • SINGAPORE • SRILANKA</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="Music & Media" icon={<Music />}>
                <ListItem icon={<Music className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium text-yellow-400">Choirs:</p>
                    <p>WELL TRAINED KEERTHANAI CHOIR IN CHENNAI AND MADURAI</p>
                  </div>
                </ListItem>
                <ListItem icon={<Video className="h-4 w-4" />}>
                  <div>
                    <p className="font-medium text-yellow-400">Audio/Video Collection:</p>
                    <p>DEIVEEGA KEERTHANAIKAI VOL 1-6, 80 SONGS</p>
                  </div>
                </ListItem>
              </Section>
            </div>

            {/* Right Column */}
            <div>
              <Section title="Ministry Vision" icon={<Star />}>
                <ListItem>
                  <div>
                    <p className="font-semibold text-yellow-400">Mission:</p>
                    <p>REVIVING FORGOTTEN CHRISTIAN TAMIL KEERTHANAIGAL</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="Ministry Goals" icon={<Star />}>
                <ListItem>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-yellow-400">1. Music Documentation</p>
                      <p className="text-sm">
                        DOCUMENT OF THE ORIGINALLY SCORED MUSIC FOR THE LYRICS THAT IS AVAILABLE
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-yellow-400">2. Archive Creation</p>
                      <p className="text-sm">
                        TO COLLECT OLDER LYRIC BOOKS PRINTED AND PUBLISHED OVER THE LAST CENTURY IN INDIA AND SRILANKA
                        AND OTHER LOCATION FOR THE TAMIL DIASPORA AND INITIATE AN ARCHIVE FOR THIS PURPOSE
                      </p>
                    </div>
                  </div>
                </ListItem>
              </Section>

              <Section title="Ministry Highlights" icon={<Star />}>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "KEERTHANAI PERUVIZHAS",
                    "INTERNATIONAL CONFERENCES",
                    "CHURCH VISITS ALL OVER INDIA",
                    "KEERTHANAI SEMINAR IN UNIVERSITIES",
                    "KEERTHANAI CONVENTIONS",
                    "MUSIC WORKSHOP FOR CHURCH CHOIR & ORGANISTS",
                    "CHRISTIAN CARNATIC MUSIC CLASS ONLINE",
                    "YOU TUBE VIDEO KEERTHANAI LESSONS",
                  ].map((highlight, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-indigo-700/30"
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Star className="h-3 w-3 text-yellow-400 flex-shrink-0" />
                      <p className="text-sm font-medium">{highlight}</p>
                    </motion.div>
                  ))}
                </div>
              </Section>

              <Section title="Awards & Recognition" icon={<Award />}>
                <ListItem icon={<Award className="h-4 w-4" />}>
                  <div>
                    <p className="font-semibold text-yellow-400">KEERTHANAI KAVALAR</p>
                    <p className="text-sm text-gray-300">AWARD BY NEWYORK CHRISTHAVA TAMIL KOIL CONFERENCE - USA</p>
                  </div>
                </ListItem>
                <ListItem icon={<Award className="h-4 w-4" />}>
                  <div>
                    <p className="font-semibold text-yellow-400">ARUT KALAIMANANI</p>
                    <p className="text-sm text-gray-300">AWARD BY INTERNATIONAL CHRISTIAN TAMIL UNION</p>
                  </div>
                </ListItem>
              </Section>

              <Section title="Publications" icon={<Book />}>
                <ListItem icon={<Book className="h-4 w-4" />}>
                  <div>
                    <p className="font-semibold text-yellow-400">PALNOKKU PAARVAIYIL KIRISTHAVA KEERTHANAIKAI</p>
                    <p className="text-sm text-gray-300">A RESEARCH BOOK PUBLISHED 2021</p>
                  </div>
                </ListItem>
                <ListItem icon={<Book className="h-4 w-4" />}>
                  <div>
                    <p className="font-semibold text-yellow-400">
                      KIRISTHAVA KEERTHANAIKAI MUSIC BOOK & TAMILISAI PAYIRCHI KAIYEDU
                    </p>
                    <p className="text-sm text-gray-300">PUBLISHED, 2018</p>
                  </div>
                </ListItem>
              </Section>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-16 text-center"
          >
            <a href="/contact">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 10px 30px rgba(250, 204, 21, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-12 py-4 rounded-full text-xl font-bold tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                Contact Dr. Victor
              </motion.button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-indigo-950 border-t border-indigo-800 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  )
}

export default Portfolio
