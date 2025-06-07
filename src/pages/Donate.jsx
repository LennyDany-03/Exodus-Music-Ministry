"use client"
import { useState } from "react"
import { motion, useAnimation, useScroll, useTransform } from "framer-motion"
import NavBar from "../components/Nav"
import { supabase } from "../lib/supabaseClient"

// Razorpay initialization function
const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true

    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }

    document.body.appendChild(script)
  })
}

// PDF generation function
const generateInvoicePDF = (donationData) => {
  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  // Set colors
  const primaryColor = [67, 56, 202] // Indigo
  const accentColor = [250, 204, 21] // Yellow

  // Header
  doc.setFillColor(...primaryColor)
  doc.rect(0, 0, 210, 40, "F")

  // Ministry Name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont(undefined, "bold")
  doc.text("EXODUS MUSIC MINISTRY", 20, 25)

  // Subtitle
  doc.setFontSize(12)
  doc.setFont(undefined, "normal")
  doc.text("Donation Receipt", 20, 32)

  // Reset text color
  doc.setTextColor(0, 0, 0)

  // Receipt Title
  doc.setFontSize(20)
  doc.setFont(undefined, "bold")
  doc.text("DONATION RECEIPT", 20, 60)

  // Receipt details
  doc.setFontSize(12)
  doc.setFont(undefined, "normal")

  const currentDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Receipt information
  doc.text(`Receipt No: EMM-${Date.now()}`, 20, 80)
  doc.text(`Date: ${currentDate}`, 20, 90)
  doc.text(`Payment ID: ${donationData.paymentId || "N/A"}`, 20, 100)

  // Donor information
  doc.setFont(undefined, "bold")
  doc.text("DONOR INFORMATION:", 20, 120)
  doc.setFont(undefined, "normal")
  doc.text(`Name: ${donationData.donorName}`, 20, 135)
  doc.text(`Email: ${donationData.email}`, 20, 145)
  if (donationData.phone) {
    doc.text(`Phone: ${donationData.phone}`, 20, 155)
  }

  // Donation details
  doc.setFont(undefined, "bold")
  doc.text("DONATION DETAILS:", 20, 175)
  doc.setFont(undefined, "normal")
  doc.text(`Amount: ₹${donationData.amount}`, 20, 190)
  doc.text(`Type: ${donationData.type === "monthly" ? "Monthly Donation" : "One-time Donation"}`, 20, 200)
  doc.text(`Status: Completed`, 20, 210)

  // Thank you message
  doc.setFillColor(...accentColor)
  doc.rect(15, 230, 180, 30, "F")
  doc.setTextColor(...primaryColor)
  doc.setFontSize(14)
  doc.setFont(undefined, "bold")
  doc.text("Thank you for your generous donation!", 20, 245)
  doc.setFontSize(10)
  doc.setFont(undefined, "normal")
  doc.text("Your contribution helps us spread God's love through music.", 20, 252)

  // Footer
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(8)
  doc.text("This is a computer-generated receipt. No signature required.", 20, 280)
  doc.text("Exodus Music Ministry | Email: info@exodusmusicministry.org", 20, 285)

  return doc
}

const Donate = () => {
  const controls = useAnimation()
  const { scrollYProgress } = useScroll()
  const [donationAmount, setDonationAmount] = useState("100")
  const [customAmount, setCustomAmount] = useState("")
  const [donationType, setDonationType] = useState("one-time")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [donationData, setDonationData] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Parallax effects
  const impactY = useTransform(
    scrollYProgress,
    [0.4, 0.6],
    [typeof window !== "undefined" ? (window.innerWidth > 768 ? 100 : 50) : 100, 0],
  )
  const otherWaysY = useTransform(
    scrollYProgress,
    [0.7, 0.9],
    [typeof window !== "undefined" ? (window.innerWidth > 768 ? 100 : 50) : 100, 0],
  )

  // Animation variants
  const fadeInUp = {
    hidden: { y: 60 },
    visible: {
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] },
    },
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  }

  // Success modal variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 },
    },
  }

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", delay: 0.5 },
    },
  }

  // Donation impact data
  const donationImpacts = [
    {
      amount: "₹1,000",
      title: "Music Resources",
      description: "Provides sheet music and resources for our worship team members.",
      icon: "🎵",
    },
    {
      amount: "₹5,000",
      title: "Equipment Maintenance",
      description: "Helps maintain our musical instruments and sound equipment.",
      icon: "🎸",
    },
    {
      amount: "₹10,000",
      title: "Youth Training",
      description: "Sponsors music training for young worship leaders in our community.",
      icon: "👥",
    },
    {
      amount: "₹25,000",
      title: "Outreach Events",
      description: "Funds a community worship event to reach those who need spiritual encouragement.",
      icon: "🙏",
    },
  ]

  // Handle donation amount selection
  const handleAmountSelect = (amount) => {
    setDonationAmount(amount)
    setCustomAmount("")
  }

  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setDonationAmount("custom")
  }

  // Handle donation type selection
  const handleDonationTypeChange = (type) => {
    setDonationType(type)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Save donation to Supabase
  const saveDonationToSupabase = async (paymentData) => {
    try {
      const finalAmount = donationAmount === "custom" ? customAmount : donationAmount
      const donationRecord = {
        payment_id: paymentData.razorpay_payment_id,
        amount: finalAmount,
        type: donationType,
        donor_name: `${formData.firstName} ${formData.lastName}`,
        donor_email: formData.email,
        donor_phone: formData.phone || null,
        payment_status: "completed",
        donation_date: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("donations").insert([donationRecord])

      if (error) {
        console.error("Error saving donation:", error)
        throw new Error(error.message)
      }

      // Store donation data for PDF generation
      setDonationData({
        paymentId: paymentData.razorpay_payment_id,
        amount: finalAmount,
        type: donationType,
        donorName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        date: new Date().toISOString(),
      })

      return data
    } catch (err) {
      console.error("Error in saveDonationToSupabase:", err)
      throw err
    }
  }

  // Handle PDF download
  const handleDownloadPDF = () => {
    if (!donationData) return

    // Load jsPDF
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    script.onload = () => {
      const doc = generateInvoicePDF(donationData)
      doc.save(`Exodus-Donation-Receipt-${Date.now()}.pdf`)
    }
    document.head.appendChild(script)
  }

  // Handle email receipt
  const handleEmailReceipt = () => {
    if (!donationData) return

    const subject = encodeURIComponent("Donation Receipt - Exodus Music Ministry")
    const body = encodeURIComponent(`Dear ${donationData.donorName},

Thank you for your generous donation of ₹${donationData.amount} to Exodus Music Ministry.

Your donation will help us continue spreading God's love through music and worship.

Payment ID: ${donationData.paymentId}
Date: ${new Date(donationData.date).toLocaleDateString()}

God bless you!

Exodus Music Ministry Team`)

    window.open(`mailto:${donationData.email}?subject=${subject}&body=${body}`)
  }

  // Handle Razorpay payment
  const handlePayment = async () => {
    try {
      setIsProcessing(true)
      const res = await initializeRazorpay()
      if (!res) {
        setError("Razorpay SDK failed to load")
        setIsProcessing(false)
        return
      }

      // Calculate final amount
      const finalAmount = donationAmount === "custom" ? customAmount : donationAmount
      if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) <= 0) {
        setError("Please enter a valid donation amount")
        setIsProcessing(false)
        return
      }

      // Razorpay options
      const options = {
        key: "rzp_test_72S71RvJ1kSI1j", // Replace with your Razorpay key
        amount: Number.parseInt(finalAmount) * 100, // Amount in paise
        currency: "INR",
        name: "Exodus Music Ministry",
        description: `${donationType === "monthly" ? "Monthly" : "One-time"} Donation`,
        handler: async (response) => {
          try {
            console.log("Payment successful", response)

            // Save donation directly after successful payment
            await saveDonationToSupabase({
              razorpay_payment_id: response.razorpay_payment_id,
            })

            // Show success modal
            setShowSuccessModal(true)

            // Reset form
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
            })
            setDonationAmount("100")
            setCustomAmount("")
          } catch (err) {
            console.error("Error in payment handler:", err)
            setError(err.message || "An error occurred during payment processing")
          } finally {
            setIsProcessing(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4338CA", // Indigo-700 color
        },
        modal: {
          ondismiss: () => {
            // Handle case when user closes the Razorpay modal
            setIsProcessing(false)
          },
        },
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (err) {
      console.error("Error in handlePayment:", err)
      setError(err.message || "An error occurred. Please try again.")
      setIsProcessing(false)
    }
  }

  // Handle donation form submission
  const handleDonateSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields")
      return
    }

    // Validate amount
    const finalAmount = donationAmount === "custom" ? customAmount : donationAmount
    if (!finalAmount || isNaN(Number(finalAmount)) || Number(finalAmount) <= 0) {
      setError("Please enter a valid donation amount")
      return
    }

    // Clear any previous errors
    setError(null)

    // Initialize payment
    handlePayment()
  }

  // Close success modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false)
    setSuccess(false)
    setDonationData(null)
  }

  return (
    <>
      {/* NavBar Component */}
      <NavBar />

      <div className="overflow-x-hidden bg-indigo-950 text-white">
        {/* Success Modal */}
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSuccessModal}
          >
            <motion.div
              className="bg-indigo-900 rounded-2xl p-8 max-w-md w-full border border-indigo-700 shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Animation */}
              <div className="text-center mb-6">
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <motion.svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      variants={checkmarkVariants}
                      initial="hidden"
                      animate="visible"
                    />
                  </motion.svg>
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold text-yellow-400 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  Transaction Completed!
                </motion.h3>

                <motion.p
                  className="text-indigo-100 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  Thank you for your generous donation of{" "}
                  <span className="font-bold text-yellow-400">₹{donationData?.amount}</span>
                </motion.p>

                {donationData && (
                  <motion.div
                    className="bg-indigo-800/50 rounded-lg p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                  >
                    <p className="text-sm text-indigo-200 mb-1">
                      <span className="font-medium">Payment ID:</span> {donationData.paymentId}
                    </p>
                    <p className="text-sm text-indigo-200 mb-1">
                      <span className="font-medium">Date:</span> {new Date(donationData.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-indigo-200">
                      <span className="font-medium">Type:</span>{" "}
                      {donationData.type === "monthly" ? "Monthly" : "One-time"} Donation
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Download Receipt (PDF)</span>
                </button>

                <button
                  onClick={handleEmailReceipt}
                  className="w-full bg-indigo-700 hover:bg-indigo-600 text-white py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Email Receipt</span>
                </button>

                <button
                  onClick={closeSuccessModal}
                  className="w-full bg-indigo-800 hover:bg-indigo-700 text-white py-3 rounded-lg font-bold transition-all duration-300"
                >
                  Thank you 
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Donation Form Section */}
        <motion.section
          className="py-24 bg-gradient-to-b from-indigo-950 to-indigo-900 overflow-hidden relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Support Our Ministry</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                Your generous donations help us spread God's love through music and worship
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Donation Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-indigo-800/80 backdrop-blur-sm p-10 rounded-2xl border border-indigo-700 shadow-2xl">
                  <form onSubmit={handleDonateSubmit}>
                    {/* Donation Type */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Donation Type</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <motion.button
                          type="button"
                          onClick={() => handleDonationTypeChange("one-time")}
                          className={`p-4 rounded-lg border ${
                            donationType === "one-time"
                              ? "bg-yellow-400 text-indigo-950 border-yellow-500"
                              : "bg-indigo-700/50 border-indigo-600 text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          One-Time Donation
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleDonationTypeChange("monthly")}
                          className={`p-4 rounded-lg border ${
                            donationType === "monthly"
                              ? "bg-yellow-400 text-indigo-950 border-yellow-500"
                              : "bg-indigo-700/50 border-indigo-600 text-white"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Monthly Donation
                        </motion.button>
                      </div>
                    </div>

                    {/* Donation Amount */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Donation Amount</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {["100", "500", "1000", "2500", "5000", "10000"].map((amount) => (
                          <motion.button
                            key={amount}
                            type="button"
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-4 rounded-lg border ${
                              donationAmount === amount
                                ? "bg-yellow-400 text-indigo-950 border-yellow-500"
                                : "bg-indigo-700/50 border-indigo-600 text-white"
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            ₹{amount}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4">
                        <motion.button
                          type="button"
                          onClick={() => handleAmountSelect("custom")}
                          className={`p-4 rounded-lg border ${
                            donationAmount === "custom"
                              ? "bg-yellow-400 text-indigo-950 border-yellow-500"
                              : "bg-indigo-700/50 border-indigo-600 text-white"
                          } w-1/3`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Custom
                        </motion.button>
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-indigo-300">₹</span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="Enter amount"
                            className="w-full px-8 py-4 bg-indigo-700/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-indigo-100 mb-1">First Name*</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-indigo-100 mb-1">Last Name*</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-indigo-100 mb-1">Email Address*</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-indigo-100 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-indigo-700/50 border border-indigo-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                        />
                      </div>
                    </div>

                    {/* Error message */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isProcessing}
                      whileHover={{
                        scale: isProcessing ? 1 : 1.05,
                        boxShadow: isProcessing ? "none" : "0px 5px 20px rgba(250, 204, 21, 0.4)",
                      }}
                      whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                      className={`w-full ${
                        isProcessing
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-yellow-500 to-yellow-400 hover:shadow-lg"
                      } text-indigo-950 px-10 py-4 rounded-full text-xl font-bold tracking-wide shadow-lg relative`}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-950"
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
                          Processing...
                        </span>
                      ) : donationType === "monthly" ? (
                        "Donate Monthly"
                      ) : (
                        "Donate Now"
                      )}
                    </motion.button>

                    <p className="text-center text-indigo-300 text-sm mt-4">
                      Your donation is secure and encrypted. You will receive a receipt via email.
                    </p>
                  </form>
                </div>
              </motion.div>

              {/* Why Donate */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl font-bold mb-6">Why Support Our Ministry?</h3>
                <div className="w-16 h-1 bg-yellow-400 mb-8"></div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700 shadow-xl"
                  >
                    <h4 className="text-xl font-bold mb-3 text-yellow-400">Spreading God's Word Through Music</h4>
                    <p className="text-indigo-100">
                      Your donations help us create and share worship music that touches hearts and brings people closer
                      to God. We believe music is a powerful tool for ministry and evangelism.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700 shadow-xl"
                  >
                    <h4 className="text-xl font-bold mb-3 text-yellow-400">Training the Next Generation</h4>
                    <p className="text-indigo-100">
                      We invest in training young musicians and worship leaders, equipping them with both musical skills
                      and spiritual foundations to lead worship in their communities.
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700 shadow-xl"
                  >
                    <h4 className="text-xl font-bold mb-3 text-yellow-400">Community Outreach</h4>
                    <p className="text-indigo-100">
                      Your support enables us to bring worship experiences to underserved communities, hospitals,
                      prisons, and other places where spiritual encouragement is needed most.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Donation Impact Section */}
        <motion.section
          className="py-20 bg-gradient-to-b from-indigo-900 to-indigo-950 overflow-hidden relative"
          style={{ y: impactY }}
        >
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Your Donation's Impact</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                See how your generous contributions make a difference in our ministry and communities
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {donationImpacts.map((impact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -12, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.3)" }}
                  className="bg-indigo-800/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-indigo-700 shadow-xl"
                >
                  <div className="text-5xl mb-6 mx-auto">{impact.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{impact.title}</h3>
                  <div className="w-12 h-1 bg-yellow-400 mx-auto mb-4"></div>
                  <p className="text-indigo-100 mb-6">{impact.description}</p>
                  <p className="text-yellow-400 text-2xl font-bold">{impact.amount}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-center mt-16"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(250, 204, 21, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 px-10 py-4 rounded-full text-lg font-bold tracking-wide shadow-lg"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Make a Difference Today
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Other Ways to Give Section */}
        <motion.section className="py-20 bg-indigo-950 overflow-hidden relative" style={{ y: otherWaysY }}>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">Other Ways to Give</h2>
              <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8"></div>
              <p className="text-lg md:text-xl max-w-3xl mx-auto text-indigo-100">
                Beyond financial donations, there are many ways you can support our ministry
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="bg-indigo-800/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-indigo-700 shadow-xl"
              >
                <div className="text-5xl mb-6 mx-auto">🎸</div>
                <h3 className="text-2xl font-bold mb-4">Donate Instruments</h3>
                <p className="text-indigo-100 mb-6">
                  Donate new or gently used musical instruments to help equip churches and worship teams that lack
                  resources.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  Learn More
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="bg-indigo-800/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-indigo-700 shadow-xl"
              >
                <div className="text-5xl mb-6 mx-auto">⏱️</div>
                <h3 className="text-2xl font-bold mb-4">Volunteer Your Time</h3>
                <p className="text-indigo-100 mb-6">
                  Share your skills and talents by volunteering with our ministry. We need help with events,
                  administration, and more.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  Volunteer Now
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="bg-indigo-800/60 backdrop-blur-sm p-8 rounded-2xl text-center border border-indigo-700 shadow-xl"
              >
                <div className="text-5xl mb-6 mx-auto">🙏</div>
                <h3 className="text-2xl font-bold mb-4">Prayer Support</h3>
                <p className="text-indigo-100 mb-6">
                  Commit to praying for our ministry regularly. Join our prayer team to receive specific prayer
                  requests.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  Join Prayer Team
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="bg-indigo-950 py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center">
              <p className="text-indigo-300 text-sm">
                © {new Date().getFullYear()} Exodus Music Ministry. All rights reserved.
              </p>
              <div className="flex items-center justify-center mt-4">
                <span className="text-yellow-400">♪</span>
                <span className="mx-2 text-indigo-300 text-sm">Glorifying God through music</span>
                <span className="text-yellow-400">♪</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Donate
