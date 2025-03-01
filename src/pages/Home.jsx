import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { Menu, X, Music, Calendar, Users, PlayCircle, ChevronDown } from 'lucide-react';
import React from 'react';

const Home = () => {
  // NavBar state
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Animation refs and hooks
  const aboutRef = useRef(null);
  const isAboutInView = useInView(aboutRef, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Handle scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Music', href: '#music' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5 
      } 
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      x: '100%',
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    },
    open: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen">
      {/* NavBar - Integrated directly into Home component */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center space-x-2"
          >
            <Music className="h-8 w-8 text-primary" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Exodus Music Ministry
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex space-x-8"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 top-16 bg-white/98 backdrop-blur-md md:hidden z-40 flex flex-col"
            >
              <div className="flex flex-col items-center justify-center space-y-6 pt-10">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 + 0.2 } 
                    }}
                    exit={{ 
                      opacity: 0,
                      y: 20,
                      transition: { delay: (navLinks.length - index) * 0.05 } 
                    }}
                    onClick={() => setIsOpen(false)}
                    className="text-xl font-medium text-gray-700 hover:text-primary py-2"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        id="home"
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
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
                className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-primary/50 hover:bg-primary/90 transition-all"
                >
                Upcoming Events
            </motion.a>
            <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#music"
                className="px-8 py-3 bg-white text-primary font-medium rounded-full shadow-lg hover:shadow-white/50 hover:bg-gray-50 transition-all"
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
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={aboutRef}
            variants={staggerContainer}
            initial="hidden"
            animate={isAboutInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
            >
              About Our Ministry
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg text-gray-600 mb-10"
            >
              Exodus Music Ministry is dedicated to creating an atmosphere of worship where people can encounter God through music. Our mission is to lead people into God's presence through anointed praise and worship.
            </motion.p>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-3 gap-8"
            >
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
                  description: "Join us for our weekly worship service led by the Exodus Music Ministry team."
                },
                {
                  title: "Night of Worship",
                  date: "June 15, 2024, 7:00 PM",
                  location: "Community Hall",
                  description: "A special evening dedicated to extended worship and prayer."
                },
                {
                  title: "Worship Workshop",
                  date: "July 10, 2024, 6:00 PM",
                  location: "Music Room",
                  description: "Learn worship techniques and grow your musical skills with our team."
                }
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

      {/* Music Section - New Section */}
      <section id="music" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Music</h2>
              <p className="text-lg text-white/80">Listen to our latest worship songs and recordings</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              className="grid md:grid-cols-2 gap-8"
            >
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-all"
                >
                  <div className="aspect-video rounded-lg bg-black/30 mb-4 overflow-hidden relative group">
                    <img 
                      src={`/placeholder.svg?height=720&width=1280&text=Music+Video+${item}`}
                      alt={`Music video ${item}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/20 backdrop-blur-sm p-4 rounded-full"
                      >
                        <PlayCircle className="h-10 w-10 text-white" />
                      </motion.button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Worship Song Title {item}</h3>
                  <p className="text-white/70 mb-3">Album: Exodus Worship Vol. {item}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">3:45</span>
                    <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:text-primary transition-colors"
                        >
                        <PlayCircle className="h-5 w-5" />
                    </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center mt-10">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="px-8 py-3 bg-white text-primary font-medium rounded-full shadow-lg hover:shadow-white/50 inline-block transition-all"
              >
                View All Music
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section - New Section */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Gallery</h2>
              <p className="text-lg text-gray-600">Moments captured during our worship services and events</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {[...Array(6)].map((_, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="overflow-hidden rounded-xl shadow-md aspect-square"
                >
                  <img 
                    src={`/placeholder.svg?height=600&width=600&text=Gallery+${index + 1}`}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={fadeInUp} className="text-center mt-10">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#"
                className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg hover:shadow-primary/50 inline-block transition-all"
              >
                View Full Gallery
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section - New Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Contact Us</h2>
              <p className="text-lg text-gray-600">Get in touch with our ministry team</p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <motion.div variants={fadeInUp} className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Get In Touch</h3>
                <p className="text-gray-600">
                  Have questions about our ministry or interested in joining our team? 
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Service Times</h4>
                      <p className="text-gray-600">Sundays at 10:00 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Ministry Practice</h4>
                      <p className="text-gray-600">Wednesdays at 7:00 PM</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp}>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </div>
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
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Join Our Ministry
            </motion.h2>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl mb-10 text-white/90"
            >
              Are you passionate about worship and music? We're always looking for dedicated musicians and vocalists to join our team.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
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

      {/* Footer */}
      <footer className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Music className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Exodus Music
                </span>
              </div>
              <p className="text-white/70 mb-6">
                Inspiring worship through music and praise. Join us in creating an atmosphere of worship where people can encounter God.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-white/70 hover:text-primary transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Ministry</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors">
                    Worship Team
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors">
                    Vocalists
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors">
                    Musicians
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors">
                    Sound & Media
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-primary transition-colors">
                    Join the Team
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
              <p className="text-white/70 mb-4">
                Subscribe to our newsletter to get updates on events and new music releases.
              </p>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="px-4 py-2 rounded-l-lg w-full focus:outline-none text-gray-800"
                />
                <button 
                  type="submit" 
                  className="bg-primary px-4 py-2 rounded-r-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/50">
            <p>© {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
