import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // Animation variants
  const logoVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut" 
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: i => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const mobileMenuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  // Toggle mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav 
      initial="hidden"
      animate="visible"
      className={`fixed w-full z-50 ${
        scrolled 
          ? "bg-black bg-opacity-90 text-white shadow-lg py-2" 
          : "bg-transparent text-white py-4"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          variants={logoVariants}
          className="flex items-center"
        >
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl md:text-3xl font-bold tracking-wider"
            >
              <span className="text-yellow-400">EXODUS</span> 
              <span className="ml-2">MUSIC</span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.title}
              custom={index}
              variants={navItemVariants}
              whileHover={{ scale: 1.1, color: "#FBBF24" }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to={link.path} className="font-medium tracking-wide hover:text-yellow-400 transition-colors">
                {link.title}
              </Link>
            </motion.div>
          ))}
          <motion.button
            variants={navItemVariants}
            custom={navLinks.length}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold tracking-wide hover:bg-yellow-500 transition-colors"
          >
            Donate
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.div 
          className="md:hidden"
          variants={navItemVariants}
          custom={navLinks.length}
        >
          <button 
            onClick={toggleMenu} 
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="w-8 h-8 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 8 }
                }}
                className="w-6 h-0.5 bg-white mb-1.5 block"
              ></motion.span>
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 }
                }}
                className="w-6 h-0.5 bg-white mb-1.5 block"
              ></motion.span>
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -8 }
                }}
                className="w-6 h-0.5 bg-white block"
              ></motion.span>
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden bg-black bg-opacity-95 absolute top-full left-0 right-0 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.title}
                  variants={mobileItemVariants}
                  className="py-3 border-b border-gray-800"
                >
                  <Link 
                    to={link.path} 
                    className="block font-medium text-lg hover:text-yellow-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={mobileItemVariants}
                className="py-4"
              >
                <button className="w-full bg-yellow-400 text-black py-3 rounded-full font-bold tracking-wide hover:bg-yellow-500 transition-colors">
                  Donate
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;