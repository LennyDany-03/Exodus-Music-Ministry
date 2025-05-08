"use client"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"
import TeamPhoto from "../assets/Team Photo.jpg"
import TeamSecondPhoto from "../assets/Team @.jpg"
import Victor from "../assets/Victor1.jpg"
import Team3rdPhoto from "../assets/Team3rdPhoto.jpg"

const ImageUploadForm = () => {
  // State variables
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "team",
    alt: "",
  })

  // Refs
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.03, 1],
      boxShadow: [
        "0px 0px 0px rgba(250, 204, 21, 0)",
        "0px 0px 15px rgba(250, 204, 21, 0.5)",
        "0px 0px 0px rgba(250, 204, 21, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
      },
    },
  }

  // Sample images for quick selection
  const sampleImages = [
    { src: TeamPhoto, name: "Team Photo" },
    { src: TeamSecondPhoto, name: "Team Second Photo" },
    { src: Victor, name: "Dr. Victor" },
    { src: Team3rdPhoto, name: "Team Third Photo" },
  ]

  // Available categories
  const categories = [
    { id: "team", name: "Team Photos" },
    { id: "worship", name: "Worship Events" },
    { id: "concerts", name: "Concerts" },
    { id: "behind", name: "Behind the Scenes" },
  ]

  // Handle drag events for the drop zone
  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (!dropZone) return

    const handleDragOver = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.add("border-yellow-400")
      dropZone.classList.remove("border-indigo-600")
    }

    const handleDragLeave = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-yellow-400")
      dropZone.classList.add("border-indigo-600")
    }

    const handleDrop = (e) => {
      e.preventDefault()
      e.stopPropagation()
      dropZone.classList.remove("border-yellow-400")
      dropZone.classList.add("border-indigo-600")

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelection(e.dataTransfer.files[0])
      }
    }

    dropZone.addEventListener("dragover", handleDragOver)
    dropZone.addEventListener("dragleave", handleDragLeave)
    dropZone.addEventListener("drop", handleDrop)

    return () => {
      dropZone.removeEventListener("dragover", handleDragOver)
      dropZone.removeEventListener("dragleave", handleDragLeave)
      dropZone.removeEventListener("drop", handleDrop)
    }
  }, [])

  // Reset success message after 5 seconds
  useEffect(() => {
    let timer
    if (showSuccessMessage) {
      timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [showSuccessMessage])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  // Handle file selection (from input or drop)
  const handleFileSelection = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.includes("image/")) {
      setFormErrors({
        ...formErrors,
        file: "Please select an image file (JPG, PNG, GIF, etc.)",
      })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        file: "File size exceeds 5MB limit. Please select a smaller image.",
      })
      return
    }

    // Clear any previous file errors
    if (formErrors.file) {
      setFormErrors({
        ...formErrors,
        file: null,
      })
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleFileSelection(file)
  }

  // Handle sample image selection
  const handleSampleImageSelect = (imageSrc) => {
    setPreviewImage(imageSrc)
    setSelectedFile(null)

    // Clear file error if it exists
    if (formErrors.file) {
      setFormErrors({
        ...formErrors,
        file: null,
      })
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const errors = {}

    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.description.trim()) errors.description = "Description is required"
    if (!formData.category) errors.category = "Category is required"
    if (!previewImage && !selectedFile) errors.file = "Please select or upload an image"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Simulate upload progress
  const simulateProgress = () => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress > 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress(Math.floor(progress))
    }, 300)

    return interval
  }

  // Add this after the other useEffect hooks
  useEffect(() => {
    // Check if the images bucket exists and create it if it doesn't
    const createBucketIfNeeded = async () => {
      try {
        // First check if the bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()

        if (listError) {
          console.error("Error checking buckets:", listError)
          return
        }

        const bucketExists = buckets.some((bucket) => bucket.name === "images")

        if (!bucketExists) {
          console.log("Images bucket doesn't exist, creating it...")
          const { data, error } = await supabase.storage.createBucket("images", {
            public: true,
            fileSizeLimit: 5242880, // 5MB in bytes
          })

          if (error) {
            console.error("Error creating bucket:", error)
          } else {
            console.log("Images bucket created successfully")
          }
        }
      } catch (err) {
        console.error("Error in bucket creation:", err)
      }
    }

    createBucketIfNeeded()
  }, [])

  // Replace the handleSubmit function with this improved version
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setUploadProgress(0)
    setFormErrors({})

    const progressInterval = simulateProgress()

    try {
      let imageUrl = ""

      // If using a sample image (which is already in the assets folder)
      if (previewImage && !selectedFile) {
        // For sample images, we can use the path directly since they're already in the assets
        imageUrl = previewImage
        console.log("Using sample image:", imageUrl)
      }
      // If user uploaded a custom image
      else if (selectedFile) {
        console.log("Uploading custom image:", selectedFile.name, selectedFile.type, selectedFile.size)

        // Create a unique filename to avoid collisions
        const fileExt = selectedFile.name.split(".").pop()
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${fileName}`

        console.log("Uploading to path:", filePath)

        try {
          // Check if bucket exists first
          const createBucketIfNeeded = async () => {
            try {
              // First check if the bucket exists
              const { data: buckets, error: listError } = await supabase.storage.listBuckets()

              if (listError) {
                console.error("Error checking buckets:", listError)
                return
              }

              const bucketExists = buckets.some((bucket) => bucket.name === "images")

              if (!bucketExists) {
                console.log("Images bucket doesn't exist, creating it...")
                const { data, error } = await supabase.storage.createBucket("images", {
                  public: true,
                  fileSizeLimit: 5242880, // 5MB in bytes
                })

                if (error) {
                  console.error("Error creating bucket:", error)
                } else {
                  console.log("Images bucket created successfully")
                }
              }
            } catch (err) {
              console.error("Error in bucket creation:", err)
            }
          }
          await createBucketIfNeeded()

          // Upload image to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("images")
            .upload(filePath, selectedFile, {
              cacheControl: "3600",
              upsert: false,
            })

          console.log("Upload response:", uploadData, uploadError)

          if (uploadError) {
            console.error("Supabase upload error:", uploadError)
            throw new Error(`Upload failed: ${uploadError.message || "Unknown error"}`)
          }

          // Get public URL for the uploaded image
          const {
            data: { publicUrl },
          } = supabase.storage.from("images").getPublicUrl(filePath)

          console.log("Public URL:", publicUrl)
          imageUrl = publicUrl
        } catch (uploadErr) {
          console.error("Error in upload process:", uploadErr)
          throw new Error(`Image upload failed: ${uploadErr.message}`)
        }
      } else {
        throw new Error("Please select or upload an image")
      }

      // Insert image data into Supabase table
      console.log("Inserting image with URL:", imageUrl)
      const { data, error } = await supabase.from("images").insert([
        {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          alt_text: formData.alt || formData.title,
          image_url: imageUrl,
          storage_path: selectedFile ? `images/${selectedFile.name}` : "assets/sample",
        },
      ])

      if (error) {
        console.error("Supabase insert error:", error)
        throw new Error(`Database error: ${error.message || "Failed to save image"}`)
      }

      // Clear the form
      setFormData({
        title: "",
        description: "",
        category: "team",
        alt: "",
      })
      setPreviewImage(null)
      setSelectedFile(null)

      // Show success message
      setShowSuccessMessage(true)

      // Redirect to gallery after a short delay
      setTimeout(() => {
        window.location.href = "/gallery"
      }, 3000)
    } catch (error) {
      console.error("Error uploading image:", error)
      setFormErrors({
        ...formErrors,
        submit: error.message || "Failed to upload image. Please try again.",
      })
    } finally {
      clearInterval(progressInterval)
      setUploadProgress(100)
      setTimeout(() => {
        setIsSubmitting(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  // Handle cancel button click
  const handleCancel = () => {
    window.location.href = "/gallery"
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Upload New Image</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-6"></div>
            <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
              Share your beautiful moments with the Exodus Music Ministry community
            </p>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccessMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-500/20 border border-green-500 text-green-200 px-6 py-4 rounded-lg mb-8 text-center"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-2 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="font-medium">Image uploaded successfully!</span>
                </div>
                <p className="mt-1 text-sm">Your image has been added to the gallery.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-indigo-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-indigo-800"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Form Fields */}
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-indigo-200 mb-2">
                      Image Title <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-indigo-800/50 border ${
                        formErrors.title ? "border-red-500" : "border-indigo-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                      placeholder="Enter a title for this image"
                    />
                    {formErrors.title && <p className="mt-1 text-sm text-red-400">{formErrors.title}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-indigo-200 mb-2">
                      Description <span className="text-yellow-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full px-4 py-3 bg-indigo-800/50 border ${
                        formErrors.description ? "border-red-500" : "border-indigo-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                      placeholder="Describe this image..."
                    ></textarea>
                    {formErrors.description && <p className="mt-1 text-sm text-red-400">{formErrors.description}</p>}
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-indigo-200 mb-2">
                      Category <span className="text-yellow-400">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label htmlFor="alt" className="block text-sm font-medium text-indigo-200 mb-2">
                      Alt Text <span className="text-indigo-400">(optional)</span>
                    </label>
                    <input
                      type="text"
                      id="alt"
                      name="alt"
                      value={formData.alt}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                      placeholder="Alternative text for accessibility"
                    />
                    <p className="mt-1 text-xs text-indigo-400">
                      Describe the image for screen readers and accessibility
                    </p>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="space-y-6">
                  {/* Image Preview */}
                  {previewImage && (
                    <div className="mb-4">
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewImage(null)
                            setSelectedFile(null)
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Drop Zone */}
                  {!previewImage && (
                    <div
                      ref={dropZoneRef}
                      className="border-2 border-dashed border-indigo-600 rounded-lg p-8 text-center cursor-pointer transition-colors duration-300 hover:border-yellow-400"
                      onClick={() => fileInputRef.current.click()}
                    >
                      <svg
                        className="w-12 h-12 text-indigo-400 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                      <p className="text-indigo-300 mb-2">Drag and drop your image here, or click to browse</p>
                      <p className="text-indigo-400 text-sm">Maximum file size: 5MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-white text-sm transition-colors"
                      >
                        Select File
                      </button>
                    </div>
                  )}

                  {/* File Error Message */}
                  {formErrors.file && <p className="text-sm text-red-400 text-center">{formErrors.file}</p>}

                  {/* Sample Images */}
                  <div>
                    <p className="text-sm text-indigo-300 mb-2">Or select from sample images:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {sampleImages.map((image, index) => (
                        <div
                          key={index}
                          onClick={() => handleSampleImageSelect(image.src)}
                          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                            previewImage === image.src
                              ? "border-yellow-400 ring-2 ring-yellow-400/50"
                              : "border-transparent hover:border-indigo-600"
                          }`}
                        >
                          <div className="aspect-square">
                            <img
                              src={image.src || "/placeholder.svg"}
                              alt={image.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-1 text-center text-xs bg-indigo-800/80 text-indigo-200 truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Error */}
              {formErrors.submit && (
                <div className="mt-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center">
                  {formErrors.submit}
                </div>
              )}

              {/* Upload Progress */}
              {isSubmitting && uploadProgress > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-indigo-300 mb-1">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-indigo-800 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
                <motion.button
                  type="button"
                  onClick={handleCancel}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  variants={pulseAnimation}
                  initial="initial"
                  animate={isSubmitting ? "initial" : "animate"}
                  whileHover={isSubmitting ? {} : { scale: 1.02 }}
                  whileTap={isSubmitting ? {} : { scale: 0.98 }}
                  className={`px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 font-bold rounded-lg flex items-center justify-center ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-indigo-950"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      Upload to Gallery
                      <svg
                        className="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-12 bg-indigo-900/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-800/50"
          >
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">Tips for Great Gallery Images</h3>
            <ul className="space-y-2 text-indigo-200">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Choose high-quality images that are clear and well-lit</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Add descriptive titles and detailed descriptions to help others understand the context</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Select the appropriate category to help organize the gallery</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>Include alt text to make your images accessible to everyone</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default ImageUploadForm
