import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import NavBar from '../components/NavNar';

const Home = () => {
  const controls = useAnimation();
  const { scrollYProgress } = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced parallax effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const missionY = useTransform(scrollYProgress, [0.1, 0.3], [150, 0]);
  const missionOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const eventsY = useTransform(scrollYProgress, [0.25, 0.45], [150, 0]);
  const eventsOpacity = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]);
  const testimonialRotate = useTransform(scrollYProgress, [0.4, 0.6], [-5, 0]);
  
  // Initial animation sequence
  useEffect(() => {
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, staggerChildren: 0.3 }
      });
    };
    
    sequence();
  }, [controls]);

  // Enhanced animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.7, 
        ease: [0.6, 0.05, 0.01, 0.9],
        delay: 0.7
      }
    },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    },
    tap: { scale: 0.95 }
  };

  // Advanced card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1 + 0.3,
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }),
    hover: { 
      y: -12,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  // Loading screen animation
  const loadingVariants = {
    hidden: { opacity: 1 },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const loadingTextVariants = {
    animate: {
      opacity: [0.3, 1, 0.3],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Content data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Church Member",
      quote: "Exodus Music Ministry has transformed our worship experience with their anointed music and genuine passion."
    },
    {
      name: "Pastor Michael Brown",
      role: "Lead Pastor",
      quote: "Their dedication to excellence in worship has helped our congregation connect with God on a deeper level."
    },
    {
      name: "David Williams",
      role: "Worship Leader",
      quote: "The passion and skill they bring to every performance is truly inspirational and uplifting."
    }
  ];

  const upcomingEvents = [
    {
      title: "Worship Night",
      date: "March 15, 2025",
      location: "Main Sanctuary",
      description: "An evening of praise and worship to lift our spirits and connect with God.",
      image: "worship-night.jpg"
    },
    {
      title: "Easter Concert",
      date: "April 5, 2025",
      location: "Community Hall",
      description: "Special resurrection celebration featuring our full choir and band.",
      image: "easter-concert.jpg"
    },
    {
      title: "Youth Worship Workshop",
      date: "April 20, 2025",
      location: "Youth Center",
      description: "Training and mentoring for young musicians and worship leaders.",
      image: "youth-workshop.jpg"
    }
  ];

  const missionPoints = [
    {
      icon: "✝️",
      title: "Spirit-Led Worship",
      description: "Leading worship that is anointed by the Holy Spirit and facilitates genuine encounters with God."
    },
    {
      icon: "🎵",
      title: "Musical Excellence",
      description: "Pursuing excellence in our musicianship as an offering to God and to inspire our congregation."
    },
    {
      icon: "👥",
      title: "Community Building",
      description: "Creating a supportive family of musicians who grow together spiritually and musically."
    }
  ];

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
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-20 h-20 mb-8 relative"
            >
              <div className="w-full h-full rounded-full border-t-4 border-b-4 border-yellow-400"></div>
              <div className="absolute inset-0 flex items-center justify-center text-yellow-400 text-4xl">
                ♪
              </div>
            </motion.div>
            <motion.h2 
              className="text-white text-xl font-bold"
              variants={loadingTextVariants}
              animate="animate"
            >
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
            y: heroY
          }}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 w-full h-full z-0">
            <div className="absolute inset-0 bg-indigo-950 opacity-60 z-10"></div>
            <motion.div
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full bg-[url('/src/assets/worship-bg.jpg')] bg-cover bg-center"
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
                  y: Math.random() * window.innerHeight 
                }}
                animate={{ 
                  y: [null, Math.random() * 100 - 50],
                  opacity: [0.2, 0.8, 0.2]
                }}
                transition={{ 
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 z-20 text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              variants={fadeInUp}
            >
              <span className="block tracking-widest">EXODUS</span>
              <motion.span 
                className="text-yellow-400 inline-block"
                animate={{ 
                  textShadow: ["0px 0px 0px rgba(250, 204, 21, 0)", "0px 0px 20px rgba(250, 204, 21, 0.5)", "0px 0px 0px rgba(250, 204, 21, 0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                MUSIC MINISTRY
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-8 text-indigo-100"
              variants={fadeInUp}
            >
              Bringing souls closer to God through the power of anointed music
            </motion.p>
            
            <motion.div
              className="flex flex-col md:flex-row justify-center gap-4"
              variants={fadeInUp}
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-8 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
              >
                Watch Latest Worship
              </motion.button>
              
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="bg-transparent border-2 border-white px-8 py-4 rounded-full text-lg font-bold tracking-wide"
              >
                Join Our Ministry
              </motion.button>
            </motion.div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <svg className="w-8 h-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </motion.section>

        {/* Our Mission Section */}
        <motion.section 
          className="py-32 bg-gradient-to-b from-indigo-950 to-indigo-900 overflow-hidden relative"
          style={{ y: missionY, opacity: missionOpacity }}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, index) => (
              <motion.div
                key={index}
                className="absolute rounded-full bg-yellow-400"
                style={{
                  width: (200 + index * 100) + 'px',
                  height: (200 + index * 100) + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  x: [0, 50, 0, -50, 0],
                  y: [0, 30, 0, -30, 0],
                }}
                transition={{
                  duration: 15 + index * 5,
                  repeat: Infinity,
                  ease: "easeInOut"
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
                To create a worship experience that draws people closer to God, develops musical excellence, and fosters spiritual growth through the ministry of music.
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
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Upcoming Events</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
            </motion.div>
            
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
                      <div className="w-full h-full bg-indigo-800 flex items-center justify-center">
                        <span className="text-5xl text-yellow-400">🎵</span>
                      </div>
                      <div className="absolute bottom-4 left-4 z-20">
                        <span className="bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold">
                          {event.date}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-yellow-400 transition-colors">{event.title}</h3>
                    <p className="text-indigo-200 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {event.location}
                    </p>
                    <p className="text-indigo-100 mb-6 text-lg">{event.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 py-3 rounded-full font-bold shadow-lg"
                    >
                      Learn More
                    </motion.button>
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
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
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
                    transition={{ duration: 6, repeat: Infinity }}
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
              animate={{ scale: [1, 1.05, 1], 
                         opacity: [0.5, 0.7, 0.5] 
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full bg-[url('/src/assets/worship-band.jpg')] bg-cover bg-center"
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
                Whether you sing, play an instrument, or have technical skills, there's a place for you in Exodus Music Ministry.
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
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 0.7, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeOut"
              }}
            >
              {['♪', '♫', '♬', '♩'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </motion.section>

        {/* Footer */}
        <footer className="bg-indigo-950 py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-center mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-bold tracking-wider"
              >
                <motion.span 
                  className="text-yellow-400"
                  whileHover={{ 
                    textShadow: "0px 0px 8px rgba(250, 204, 21, 0.7)",
                    scale: 1.05
                  }}
                >
                  EXODUS
                </motion.span> 
                <motion.span 
                  className="ml-2"
                  whileHover={{ scale: 1.05 }}
                >
                  MUSIC
                </motion.span>
              </motion.div>
            </div>
            
            <div className="flex justify-center space-x-8 mb-12">
              {[
                { name: "Facebook", icon: "fab fa-facebook-f" },
                { name: "Instagram", icon: "fab fa-instagram" },
                { name: "YouTube", icon: "fab fa-youtube" },
                { name: "Twitter", icon: "fab fa-twitter" }
              ].map((social, index) => (
                <motion.a
                  key={social.name}
                  href="#"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.2, 
                    color: "#FBBF24",
                    y: -5
                  }}
                  className="text-gray-400 hover:text-white transition-colors w-12 h-12 rounded-full bg-indigo-800 flex items-center justify-center border border-indigo-700"
                >
                  {social.name.charAt(0)}
                </motion.a>
              ))}
            </div>
            
            <motion.div 
              className="text-center text-indigo-300 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p>© 2025 Exodus Music Ministry. All rights reserved.</p>
              <p className="mt-2">Bringing God's people together through music</p>
            </motion.div>
          </div>
          
          {/* Footer background animation */}
          <div className="absolute inset-0 z-0 opacity-10">
            <motion.div
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "linear"
              }}
              className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-indigo-600 to-indigo-800"
              style={{ backgroundSize: '400% 400%' }}
            />
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;