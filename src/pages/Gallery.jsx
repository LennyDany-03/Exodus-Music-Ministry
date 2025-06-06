"use client"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"

const Gallery = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [layout, setLayout] = useState("grid")
  const [scrollY, setScrollY] = useState(0)
  const galleryRef = useRef(null)

  // Scroll animations
  const { scrollYProgress } = useScroll()
  const headerScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

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

        if (data && data.length > 0) {
          const transformedData = data.map((img) => ({
            id: img.id,
            src: img.image_url,
            alt: img.alt_text || img.title,
            category: img.category,
            description: img.description,
            featured: img.featured || false,
            created_at: img.created_at,
          }))
          setGalleryImages(transformedData)
        } else {
          setGalleryImages([])
        }
      } catch (error) {
        console.error("Error in fetchImages:", error)
        setGalleryImages([])
      } finally {
        setIsLoadingImages(false)
        setTimeout(() => setIsLoading(false), 1000)
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
  const featuredImages = galleryImages.filter((img) => img.featured).slice(0, 6)

  // Open lightbox with selected image
  const openLightbox = (image) => {
    setCurrentImage(image)
    setLightboxOpen(true)
    document.body.style.overflow = "hidden"
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentImage(null)
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9],
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 },
    },
  }

  // Gallery categories
  const categories = [
    { id: "all", name: "All Photos", icon: "🖼️", count: galleryImages.length },
    {
      id: "worship",
      name: "Worship",
      icon: "🎵",
      count: galleryImages.filter((img) => img.category === "worship").length,
    },
    { id: "team", name: "Team", icon: "👥", count: galleryImages.filter((img) => img.category === "team").length },
    {
      id: "concerts",
      name: "Concerts",
      icon: "🎤",
      count: galleryImages.filter((img) => img.category === "concerts").length,
    },
    {
      id: "behind",
      name: "Behind Scenes",
      icon: "🎬",
      count: galleryImages.filter((img) => img.category === "behind").length,
    },
  ]

  // Layout options
  const layouts = [
    { id: "grid", name: "Grid", icon: "⊞" },
    { id: "masonry", name: "Masonry", icon: "⊟" },
    { id: "list", name: "List", icon: "☰" },
  ]

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 z-50 flex flex-col items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <div className="w-20 h-20 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full"></div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center text-yellow-400 text-2xl"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                📸
              </motion.div>
            </motion.div>
            <motion.h2
              className="text-white text-xl font-bold mt-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              Loading Gallery...
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      <NavBar />

      <div className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-950 text-white min-h-screen">
        {/* Hero Header */}
        <motion.header
          className="relative h-[70vh] flex items-center justify-center overflow-hidden"
          style={{ scale: headerScale, opacity: headerOpacity }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(79, 70, 229, 0.2), rgba(147, 51, 234, 0.2))",
                  "linear-gradient(135deg, rgba(147, 51, 234, 0.2), rgba(79, 70, 229, 0.2))",
                  "linear-gradient(225deg, rgba(79, 70, 229, 0.2), rgba(147, 51, 234, 0.2))",
                ],
              }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />

            {/* Floating Elements */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              >
                <div className="text-yellow-400/60 text-2xl">
                  {["📸", "🎵", "✨", "🎭", "🌟"][Math.floor(Math.random() * 5)]}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full text-yellow-400 text-sm font-medium mb-4">
                📸 Photo Gallery
              </span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="block text-white">Capturing</span>
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Sacred Moments
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-indigo-200 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Journey through our ministry's most precious moments of worship, fellowship, and divine inspiration
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button
                onClick={() => galleryRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-950 px-8 py-4 rounded-full font-bold hover:shadow-2xl hover:shadow-yellow-400/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-2">
                  Explore Gallery
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    →
                  </motion.span>
                </span>
              </button>

              <button
                onClick={() => setActiveCategory("featured")}
                className="group bg-transparent border-2 border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 px-8 py-4 rounded-full font-bold transition-all duration-300 backdrop-blur-sm"
              >
                Featured Photos
              </button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-yellow-400 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </motion.div>
        </motion.header>

        {/* Featured Section */}
        {featuredImages.length > 0 && (
          <motion.section
            className="py-20 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h2 className="text-4xl md:text-5xl font-bold mb-4" variants={itemVariants}>
                  ✨ Featured Moments
                </motion.h2>
                <motion.div
                  className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6"
                  variants={itemVariants}
                />
                <motion.p className="text-lg text-indigo-200 max-w-2xl mx-auto" variants={itemVariants}>
                  Our most cherished memories that capture the essence of our ministry
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="group relative overflow-hidden rounded-2xl cursor-pointer"
                    variants={imageVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openLightbox(image)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src || "/placeholder.svg?height=400&width=600"}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold text-white mb-2">{image.alt}</h3>
                      <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.description}
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 bg-yellow-400 text-indigo-950 px-3 py-1 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Featured
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Main Gallery Section */}
        <motion.section
          ref={galleryRef}
          className="py-20 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            {/* Header */}
            <motion.div
              className="text-center mb-16"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 className="text-4xl md:text-5xl font-bold mb-4" variants={itemVariants}>
                📷 Complete Gallery
              </motion.h2>
              <motion.div
                className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto mb-6"
                variants={itemVariants}
              />
              <motion.p className="text-lg text-indigo-200 max-w-3xl mx-auto" variants={itemVariants}>
                Browse through our complete collection of ministry moments, worship services, and community gatherings
              </motion.p>
            </motion.div>

            {/* Controls */}
            <motion.div
              className="mb-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Search Bar */}
              <motion.div className="max-w-md mx-auto mb-8" variants={itemVariants}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search photos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-4 px-6 pl-14 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-300"
                  />
                  <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Category Filters */}
              <motion.div className="flex flex-wrap justify-center gap-3 mb-8" variants={itemVariants}>
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`group px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      activeCategory === category.id
                        ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-950 shadow-lg shadow-yellow-400/25"
                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:border-yellow-400/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          activeCategory === category.id
                            ? "bg-indigo-950/20 text-indigo-950"
                            : "bg-white/20 text-gray-300"
                        }`}
                      >
                        {category.count}
                      </span>
                    </span>
                  </motion.button>
                ))}
              </motion.div>

              {/* Layout Toggle */}
              <motion.div className="flex justify-center" variants={itemVariants}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-1 flex">
                  {layouts.map((layoutOption) => (
                    <button
                      key={layoutOption.id}
                      onClick={() => setLayout(layoutOption.id)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                        layout === layoutOption.id ? "bg-yellow-400 text-indigo-950" : "text-white hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{layoutOption.icon}</span>
                        <span className="hidden sm:inline">{layoutOption.name}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Loading State */}
            {isLoadingImages && (
              <div className="flex justify-center items-center py-20">
                <motion.div
                  className="w-12 h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
            )}

            {/* Empty State */}
            {!isLoadingImages && filteredImages.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-6">📷</div>
                <h3 className="text-2xl font-bold text-white mb-4">No photos found</h3>
                <p className="text-indigo-200 mb-8 max-w-md mx-auto">
                  {searchQuery
                    ? `No photos match "${searchQuery}". Try a different search term.`
                    : "No photos available in this category yet. Check back soon!"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("all")
                  }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-950 px-6 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300"
                >
                  View All Photos
                </button>
              </motion.div>
            )}

            {/* Gallery Grid */}
            {!isLoadingImages && filteredImages.length > 0 && (
              <motion.div
                className={`${
                  layout === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    : layout === "masonry"
                      ? "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
                      : "space-y-6"
                }`}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className={`group relative overflow-hidden rounded-2xl cursor-pointer ${
                      layout === "masonry" ? "break-inside-avoid" : ""
                    } ${layout === "list" ? "flex bg-white/5 backdrop-blur-sm border border-white/10 p-4" : ""}`}
                    variants={imageVariants}
                    whileHover="hover"
                    onClick={() => openLightbox(image)}
                    transition={{ delay: index * 0.05 }}
                  >
                    {layout === "list" ? (
                      <>
                        <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={image.src || "/placeholder.svg?height=200&width=200"}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="ml-6 flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{image.alt}</h3>
                          <p className="text-indigo-200 mb-3">{image.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>📅 {new Date(image.created_at).toLocaleDateString()}</span>
                            <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                              {image.category}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className={`overflow-hidden ${
                            layout === "masonry"
                              ? index % 3 === 0
                                ? "aspect-[3/4]"
                                : index % 3 === 1
                                  ? "aspect-square"
                                  : "aspect-[4/3]"
                              : "aspect-square"
                          }`}
                        >
                          <img
                            src={image.src || "/placeholder.svg?height=400&width=400"}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-lg font-bold text-white mb-1">{image.alt}</h3>
                          <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                            {image.description}
                          </p>
                        </div>

                        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {image.category}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          className="py-20 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                📸 Share Your Moments
              </motion.h2>
              <motion.p
                className="text-lg text-indigo-200 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Have photos from our events? We'd love to feature them in our gallery and share these blessed moments
                with our community.
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
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-950 px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-yellow-400/25 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Send Us a Message
                </a>
                <a
                  href="/events"
                  className="bg-transparent border-2 border-white/30 hover:border-yellow-400 text-white hover:text-yellow-400 px-8 py-4 rounded-2xl font-bold transition-all duration-300 backdrop-blur-sm"
                >
                  Upcoming Events
                </a>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && currentImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-6xl w-full max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <img
                    src={currentImage.src || "/placeholder.svg"}
                    alt={currentImage.alt}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
                  />

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent rounded-b-2xl">
                    <h3 className="text-2xl font-bold text-white mb-2">{currentImage.alt}</h3>
                    <p className="text-gray-200 mb-2">{currentImage.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>📅 {new Date(currentImage.created_at).toLocaleDateString()}</span>
                      <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 rounded-full">
                        {currentImage.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <button
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={closeLightbox}
                >
                  ✕
                </button>

                {filteredImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateImage("prev")
                      }}
                    >
                      ←
                    </button>

                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateImage("next")
                      }}
                    >
                      →
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm">
                  {filteredImages.findIndex((img) => img.id === currentImage.id) + 1} / {filteredImages.length}
                </div>
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
