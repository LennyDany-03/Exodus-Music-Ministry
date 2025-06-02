"use client"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"

// Import images
import TeamPhoto from "../assets/Team Photo.jpg"
import TeamSecondPhoto from "../assets/Team @.jpg"
import Victor from "../assets/Victor1.jpg"
import Team3rdPhoto from "../assets/Team3rdPhoto.jpg"
import SundayEve from "../assets/SundayEVE.png"
import Gospel from "../assets/GospelPoster.jpg"
import Centenary from "../assets/Centenary.jpg"
import Thumb1 from "../assets/Thumb1.jpg"
import Thumb2 from "../assets/Thumb2.jpg"
import Thumb3 from "../assets/Thumb3.jpg"

const Gallery = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [layout, setLayout] = useState("grid") // grid, masonry, or carousel
  const [scrollY, setScrollY] = useState(0)
  const galleryRef = useRef(null)

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const galleryY = useTransform(scrollYProgress, [0.1, 0.2], [50, 0])

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoadingImages(true)
      try {
        const { data, error } = await supabase.from("images").select("*").order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching images:", error)
          throw error
        }

        // Default images to ensure we always have content
        const defaultImages = [
          {
            id: "default-1",
            src: TeamPhoto,
            alt: "Team Photo",
            category: "team",
            description: "Exodus Music Ministry team gathered for a group photo",
            featured: true,
          },
          {
            id: "default-2",
            src: TeamSecondPhoto,
            alt: "Team Second Photo",
            category: "team",
            description: "Our worship team after a successful event",
            featured: false,
          },
          {
            id: "default-3",
            src: Victor,
            alt: "Dr. Victor",
            category: "team",
            description: "Dr. Victor, founder and director of Exodus Music Ministry",
            featured: true,
          },
          {
            id: "default-4",
            src: Team3rdPhoto,
            alt: "Team Third Photo",
            category: "team",
            description: "The ministry team during a practice session",
            featured: false,
          },
          {
            id: "default-5",
            src: SundayEve,
            alt: "Sunday Evening Service",
            category: "worship",
            description: "Special Sunday evening worship service at Mylapore",
            featured: true,
          },
          {
            id: "default-6",
            src: Gospel,
            alt: "Gospel Musical Night",
            category: "concerts",
            description: "Gospel Musical Night event in Madurai",
            featured: false,
          },
          {
            id: "default-7",
            src: Centenary,
            alt: "Centenary Celebration",
            category: "worship",
            description: "Centenary celebration at IELC Ayanavaram",
            featured: true,
          },
          {
            id: "default-8",
            src: Thumb1,
            alt: "Worship Session",
            category: "worship",
            description: "Worship session led by our talented musicians",
            featured: false,
          },
          {
            id: "default-9",
            src: Thumb2,
            alt: "Praise Night",
            category: "concerts",
            description: "Annual praise night celebration",
            featured: true,
          },
          {
            id: "default-10",
            src: Thumb3,
            alt: "Youth Worship",
            category: "worship",
            description: "Youth-led worship service",
            featured: false,
          },
        ]

        if (data && data.length > 0) {
          // Transform the data to match our gallery image format
          const transformedData = data.map((img) => ({
            id: img.id,
            src: img.image_url,
            alt: img.alt_text || img.title,
            category: img.category,
            description: img.description,
            featured: Math.random() > 0.5, // Randomly set some as featured
          }))

          // Combine uploaded images with default images
          setGalleryImages([...transformedData, ...defaultImages])
        } else {
          // If no images found, use default images
          setGalleryImages(defaultImages)
        }
      } catch (error) {
        console.error("Error in fetchImages:", error)
        // Fallback to default images on error
        setGalleryImages([
          {
            id: "default-1",
            src: TeamPhoto,
            alt: "Team Photo",
            category: "team",
            description: "Exodus Music Ministry team gathered for a group photo",
            featured: true,
          },
          {
            id: "default-2",
            src: TeamSecondPhoto,
            alt: "Team Second Photo",
            category: "team",
            description: "Our worship team after a successful event",
            featured: false,
          },
          {
            id: "default-3",
            src: Victor,
            alt: "Dr. Victor",
            category: "team",
            description: "Dr. Victor, founder and director of Exodus Music Ministry",
            featured: true,
          },
          {
            id: "default-4",
            src: Team3rdPhoto,
            alt: "Team Third Photo",
            category: "team",
            description: "The ministry team during a practice session",
            featured: false,
          },
          {
            id: "default-5",
            src: SundayEve,
            alt: "Sunday Evening Service",
            category: "worship",
            description: "Special Sunday evening worship service at Mylapore",
            featured: true,
          },
          {
            id: "default-6",
            src: Gospel,
            alt: "Gospel Musical Night",
            category: "concerts",
            description: "Gospel Musical Night event in Madurai",
            featured: false,
          },
          {
            id: "default-7",
            src: Centenary,
            alt: "Centenary Celebration",
            category: "worship",
            description: "Centenary celebration at IELC Ayanavaram",
            featured: true,
          },
          {
            id: "default-8",
            src: Thumb1,
            alt: "Worship Session",
            category: "worship",
            description: "Worship session led by our talented musicians",
            featured: false,
          },
          {
            id: "default-9",
            src: Thumb2,
            alt: "Praise Night",
            category: "concerts",
            description: "Annual praise night celebration",
            featured: true,
          },
          {
            id: "default-10",
            src: Thumb3,
            alt: "Youth Worship",
            category: "worship",
            description: "Youth-led worship service",
            featured: false,
          },
        ])
      } finally {
        setIsLoadingImages(false)
        setTimeout(() => setIsLoading(false), 1500) // Add a slight delay for the loading animation
      }
    }

    fetchImages()
  }, [])

  // Filter images based on active category and search query
  const filteredImages = galleryImages.filter((img) => {
    const matchesCategory = activeCategory === "all" || img.category === activeCategory
    const matchesSearch =
      searchQuery === "" ||
      img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      img.description.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Get featured images
  const featuredImages = galleryImages.filter((img) => img.featured).slice(0, 5)

  // Open lightbox with selected image
  const openLightbox = (image) => {
    setCurrentImage(image)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = "auto"
  }

  // Navigate through images in lightbox
  const navigateImage = (direction) => {
    if (!currentImage) return

    const currentIndex = filteredImages.findIndex((img) => img.id === currentImage.id)
    if (currentIndex === -1) return

    let newIndex
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length
    }

    setCurrentImage(filteredImages[newIndex])
  }

  // Animation variants
  const fadeInUp = {
    hidden: { y: 60 },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  }

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.8 },
    visible: (i) => ({
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    }),
    hover: {
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.3 },
    },
  }

  // Loading screen animation
  const loadingVariants = {
    hidden: {},
    exit: {
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

  // Gallery categories
  const categories = [
    { id: "all", name: "All Photos", icon: "🖼️" },
    { id: "worship", name: "Worship Events", icon: "🎵" },
    { id: "team", name: "Team Photos", icon: "👥" },
    { id: "concerts", name: "Concerts", icon: "🎤" },
    { id: "behind", name: "Behind the Scenes", icon: "🎬" },
  ]

  // Layout options
  const layouts = [
    { id: "grid", name: "Grid", icon: "▣" },
    { id: "masonry", name: "Masonry", icon: "▦" },
    { id: "carousel", name: "Carousel", icon: "◎" },
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

      <div className="bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white min-h-screen">
        {/* Hero Header */}
        <motion.header
          className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden"
          style={{ scale: headerScale }}
        >
          {/* Background Image with Parallax Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${TeamPhoto})`,
              transform: `translateY(${scrollY * 0.3}px)`,
              filter: "brightness(0.4)",
            }}
          />

          {/* Floating Music Notes */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-yellow-400 text-2xl md:text-4xl"
                initial={{
                  x: Math.random() * 100 + "%",
                  y: Math.random() * 100 + "%",
                  opacity: 0.3 + Math.random() * 0.7,
                }}
                animate={{
                  y: [null, Math.random() * -200 - 100],
                  opacity: [null, 0],
                  rotate: [0, Math.random() * 360],
                }}
                transition={{
                  duration: 5 + Math.random() * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeOut",
                  delay: Math.random() * 5,
                }}
              >
                {["♪", "♫", "♬", "♩"][Math.floor(Math.random() * 4)]}
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">MOMENTS OF</span>
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
                WORSHIP
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl max-w-2xl mx-auto text-indigo-100 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Capturing our journey of faith, fellowship, and ministry through the years
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button
                onClick={() => galleryRef.current.scrollIntoView({ behavior: "smooth" })}
                className="bg-yellow-400 text-indigo-950 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explore Gallery
              </button>
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
        </motion.header>

        {/* Featured Images Carousel */}
        <motion.section
          className="py-16 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-2 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Featured Moments
            </motion.h2>
            <motion.div
              className="w-20 h-1 bg-yellow-400 mx-auto mb-12"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />

            {/* Horizontal Scroll Carousel */}
            <div className="relative">
              <div className="overflow-x-auto pb-8 hide-scrollbar">
                <div className="flex space-x-6 px-4 w-max">
                  {featuredImages.map((image, index) => (
                    <motion.div
                      key={image.id}
                      className="flex-shrink-0 w-[280px] md:w-[350px] relative group cursor-pointer"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      onClick={() => openLightbox(image)}
                      whileHover={{ y: -10 }}
                    >
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] shadow-xl">
                        <img
                          src={image.src || "/placeholder.svg"}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

                        <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-xl font-bold text-white">{image.alt}</h3>
                          <p className="text-sm text-indigo-200 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {image.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-indigo-950 to-transparent pointer-events-none" />
              <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-indigo-950 to-transparent pointer-events-none" />
            </div>
          </div>
        </motion.section>

        {/* Main Gallery Section */}
        <motion.section
          ref={galleryRef}
          className="py-20 bg-gradient-to-b from-indigo-950/50 to-indigo-900/50 backdrop-blur-sm relative"
          style={{ y: galleryY }}
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <svg
              className="absolute -top-20 -right-20 text-yellow-400/5 w-64 h-64"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path
                d="M44.5,-76.3C59.3,-69.9,74,-60.5,83.4,-46.6C92.8,-32.7,96.9,-14.3,94.1,2.8C91.3,19.9,81.6,35.6,69.8,48.5C58,61.4,44.1,71.3,28.8,76.3C13.6,81.3,-3.1,81.3,-18.9,76.8C-34.8,72.3,-49.8,63.3,-62.8,50.6C-75.8,37.9,-86.7,21.5,-89.7,3.1C-92.6,-15.4,-87.5,-35.8,-76.3,-51.5C-65.1,-67.2,-47.8,-78.1,-30.8,-83.1C-13.8,-88.1,2.9,-87.2,18.4,-82.7C33.9,-78.2,29.7,-82.7,44.5,-76.3Z"
                transform="translate(100 100)"
              />
            </svg>
            <svg
              className="absolute -bottom-20 -left-20 text-yellow-400/5 w-64 h-64"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              <path
                d="M47.7,-73.2C62.1,-66.3,74.5,-53.9,79.8,-39.2C85.1,-24.5,83.3,-7.4,79.5,8.3C75.7,24,69.8,38.3,60.1,49.7C50.4,61.1,36.8,69.5,22.5,73.8C8.1,78.1,-7,78.3,-20.8,73.9C-34.5,69.5,-46.9,60.5,-57.3,48.8C-67.7,37.1,-76.1,22.7,-78.9,7C-81.7,-8.7,-78.9,-25.6,-70.2,-38.7C-61.5,-51.8,-46.9,-61,-32.5,-67.8C-18.1,-74.7,-4,-79.2,9.7,-79.1C23.4,-79,37.3,-80.1,47.7,-73.2Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Photo Gallery</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
              <p className="text-lg max-w-3xl mx-auto text-indigo-100 mb-8">
                Browse through our collection of photos showcasing our ministry's journey of worship and fellowship
              </p>

              {/* Search and Filter Controls */}
              <div className="max-w-4xl mx-auto mb-12">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  {/* Search Input */}
                  <div className="relative w-full md:w-auto flex-grow max-w-md">
                    <input
                      type="text"
                      placeholder="Search gallery..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-indigo-800/40 border border-indigo-700 rounded-full py-3 px-5 pl-12 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>

                  {/* Layout Toggle */}
                  <div className="flex items-center space-x-2 bg-indigo-800/40 border border-indigo-700 rounded-full p-1">
                    {layouts.map((layoutOption) => (
                      <button
                        key={layoutOption.id}
                        onClick={() => setLayout(layoutOption.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                          layout === layoutOption.id
                            ? "bg-yellow-400 text-indigo-950"
                            : "text-indigo-200 hover:text-white"
                        }`}
                      >
                        <span className="mr-1">{layoutOption.icon}</span> {layoutOption.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? "bg-yellow-400 text-indigo-950"
                          : "bg-indigo-800/40 border border-indigo-700 text-white hover:bg-indigo-700"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="mr-1">{category.icon}</span> {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Loading indicator for images */}
              {isLoadingImages && (
                <div className="flex justify-center items-center py-12">
                  <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}

              {/* No results message */}
              {!isLoadingImages && filteredImages.length === 0 && (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-yellow-400 text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-white mb-2">No images found</h3>
                  <p className="text-indigo-300">Try adjusting your search or filter to find what you're looking for</p>
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="mt-4 px-6 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-full text-white transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}

              {/* Gallery Layout */}
              {!isLoadingImages && filteredImages.length > 0 && (
                <>
                  {/* Grid Layout */}
                  {layout === "grid" && (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredImages.map((image, index) => (
                        <motion.div
                          key={image.id}
                          custom={index}
                          variants={imageVariants}
                          whileHover="hover"
                          className="relative overflow-hidden rounded-xl cursor-pointer group shadow-lg"
                          onClick={() => openLightbox(image)}
                        >
                          <div className="aspect-square overflow-hidden">
                            <img
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-lg font-bold text-white">{image.alt}</h3>
                            <p className="text-sm text-indigo-200">{image.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Masonry Layout */}
                  {layout === "masonry" && (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                      {filteredImages.map((image, index) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.5 }}
                          className="relative overflow-hidden rounded-xl cursor-pointer group shadow-lg break-inside-avoid"
                          onClick={() => openLightbox(image)}
                        >
                          <div
                            className={`overflow-hidden ${index % 3 === 0 ? "aspect-[3/4]" : index % 3 === 1 ? "aspect-square" : "aspect-[4/3]"}`}
                          >
                            <img
                              src={image.src || "/placeholder.svg"}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-lg font-bold text-white">{image.alt}</h3>
                            <p className="text-sm text-indigo-200">{image.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Carousel Layout */}
                  {layout === "carousel" && (
                    <div className="relative">
                      <div className="overflow-x-auto pb-8 hide-scrollbar">
                        <div className="flex flex-wrap gap-6 justify-center">
                          {filteredImages.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.5 }}
                              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] relative overflow-hidden rounded-xl cursor-pointer group shadow-lg"
                              onClick={() => openLightbox(image)}
                              whileHover={{ y: -5, scale: 1.02 }}
                            >
                              <div className="aspect-[4/3] overflow-hidden">
                                <img
                                  src={image.src || "/placeholder.svg"}
                                  alt={image.alt}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-lg font-bold text-white">{image.alt}</h3>
                                <p className="text-sm text-indigo-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {image.description}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Floating music notes */}
          {[...Array(10)].map((_, index) => (
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

        {/* Call to Action */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-800 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-2xl border border-indigo-600">
              <div className="text-center">
                <motion.h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Join Our Ministry
                </motion.h2>
                <motion.p
                  className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Be part of our worship journey and help us spread the message of faith through music
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <a
                    href="/contact"
                    className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Contact Us
                  </a>
                  <a
                    href="/events"
                    className="bg-transparent border-2 border-white hover:border-yellow-400 text-white hover:text-yellow-400 px-8 py-3 rounded-full font-bold transition-all duration-300"
                  >
                    Upcoming Events
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-5xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentImage.src || "/placeholder.svg"}
                  alt={currentImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                />

                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent rounded-b-lg">
                  <h3 className="text-xl font-bold text-white">{currentImage.alt}</h3>
                  <p className="text-indigo-200">{currentImage.description}</p>
                </div>

                <button
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black"
                  onClick={closeLightbox}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>

                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage("prev")
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigateImage("next")
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-indigo-950 py-16 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 z-0 opacity-15">
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%"],
              }}
              transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, repeatType: "mirror", ease: "linear" }}
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
                    Exodus
                  </motion.span>
                  <motion.span className="text-4xl font-bold text-white ml-2" whileHover={{ scale: 1.05 }}>
                    Music Ministry
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
                    <span className="text-indigo-200">+91 99444 51426</span>
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

export default Gallery
