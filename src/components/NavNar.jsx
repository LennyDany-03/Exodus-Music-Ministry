"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { Menu, X, Music, ChevronDown } from "lucide-react"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef(null)
  const { scrollY } = useScroll()

  // Animation values based on scroll
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  )
  
  const navTextColor = useTransform(
    scrollY,
    [0, 100],
    ["rgb(255, 255, 255)", "rgb(55, 65, 81)"]
  )
  
  const navShadow = useTransform(
    scrollY,
    [0, 100],
    ["0px 0px 0px rgba(0, 0, 0, 0)", "0px 4px 20px rgba(0, 0, 0, 0.1)"]
  )

  // Update scrolled state
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50)
  })

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setActiveSection(sectionId)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Music", href: "#music" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ]

  // Animation variants
  const logoVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1, 
      transition: { 
        type: "spring",
        stiffness: 100, 
        delay: 0.2 
      } 
    }
  }

  const navVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.4, 
        duration: 0.5 
      } 
    },
  }

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    },
  }

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { 
        duration: 0.3,
        opacity: { duration: 0.2 }
      } 
    },
    open: { 
      opacity: 1,
      height: "100vh",
      transition: { 
        duration: 0.4,
        opacity: { duration: 0.3, delay: 0.1 }
      } 
    }
  }
  
  const mobileItemVariants = {
    closed: { 
      opacity: 0, 
      x: 100
    },
    open: i => ({ 
      opacity: 1, 
      x: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 150,
        damping: 20
      }
    })
  }

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ 
        backgroundColor: navBackground,
        boxShadow: navShadow 
      }}
      className="fixed w-full z-50 py-4 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center space-x-2"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Music className="h-8 w-8 text-primary" />
          </motion.div>
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Exodus Music Ministry
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div 
          className="hidden md:flex space-x-4 items-center"
          variants={navVariants}
          initial="hidden"
          animate="visible"
        >
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              variants={itemVariants}
              style={{ color: scrolled ? undefined : navTextColor }}
              className={`relative px-3 py-2 rounded-md font-medium transition-colors ${
                activeSection === link.href.substring(1) 
                  ? "text-primary" 
                  : scrolled ? "text-gray-700 hover:text-primary" : "hover:text-primary"
              }`}
            >
              {link.name}
              {activeSection === link.href.substring(1) && (
                <motion.div
                  layoutId="navbar-active-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ml-4 px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
          >
            Join Us
          </motion.a>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
          style={{ color: scrolled ? "rgb(55, 65, 81)" : navTextColor }}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
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
            className="fixed inset-x-0 top-16 bg-gradient-to-b from-white to-primary/5 backdrop-blur-lg md:hidden z-40 overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center space-y-2 py-10 h-full">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  custom={index}
                  variants={mobileItemVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  onClick={() => setIsOpen(false)}
                  className={`relative text-xl font-medium py-4 px-8 rounded-lg ${
                    activeSection === link.href.substring(1)
                      ? "text-primary bg-primary/10"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5"
                  } transition-colors`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{link.name}</span>
                    {activeSection === link.href.substring(1) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <ChevronDown className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>
                </motion.a>
              ))}
              
              <motion.div
                custom={navLinks.length}
                variants={mobileItemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-6 pt-6 border-t border-gray-100 w-4/5"
              >
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#contact"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center py-3 px-8 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Join Our Ministry
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavBar