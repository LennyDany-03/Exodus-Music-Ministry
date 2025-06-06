"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../lib/supabaseClient"
import NavBar from "../components/Nav"

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    // Personal/Organization Details
    fullName: "",
    email: "",
    phone: "",
    address: "",

    // Partnership Type
    partnershipType: [],

    // Financial Support Details
    supportType: "",
    amount: "",
    paymentMethod: "",

    // Equipment Sponsor Details
    equipmentDetails: "",
    sponsorshipDuration: "",

    // Event Collaborator Details
    eventType: "",
    proposedDate: "",
    location: "",
    eventProposal: "",

    // Prayer Partner Details
    receiveUpdates: false,

    // Volunteer Details
    volunteerAreas: [],

    // General
    message: "",
    agreedToTerms: false,
  })

  const [files, setFiles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const partnershipOptions = [
    { id: "prayer", label: "Prayer Partner (Join our intercessory team)" },
    { id: "financial", label: "Financial Supporter (Make one-time or regular donations)" },
    { id: "equipment", label: "Equipment Sponsor (Donate or lend musical/sound gear)" },
    { id: "event", label: "Event Collaborator (Invite us to minister or host joint events)" },
    { id: "volunteer", label: "Volunteer Support (Help during events/logistics)" },
  ]

  const volunteerOptions = [
    { id: "setup", label: "Event Setup" },
    { id: "media", label: "Media Team" },
    { id: "hospitality", label: "Hospitality" },
    { id: "merchandise", label: "Merchandise" },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      if (name === "partnershipType") {
        setFormData((prev) => ({
          ...prev,
          partnershipType: checked
            ? [...prev.partnershipType, value]
            : prev.partnershipType.filter((type) => type !== value),
        }))
      } else if (name === "volunteerAreas") {
        setFormData((prev) => ({
          ...prev,
          volunteerAreas: checked
            ? [...prev.volunteerAreas, value]
            : prev.volunteerAreas.filter((area) => area !== value),
        }))
      } else {
        setFormData((prev) => ({ ...prev, [name]: checked }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files))
  }

  const uploadFiles = async () => {
    const uploadedFiles = []

    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { data, error } = await supabase.storage.from("partner-uploads").upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        })

        if (error) {
          console.error("File upload error:", error)
          continue
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("partner-uploads").getPublicUrl(fileName)

        uploadedFiles.push(publicUrl)
      } catch (error) {
        console.error("File processing error:", error)
      }
    }

    return uploadedFiles
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.agreedToTerms) {
      setSubmitError("Please agree to the terms and conditions")
      return
    }

    if (formData.partnershipType.length === 0) {
      setSubmitError("Please select at least one partnership type")
      return
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      setSubmitError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Upload files if any
      let uploadedFileUrls = []
      if (files.length > 0) {
        try {
          uploadedFileUrls = await uploadFiles()
        } catch (error) {
          console.error("File upload failed:", error)
          // Continue without files if upload fails
        }
      }

      // Prepare data for insertion
      const insertData = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        partnership_types: formData.partnershipType,
        support_type: formData.supportType || null,
        amount: formData.amount ? Number.parseFloat(formData.amount) : null,
        payment_method: formData.paymentMethod || null,
        equipment_details: formData.equipmentDetails.trim() || null,
        sponsorship_duration: formData.sponsorshipDuration.trim() || null,
        event_type: formData.eventType.trim() || null,
        proposed_date: formData.proposedDate || null,
        location: formData.location.trim() || null,
        event_proposal: formData.eventProposal.trim() || null,
        receive_updates: formData.receiveUpdates,
        volunteer_areas: formData.volunteerAreas.length > 0 ? formData.volunteerAreas : null,
        message: formData.message.trim() || null,
        uploaded_files: uploadedFileUrls.length > 0 ? uploadedFileUrls : null,
        status: "pending",
      }

      console.log("Submitting data:", insertData)

      // Insert into Supabase
      const { data, error } = await supabase.from("partnership_requests").insert([insertData]).select()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Successfully submitted:", data)
      setSubmitSuccess(true)

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        partnershipType: [],
        supportType: "",
        amount: "",
        paymentMethod: "",
        equipmentDetails: "",
        sponsorshipDuration: "",
        eventType: "",
        proposedDate: "",
        location: "",
        eventProposal: "",
        receiveUpdates: false,
        volunteerAreas: [],
        message: "",
        agreedToTerms: false,
      })
      setFiles([])
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitError(`Failed to submit partnership request: ${error.message || "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-indigo-800/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-700 text-center max-w-md"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-indigo-200 mb-6">
              Thank you for your interest in partnering with Exodus Music Ministry. We'll get in touch with you shortly.
            </p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="bg-yellow-400 hover:bg-yellow-500 text-indigo-900 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Submit Another Request
            </button>
          </motion.div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-white py-20 px-4">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-400/10 rounded-full blur-xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
                Partner With Us
              </span>
            </h1>
            <p className="text-xl text-indigo-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Support the mission of Exodus Music Ministry and help us reach more souls through worship.
            </p>
            <div className="bg-indigo-800/40 backdrop-blur-sm rounded-xl p-6 border border-indigo-700">
              <p className="text-indigo-100 leading-relaxed">
                Exodus Music Ministry is committed to spreading the message of Christ through worship, events, and
                community outreach. We rely on the support of generous individuals and organizations to continue our
                mission. If you'd like to partner with us, please fill out the form below.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-indigo-800/60 backdrop-blur-sm rounded-2xl p-8 border border-indigo-700"
          >
            {submitError && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
                {submitError}
              </div>
            )}

            {/* Personal/Organization Details */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Personal / Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-indigo-200 mb-2">Full Name / Organization Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Enter your full name or organization name"
                  />
                </div>
                <div>
                  <label className="block text-indigo-200 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-indigo-200 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-indigo-200 mb-2">Address (Optional)</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                    placeholder="Your address"
                  />
                </div>
              </div>
            </div>

            {/* Partnership Types */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-400 mb-6">Types of Partnerships *</h3>
              <div className="space-y-4">
                {partnershipOptions.map((option) => (
                  <label key={option.id} className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="partnershipType"
                      value={option.id}
                      checked={formData.partnershipType.includes(option.id)}
                      onChange={handleInputChange}
                      className="mt-1 w-5 h-5 text-yellow-400 bg-indigo-900/50 border-indigo-600 rounded focus:ring-yellow-400 focus:ring-2"
                    />
                    <span className="text-indigo-100 group-hover:text-white transition-colors">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional Fields Based on Partnership Type */}
            {formData.partnershipType.includes("financial") && (
              <div className="mb-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-600">
                <h4 className="text-xl font-semibold text-yellow-400 mb-4">Financial Support Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-indigo-200 mb-2">Type of Support</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="supportType"
                          value="one-time"
                          checked={formData.supportType === "one-time"}
                          onChange={handleInputChange}
                          className="text-yellow-400 bg-indigo-900/50 border-indigo-600 focus:ring-yellow-400"
                        />
                        <span className="text-indigo-100">One-Time</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="supportType"
                          value="monthly"
                          checked={formData.supportType === "monthly"}
                          onChange={handleInputChange}
                          className="text-yellow-400 bg-indigo-900/50 border-indigo-600 focus:ring-yellow-400"
                        />
                        <span className="text-indigo-100">Monthly</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-indigo-200 mb-2">Amount (Optional)</label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="1000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-indigo-200 mb-2">Preferred Payment Method</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["UPI", "Bank Transfer", "Cash", "Other"].map((method) => (
                        <label key={method} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.toLowerCase()}
                            checked={formData.paymentMethod === method.toLowerCase()}
                            onChange={handleInputChange}
                            className="text-yellow-400 bg-indigo-900/50 border-indigo-600 focus:ring-yellow-400"
                          />
                          <span className="text-indigo-100 text-sm">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formData.partnershipType.includes("equipment") && (
              <div className="mb-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-600">
                <h4 className="text-xl font-semibold text-yellow-400 mb-4">Equipment Sponsor Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-indigo-200 mb-2">
                      What equipment would you like to sponsor or lend?
                    </label>
                    <textarea
                      name="equipmentDetails"
                      value={formData.equipmentDetails}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Describe the equipment you'd like to sponsor or lend..."
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-200 mb-2">Duration of Sponsorship (Optional)</label>
                    <input
                      type="text"
                      name="sponsorshipDuration"
                      value={formData.sponsorshipDuration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="e.g., 6 months, 1 year, permanent"
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.partnershipType.includes("event") && (
              <div className="mb-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-600">
                <h4 className="text-xl font-semibold text-yellow-400 mb-4">Event Collaboration Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-indigo-200 mb-2">Event Type</label>
                    <input
                      type="text"
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="e.g., Church Convention, Worship Night, Youth Event"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-200 mb-2">Proposed Date</label>
                    <input
                      type="date"
                      name="proposedDate"
                      value={formData.proposedDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-indigo-200 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Event location"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-indigo-200 mb-2">Message/Proposal</label>
                    <textarea
                      name="eventProposal"
                      value={formData.eventProposal}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                      placeholder="Describe your event proposal..."
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.partnershipType.includes("prayer") && (
              <div className="mb-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-600">
                <h4 className="text-xl font-semibold text-yellow-400 mb-4">Prayer Partner Details</h4>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="receiveUpdates"
                    checked={formData.receiveUpdates}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-yellow-400 bg-indigo-900/50 border-indigo-600 rounded focus:ring-yellow-400 focus:ring-2"
                  />
                  <span className="text-indigo-100">
                    Would you like to receive regular ministry updates and prayer requests?
                  </span>
                </label>
              </div>
            )}

            {formData.partnershipType.includes("volunteer") && (
              <div className="mb-8 bg-indigo-900/30 rounded-xl p-6 border border-indigo-600">
                <h4 className="text-xl font-semibold text-yellow-400 mb-4">Volunteer Support Details</h4>
                <p className="text-indigo-200 mb-4">Which areas are you interested in helping?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {volunteerOptions.map((option) => (
                    <label key={option.id} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="volunteerAreas"
                        value={option.id}
                        checked={formData.volunteerAreas.includes(option.id)}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-yellow-400 bg-indigo-900/50 border-indigo-600 rounded focus:ring-yellow-400 focus:ring-2"
                      />
                      <span className="text-indigo-100">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Message Box */}
            <div className="mb-8">
              <label className="block text-indigo-200 mb-2">
                Why do you want to partner with Exodus Music Ministry?
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="Share your heart and motivation for partnering with us..."
              />
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="block text-indigo-200 mb-2">
                Optional Upload (Logo, promotional material, collaboration photos)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
                className="w-full px-4 py-3 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-indigo-900 hover:file:bg-yellow-500 transition-colors"
              />
              {files.length > 0 && (
                <div className="mt-2 text-sm text-indigo-200">
                  Selected files: {files.map((f) => f.name).join(", ")}
                </div>
              )}
            </div>

            {/* Agreement Checkbox */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-5 h-5 text-yellow-400 bg-indigo-900/50 border-indigo-600 rounded focus:ring-yellow-400 focus:ring-2"
                />
                <span className="text-indigo-100 text-sm leading-relaxed">
                  I understand that my partnership with Exodus Music Ministry will be used for the advancement of its
                  mission, and I agree to be contacted via email/phone. *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-indigo-900 font-bold py-4 px-8 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Become a Partner"
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </>
  )
}

export default PartnerWithUs
