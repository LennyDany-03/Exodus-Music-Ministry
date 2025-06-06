"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"

const JoinOurMinistryForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    roles: [],
    musicExperience: "",
    roleExperience: "",
    instruments: "",
    churchMember: "",
    churchName: "",
    churchAttendance: "",
    weeklyPractices: "",
    availableDays: [],
    travelAvailable: "",
    message: "",
    videoFile: null,
    referenceFile: null,
    declaration: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const roles = [
    "Choir Member",
    "Musician Member (Guitar, Keyboard, Drums, etc.)",
    "Sound Engineer",
    "Supporting Team (Logistics, Setup, Prayer Team, etc.)",
  ]

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      if (name === "roles") {
        setFormData((prev) => ({
          ...prev,
          roles: checked ? [...prev.roles, value] : prev.roles.filter((role) => role !== value),
        }))
      } else if (name === "availableDays") {
        setFormData((prev) => ({
          ...prev,
          availableDays: checked ? [...prev.availableDays, value] : prev.availableDays.filter((day) => day !== value),
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: files[0] }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.age) newErrors.age = "Age is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (formData.roles.length === 0) newErrors.roles = "Please select at least one role"
    if (!formData.musicExperience.trim()) newErrors.musicExperience = "Please describe your experience"
    if (!formData.roleExperience.trim()) newErrors.roleExperience = "Please describe your role experience"
    if (!formData.churchMember) newErrors.churchMember = "Please specify church membership"
    if (!formData.weeklyPractices) newErrors.weeklyPractices = "Please specify availability for practices"
    if (formData.availableDays.length === 0) newErrors.availableDays = "Please select available days"
    if (!formData.travelAvailable) newErrors.travelAvailable = "Please specify travel availability"
    if (!formData.message.trim()) newErrors.message = "Please tell us why you want to join"
    if (!formData.declaration) newErrors.declaration = "Please accept the declaration"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const uploadFile = async (file, folder) => {
    if (!file) return null

    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage.from("ministry-applications").upload(filePath, file)

    if (error) {
      console.error("File upload error:", error)
      return null
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("ministry-applications").getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Upload files if they exist
      const videoUrl = await uploadFile(formData.videoFile, "videos")
      const referenceUrl = await uploadFile(formData.referenceFile, "references")

      // Prepare data for database
      const applicationData = {
        full_name: formData.fullName,
        age: Number.parseInt(formData.age),
        gender: formData.gender,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || null,
        roles: formData.roles,
        music_experience: formData.musicExperience,
        role_experience: formData.roleExperience,
        instruments: formData.instruments || null,
        church_member: formData.churchMember === "yes",
        church_name: formData.churchName || null,
        church_attendance: formData.churchAttendance || null,
        weekly_practices_available: formData.weeklyPractices === "yes",
        available_days: formData.availableDays,
        travel_available: formData.travelAvailable === "yes",
        message: formData.message,
        video_url: videoUrl,
        reference_url: referenceUrl,
        status: "pending",
        created_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("ministry_applications").insert([applicationData])

      if (error) {
        throw error
      }

      setShowSuccess(true)

      // Reset form
      setFormData({
        fullName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        address: "",
        roles: [],
        musicExperience: "",
        roleExperience: "",
        instruments: "",
        churchMember: "",
        churchName: "",
        churchAttendance: "",
        weeklyPractices: "",
        availableDays: [],
        travelAvailable: "",
        message: "",
        videoFile: null,
        referenceFile: null,
        declaration: false,
      })
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("There was an error submitting your application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Join Our <span className="text-yellow-400">Ministry</span>
            </h1>
            <p className="text-xl text-indigo-200 mb-8">
              Become a part of Exodus Music Ministry and use your gifts for God's glory.
            </p>

            <div className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-6 border border-indigo-800">
              <p className="text-lg text-indigo-100 leading-relaxed">
                We're on a mission to touch lives through music and worship. If you feel called to serve with your
                musical or technical gifts, we invite you to join one of our ministry roles. Fill out the form below and
                we'll get in touch with you!
              </p>
            </div>
          </motion.div>

          {/* Success Animation */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowSuccess(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="bg-indigo-900 rounded-2xl p-8 border border-yellow-400 max-w-md mx-4 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <svg className="w-10 h-10 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-yellow-400 mb-4">Application Submitted!</h3>
                  <p className="text-indigo-200 mb-6">
                    Thank you for expressing interest in joining Exodus Music Ministry. Our team will review your form
                    and get back to you soon.
                  </p>
                  <button
                    onClick={() => setShowSuccess(false)}
                    className="bg-yellow-400 text-indigo-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-indigo-900/50 backdrop-blur-sm rounded-xl p-8 border border-indigo-800"
          >
            {/* Available Roles */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Available Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roles.map((role) => (
                  <label key={role} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="roles"
                      value={role}
                      checked={formData.roles.includes(role)}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-yellow-400 bg-indigo-800 border-indigo-600 rounded focus:ring-yellow-400"
                    />
                    <span className="text-indigo-100">{role}</span>
                  </label>
                ))}
              </div>
              {errors.roles && <p className="text-red-400 text-sm mt-2">{errors.roles}</p>}
            </div>

            {/* Personal Details */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-indigo-200 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Age *</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your age"
                    min="1"
                    max="100"
                  />
                  {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Enter your address"
                  />
                </div>
              </div>
            </div>

            {/* Experience & Skills */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Experience & Skills</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-indigo-200 mb-2">
                    How long have you been involved in music or technical ministry? *
                  </label>
                  <textarea
                    name="musicExperience"
                    value={formData.musicExperience}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Describe your experience..."
                  />
                  {errors.musicExperience && <p className="text-red-400 text-sm mt-1">{errors.musicExperience}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">
                    Tell us about your experience in the selected role(s) *
                  </label>
                  <textarea
                    name="roleExperience"
                    value={formData.roleExperience}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="Describe your role experience..."
                  />
                  {errors.roleExperience && <p className="text-red-400 text-sm mt-1">{errors.roleExperience}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">
                    List your instruments or technical skills (if applicable)
                  </label>
                  <input
                    type="text"
                    name="instruments"
                    value={formData.instruments}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    placeholder="e.g., Guitar, Piano, Sound Mixing, etc."
                  />
                </div>
              </div>
            </div>

            {/* Church Affiliation */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Church Affiliation</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-indigo-200 mb-2">Are you a member of any church? *</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="churchMember"
                        value="yes"
                        checked={formData.churchMember === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="churchMember"
                        value="no"
                        checked={formData.churchMember === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {errors.churchMember && <p className="text-red-400 text-sm mt-1">{errors.churchMember}</p>}
                </div>

                {formData.churchMember === "yes" && (
                  <>
                    <div>
                      <label className="block text-indigo-200 mb-2">If yes, which one?</label>
                      <input
                        type="text"
                        name="churchName"
                        value={formData.churchName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        placeholder="Enter church name"
                      />
                    </div>

                    <div>
                      <label className="block text-indigo-200 mb-2">How often do you attend church?</label>
                      <select
                        name="churchAttendance"
                        value={formData.churchAttendance}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option value="">Select frequency</option>
                        <option value="weekly">Weekly</option>
                        <option value="bi-weekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="occasionally">Occasionally</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Availability</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-indigo-200 mb-2">Are you available for weekly practices? *</label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="weeklyPractices"
                        value="yes"
                        checked={formData.weeklyPractices === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="weeklyPractices"
                        value="no"
                        checked={formData.weeklyPractices === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {errors.weeklyPractices && <p className="text-red-400 text-sm mt-1">{errors.weeklyPractices}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">Which days are you available? *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {days.map((day) => (
                      <label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="availableDays"
                          value={day}
                          checked={formData.availableDays.includes(day)}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 rounded focus:ring-yellow-400"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availableDays && <p className="text-red-400 text-sm mt-1">{errors.availableDays}</p>}
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">
                    Are you available for travel for ministry events? *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="travelAvailable"
                        value="yes"
                        checked={formData.travelAvailable === "yes"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="travelAvailable"
                        value="no"
                        checked={formData.travelAvailable === "no"}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-yellow-400 bg-indigo-800 border-indigo-600 focus:ring-yellow-400"
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {errors.travelAvailable && <p className="text-red-400 text-sm mt-1">{errors.travelAvailable}</p>}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">A Short Message</h3>
              <div>
                <label className="block text-indigo-200 mb-2">Why do you want to join Exodus Music Ministry? *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Share your heart and calling..."
                />
                {errors.message && <p className="text-red-400 text-sm mt-1">{errors.message}</p>}
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">File Upload (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-indigo-200 mb-2">
                    Upload a short video/audio sample (for Choir/Musician roles)
                  </label>
                  <input
                    type="file"
                    name="videoFile"
                    onChange={handleFileChange}
                    accept="video/*,audio/*"
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-indigo-900 hover:file:bg-yellow-300"
                  />
                </div>

                <div>
                  <label className="block text-indigo-200 mb-2">
                    Upload a reference letter or church recommendation
                  </label>
                  <input
                    type="file"
                    name="referenceFile"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="w-full px-4 py-3 bg-indigo-800/50 border border-indigo-600 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-indigo-900 hover:file:bg-yellow-300"
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="mb-8">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-yellow-400 bg-indigo-800 border-indigo-600 rounded focus:ring-yellow-400 mt-1"
                />
                <span className="text-indigo-100">
                  I understand that joining Exodus Music Ministry is a commitment and I will serve faithfully with
                  integrity and humility. *
                </span>
              </label>
              {errors.declaration && <p className="text-red-400 text-sm mt-2">{errors.declaration}</p>}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-400 text-indigo-900 py-4 px-8 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Join the Ministry Now</span>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </>
  )
}

export default JoinOurMinistryForm
