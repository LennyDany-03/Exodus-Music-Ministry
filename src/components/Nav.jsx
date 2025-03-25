import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  // Navigation links
  const navLinks = [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Events", path: "/events" },
    { title: "Gallery", path: "/gallery" },
    { title: "Music", path: "/music" },
    { title: "Contact", path: "/contact" }
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on window resize to prevent layout issues
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.4,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    })
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.4,
        ease: [0.6, 0.05, 0.01, 0.9],
        staggerChildren: 0.1,
        delayChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: [0.6, 0.05, 0.01, 0.9]
      } 
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen
          ? "bg-indigo-900/90 backdrop-blur-md shadow-lg py-3" 
          : "bg-transparent py-4 md:py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center">
        {/* Logo - REDUCED FONT SIZE */}
        <motion.div 
          variants={logoVariants}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center" onClick={() => setActiveLink('/')}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-bold tracking-tight flex flex-wrap items-center"
            >
              <span className="text-base xs:text-lg sm:text-xl md:text-2xl text-yellow-400">EXODUS</span> 
              <span className="ml-1 text-base xs:text-lg sm:text-xl md:text-2xl text-white">MUSIC</span>
              <span className="ml-1 text-base xs:text-lg sm:text-xl md:text-2xl text-white">MINISTRIES</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-10">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.title}
              custom={index}
              variants={navItemVariants}
            >
              <Link 
                to={link.path} 
                className={`text-sm lg:text-base font-medium tracking-wide transition-all duration-300 relative ${
                  activeLink === link.path 
                    ? "text-yellow-400" 
                    : "text-gray-300 hover:text-yellow-400"
                }`}
                onClick={() => setActiveLink(link.path)}
              >
                {link.title}
                {activeLink === link.path && (
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 flex justify-center"
                    layoutId="activeNavLine"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="text-yellow-400 text-xs">♪</span>
                  </motion.div>
                )}
              </Link>
            </motion.div>
          ))}
          <a href="/donate">
            <motion.button
              variants={navItemVariants}
              custom={navLinks.length}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0px 0px 15px rgba(250, 204, 21, 0.5)" 
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-black px-4 lg:px-6 py-2 rounded-full text-sm lg:text-base font-medium transition-all duration-300 shadow-md hover:from-yellow-400 hover:to-yellow-300"
            >
              Donate
            </motion.button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <motion.div 
          className="md:hidden"
          variants={navItemVariants}
          custom={navLinks.length}
        >
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none text-yellow-400 p-2"
            aria-label="Toggle Menu"
          >
            <svg 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${isOpen ? "hidden" : "block"}`}
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <svg 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              stroke="currentColor" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className={`${isOpen ? "block" : "hidden"}`}
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu - CENTERED */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-indigo-900/95 backdrop-blur-md overflow-hidden border-t border-indigo-800"
          >
            {/* Mobile Logo - Centered */}
            
            <div className="container mx-auto px-4 py-3">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  variants={mobileItemVariants}
                  className="py-2 border-b border-indigo-800 last:border-b-0 text-center"
                >
                  <Link 
                    to={link.path} 
                    className={`block font-medium text-base ${
                      activeLink === link.path 
                        ? "text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                    onClick={() => {
                      setActiveLink(link.path);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {activeLink === link.path && <span className="text-yellow-400 mr-2">♪</span>}
                      {link.title}
                    </div>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={mobileItemVariants}
                className="py-3"
              >
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-2 rounded-full font-medium shadow-md"
                >
                  Donate
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom border on scroll */}
      {scrolled && (
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px bg-indigo-400/20"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      )}
    </motion.nav>
  );
};

export default NavBar;