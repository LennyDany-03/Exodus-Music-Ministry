import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Youtube, Facebook, Mail, Phone, MapPin, Award, Book, Music, Video, Globe } from 'lucide-react';

import NavBar from '../components/Nav';
import Victor from '../assets/Victor1.jpg'

const Portfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // Section component for consistent styling
  const Section = ({ title, children, icon, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center mb-3 border-b border-teal-700 pb-2">
        {icon && <span className="mr-2 text-yellow-400">{icon}</span>}
        <h3 className="text-xl font-bold uppercase tracking-wider">{title}</h3>
      </div>
      <div className="pl-1">{children}</div>
    </motion.div>
  );

  // List item component
  const ListItem = ({ children, icon, className = "" }) => (
    <div className={`flex items-start mb-3 ${className}`}>
      {icon && <span className="mr-2 text-yellow-400 mt-1 flex-shrink-0">{icon}</span>}
      <div>{children}</div>
    </div>
  );

  return (
    <>
      <NavBar />
      <div className="bg-gradient-to-b from-teal-950 to-indigo-950 min-h-screen text-white pt-24 pb-20">
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
              className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header Section */}
          <motion.div 
            className="bg-teal-900 rounded-xl overflow-hidden shadow-2xl mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Profile Image */}
              <div className="md:w-1/3 lg:w-1/4 relative">
                <div className="aspect-square overflow-hidden bg-white rounded-full m-6 md:m-8 border-4 border-white shadow-lg">
                  <img 
                    src= {Victor}
                    alt="Dr. C. Victor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-0 right-0 bottom-0 hidden md:block">
                  <svg viewBox="0 0 100 100" className="h-full">
                    <path d="M0,0 L100,0 L0,100 Z" fill="white" opacity="0.1" />
                  </svg>
                </div>
              </div>

              {/* Header Content */}
              <div className="md:w-2/3 lg:w-3/4 p-6 md:p-8 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">EVA.DR.C.VICTOR</h1>
                  <h2 className="text-xl md:text-2xl font-medium mb-4">EXODUS MUSIC MINISTRIES</h2>
                  <p className="text-sm md:text-base text-teal-100 max-w-2xl">
                    EFFECTIVELY COMMUNICATE THE WORD OF GOD THROUGH CHRISTHAVA KEERTHANAIKAI
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div>
              <Section title="Profile" icon={<span className="text-lg">👤</span>} delay={0.1}>
                <ListItem>
                  <p className="font-medium">FOUNDER & DIRECTOR</p>
                  <p>EXODUS MUSIC MINISTRIES</p>
                </ListItem>
              </Section>

              <Section title="Contacts" icon={<Phone className="h-5 w-5" />} delay={0.2}>
                <ListItem>
                  <p className="font-medium">99 444 51426</p>
                </ListItem>
              </Section>

              <Section title="You Tube Channels" icon={<Youtube className="h-5 w-5" />} delay={0.3}>
                <ListItem>
                  <p className="font-medium">EXODUS MUSIC MINISTRIES</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">EXODUS GOSPEL MINISTRIES</p>
                </ListItem>
              </Section>

              <Section title="Face Book" icon={<Facebook className="h-5 w-5" />} delay={0.4}>
                <ListItem>
                  <p className="font-medium">EXODUS EVANGELIST VICTOR</p>
                </ListItem>
              </Section>

              <Section title="E Mails" icon={<Mail className="h-5 w-5" />} delay={0.5}>
                <ListItem>
                  <p className="font-medium">victorexodus2000@gmail.com</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">victorsingsgospel@gmail.com</p>
                </ListItem>
              </Section>

              <Section title="Country Visit" icon={<Globe className="h-5 w-5" />} delay={0.6}>
                <ListItem>
                  <p className="font-medium">USA, CANADA, MALAYSIA</p>
                  <p>SINGAPORE, SRILANKA</p>
                </ListItem>
              </Section>

              <Section title="Choirs" icon={<Music className="h-5 w-5" />} delay={0.7}>
                <ListItem>
                  <p className="font-medium">WELL TRAINED KEERTHANAI</p>
                  <p>CHOIR IN CHENNAI AND MADURAI</p>
                </ListItem>
              </Section>

              <Section title="Audio, Video CD&PENDRIVES" icon={<Video className="h-5 w-5" />} delay={0.8}>
                <ListItem>
                  <p className="font-medium">DEIVEEGA KEERTHANAIKAI</p>
                  <p>VOL 1-6, 80 SONGS</p>
                </ListItem>
              </Section>

              <Section title="Address" icon={<MapPin className="h-5 w-5" />} delay={0.9}>
                <ListItem>
                  <p className="font-medium">21 A GANAPATHY NAGAR,</p>
                  <p>KATTUPAKKAM CHENNAI 600056</p>
                </ListItem>
              </Section>
            </div>

            {/* Right Column */}
            <div>
              <Section title="Ministry Vision" icon={<span className="text-lg">👁️</span>} delay={0.1}>
                <ListItem>
                  <p className="font-medium">REVIVING FORGOTTEN CHRISTIAN TAMIL</p>
                  <p>KEERTHANAIGAL</p>
                </ListItem>
              </Section>

              <Section title="Ministry Goals" icon={<span className="text-lg">🎯</span>} delay={0.2}>
                <ListItem>
                  <p className="text-sm md:text-base">
                    1. DOCUMENT OF THE ORIGINALLY SCORED MUSIC FOR THE LYRICS THAT IS AVAILABLE
                  </p>
                  <p className="text-sm md:text-base mt-2">
                    2.TO COLLECT OLDER LYRIC BOOKS PRINTED AND PUBLISHED OVER THE LAST CENTURY IN INDIA ANS SRILANKA AND OTHER LOCATION FORTHE TAMIL DIASPORA AND INITIATE A ARCHIVEFOR THIS PURPOSE
                  </p>
                </ListItem>
              </Section>

              <Section title="Ministry Highlights" icon={<span className="text-lg">✨</span>} delay={0.3}>
                <ListItem>
                  <p className="font-medium">KEERTHANAI PERUVIZHAS</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">INTERNATIONAL CONFERENCES</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">CHURCH VISITS ALL OVER INDIA</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">KEERTHANAI SEMINAR IN UNIVERSITIES</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">KEERTHANAI CONVENTIONS</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">MUSIC WORKSHOP FOR CHURCH CHOIR & ORGANISTS</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">CHRISTIAN CARNATIC MUSIC CLASS ONLINE</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">YOU TUBE VIDEO KEERTHANAI LESSONS</p>
                </ListItem>
              </Section>

              <Section title="Awards" icon={<Award className="h-5 w-5" />} delay={0.4}>
                <ListItem>
                  <p className="font-medium">KEERTHANAI KAVALAR</p>
                  <p className="text-sm text-teal-200">AWARD BY NEWYORK CHRISTHAVA TAMIL KOIL CONFERENCE -USA</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">ARUT KALAIMANANI</p>
                  <p className="text-sm text-teal-200">AWARD BY INTERNATIONAL CHRISTIAN TAMIL UNION</p>
                </ListItem>
              </Section>

              <Section title="Books" icon={<Book className="h-5 w-5" />} delay={0.5}>
                <ListItem>
                  <p className="font-medium">PALNOKKU PAARVAIYIL KIRISTHAVA KEERTHANAIKAI</p>
                  <p className="text-sm text-teal-200">A RESEARCH BOOK PUBLISHED 2021</p>
                </ListItem>
                <ListItem>
                  <p className="font-medium">KIRISTHAVA KEERTHANAIKAI MUSIC BOOK & TAMILISAI PAYIRCHI KAIYEDU</p>
                  <p className="text-sm text-teal-200">PUBLISHED, 2018</p>
                </ListItem>
              </Section>
            </div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="mt-16 text-center"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-teal-950 px-10 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
              >
                Contact Dr. Victor
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-teal-950 py-8">
        <div className="container mx-auto px-4 text-center text-teal-300 text-sm">
          <p>© {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Portfolio;
