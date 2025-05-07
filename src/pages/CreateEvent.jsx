"use client"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"
import SundayEve from "../assets/SundayEVE.png"
import Gospel from "../assets/GospelPoster.jpg"
import Centenary from "../assets/Centenary.jpg"
import TeamPhoto from "../assets/Team Photo.jpg"

const CreateEvent = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    url: "",
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState("")

  // Sample images for quick selection
  const sampleImages = [
    { src: SundayEve, name: "Sunday Service" },
    { src: Gospel, name: "Gospel Night" },
    { src: Centenary, name: "Centenary" },
    { src: TeamPhoto, name: "Team Photo" },
  ]

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle sample image selection
  const handleSampleImageSelect = (imageSrc) => {
    setPreviewImage(imageSrc)
    setSelectedImage(null) // Clear any uploaded file

    // Clear image error if it exists
    if (errors.image) {
      setErrors({
        ...errors,
        image: null,
      })
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.date) newErrors.date = "Date is required"
    if (!formData.location.trim()) newErrors.location = "Location is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!previewImage && !selectedImage) newErrors.image = "Please select or upload an image"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSuccessMessage("")
    setErrors({})

    try {
      let imageUrl = ""

      // If using a sample image (which is already in the assets folder)
      if (previewImage && !selectedImage) {
        // For sample images, we can use the path directly since they're already in the assets
        imageUrl = previewImage
      }
      // If user uploaded a custom image
      else if (selectedImage) {
        console.log("Uploading custom image:", selectedImage.name, selectedImage.type, selectedImage.size)

        // Validate file size (limit to 5MB)
        if (selectedImage.size > 5 * 1024 * 1024) {
          throw new Error("Image file is too large. Please select an image under 5MB.")
        }

        // Validate file type
        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        if (!validTypes.includes(selectedImage.type)) {
          throw new Error("Invalid file type. Please select a JPG, PNG, GIF, or WebP image.")
        }

        // Create a unique filename to avoid collisions
        const fileExt = selectedImage.name.split(".").pop()
        const fileName = `event_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `${fileName}`

        console.log("Uploading to path:", filePath)

        try {
          // Upload image to Supabase Storage
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("events")
            .upload(filePath, selectedImage, {
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
          } = supabase.storage.from("events").getPublicUrl(filePath)

          console.log("Public URL:", publicUrl)
          imageUrl = publicUrl
        } catch (uploadErr) {
          console.error("Error in upload process:", uploadErr)
          throw new Error(`Image upload failed: ${uploadErr.message}`)
        }
      } else {
        throw new Error("Please select or upload an image")
      }

      // Insert event data into Supabase table
      console.log("Inserting event with image URL:", imageUrl)
      const { data, error } = await supabase.from("events").insert([
        {
          title: formData.title,
          date: formData.date,
          location: formData.location,
          description: formData.description,
          image_url: imageUrl,
          url: formData.url || null,
        },
      ])

      if (error) {
        console.error("Supabase insert error:", error)
        throw new Error(`Database error: ${error.message || "Failed to save event"}`)
      }

      // Show success message
      setSuccessMessage("Event created successfully!")

      // Reset form
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        url: "",
      })
      setPreviewImage(null)
      setSelectedImage(null)

      // Redirect to events page after a short delay
      setTimeout(() => {
        navigate("/events")
      }, 2000)
    } catch (error) {
      console.error("Error creating event:", error)
      setErrors({
        submit: error.message || "Failed to create event. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Create New Event</h1>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-300 mx-auto mb-6"></div>
              <p className="text-lg text-indigo-200">
                Add a new event to share with the Exodus Music Ministry community
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-8 text-center"
              >
                {successMessage}
              </motion.div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-indigo-800"
            >
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-indigo-200 mb-2">
                  Event Title <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-indigo-800/50 border ${
                    errors.title ? "border-red-500" : "border-indigo-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                  placeholder="e.g., Sunday Eve Special Service"
                />
                {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
              </div>

              {/* Date and Location (2 columns on larger screens) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-indigo-200 mb-2">
                    Event Date <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-indigo-800/50 border ${
                      errors.date ? "border-red-500" : "border-indigo-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-400">{errors.date}</p>}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-indigo-200 mb-2">
                    Location <span className="text-yellow-400">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-indigo-800/50 border ${
                      errors.location ? "border-red-500" : "border-indigo-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                    placeholder="e.g., Mylapore"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-400">{errors.location}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
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
                    errors.description ? "border-red-500" : "border-indigo-700"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white`}
                  placeholder="Describe the event details..."
                ></textarea>
                {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
              </div>

              {/* URL */}
              <div className="mb-8">
                <label htmlFor="url" className="block text-sm font-medium text-indigo-200 mb-2">
                  External URL <span className="text-indigo-400">(optional)</span>
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                  placeholder="e.g., YouTube or Facebook link"
                />
                <p className="mt-1 text-xs text-indigo-400">
                  Add a link to YouTube, Facebook, or other external content related to this event
                </p>
              </div>

              {/* Image Selection */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-indigo-200 mb-4">
                  Event Image <span className="text-yellow-400">*</span>
                </label>

                {/* Image preview */}
                {previewImage && (
                  <div className="mb-4">
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                      <img
                        src={previewImage || "/placeholder.svg"}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null)
                          setSelectedImage(null)
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

                {/* Upload option */}
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full py-3 px-4 border-2 border-dashed border-indigo-600 rounded-lg text-indigo-300 hover:border-yellow-400 hover:text-yellow-400 transition-colors flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      ></path>
                    </svg>
                    Upload Image
                  </button>
                </div>

                {/* Sample images */}
                <div>
                  <p className="text-sm text-indigo-300 mb-2">Or select from sample images:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                {errors.image && <p className="mt-3 text-sm text-red-400">{errors.image}</p>}
              </div>

              {/* Error message */}
              {errors.submit && (
                <div className="mb-6 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center">
                  {errors.submit}
                </div>
              )}

              {/* Form actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <motion.button
                  type="button"
                  onClick={() => navigate("/events")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.02,
                    boxShadow: isSubmitting ? "none" : "0px 5px 15px rgba(250, 204, 21, 0.3)",
                  }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
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
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Event
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default CreateEvent
