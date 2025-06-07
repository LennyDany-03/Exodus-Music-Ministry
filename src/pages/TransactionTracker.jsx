"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "../lib/supabaseClient"
import Nav from "../components/Nav"
import {
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  X,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
} from "lucide-react"

const TransactionTracker = () => {
  const [donations, setDonations] = useState([])
  const [filteredDonations, setFilteredDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedDonation, setSelectedDonation] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalAmount: 0,
    successfulDonations: 0,
    pendingDonations: 0,
  })

  useEffect(() => {
    fetchDonations()
  }, [])

  useEffect(() => {
    filterDonations()
  }, [donations, searchTerm, statusFilter, typeFilter])

  const fetchDonations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false })

      if (error) throw error

      setDonations(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error("Error fetching donations:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (donationsData) => {
    const totalDonations = donationsData.length
    const totalAmount = donationsData.reduce((sum, donation) => sum + (Number.parseFloat(donation.amount) || 0), 0)
    const successfulDonations = donationsData.filter((d) => d.payment_status === "success").length
    const pendingDonations = donationsData.filter((d) => d.payment_status === "pending").length

    setStats({
      totalDonations,
      totalAmount,
      successfulDonations,
      pendingDonations,
    })
  }

  const filterDonations = () => {
    let filtered = donations

    if (searchTerm) {
      filtered = filtered.filter(
        (donation) =>
          donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donation.payment_id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((donation) => donation.payment_status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((donation) => donation.type === typeFilter)
    }

    setFilteredDonations(filtered)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const exportToCSV = () => {
    const headers = ["Date", "Donor Name", "Email", "Phone", "Amount", "Type", "Payment ID", "Status"]
    const csvData = filteredDonations.map((donation) => [
      formatDate(donation.donation_date),
      donation.donor_name,
      donation.donor_email,
      donation.donor_phone,
      donation.amount,
      donation.type,
      donation.payment_id,
      donation.payment_status,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `donations_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -5,
      scale: 1.02,
      transition: { duration: 0.2 },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950">
        <Nav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading transactions...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 relative overflow-hidden">
      <Nav />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Transaction Tracker
              </span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-6"></div>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Monitor and manage all donation transactions</p>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm">Total Donations</p>
                  <p className="text-2xl font-bold text-white">{stats.totalDonations}</p>
                </div>
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm">Total Amount</p>
                  <p className="text-2xl font-bold text-white">{formatAmount(stats.totalAmount)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm">Successful</p>
                  <p className="text-2xl font-bold text-white">{stats.successfulDonations}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingDonations}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>
          </div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or payment ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-4 py-2 bg-indigo-900/50 border border-indigo-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="all">All Types</option>
                  <option value="one-time">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="special">Special</option>
                </select>
              </div>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 text-indigo-950 rounded-lg font-semibold hover:from-yellow-400 hover:to-yellow-300 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </motion.div>

          {/* Donations List */}
          {filteredDonations.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">No Transactions Found</h3>
              <p className="text-indigo-200">
                {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "No donations have been made yet."}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDonations.map((donation, index) => (
                <motion.div
                  key={donation.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-indigo-800/60 backdrop-blur-sm p-6 rounded-xl border border-indigo-700 shadow-lg cursor-pointer"
                  onClick={() => {
                    setSelectedDonation(donation)
                    setShowModal(true)
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{donation.donor_name}</h3>
                        <p className="text-indigo-200 text-sm">{donation.donor_email}</p>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(donation.payment_status)}`}
                    >
                      {getStatusIcon(donation.payment_status)}
                      {donation.payment_status?.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-indigo-300 text-sm">Amount</p>
                      <p className="text-xl font-bold text-yellow-400">{formatAmount(donation.amount)}</p>
                    </div>
                    <div>
                      <p className="text-indigo-300 text-sm">Type</p>
                      <p className="text-white font-medium capitalize">{donation.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-indigo-200">
                      <Calendar className="w-4 h-4" />
                      {formatDate(donation.donation_date)}
                    </div>
                    <div className="flex items-center gap-2">
                      {donation.donor_email && (
                        <a
                          href={`mailto:${donation.donor_email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-indigo-700/50 rounded-lg hover:bg-indigo-600/50 transition-colors"
                        >
                          <Mail className="w-4 h-4 text-indigo-200" />
                        </a>
                      )}
                      {donation.donor_phone && (
                        <a
                          href={`tel:${donation.donor_phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-indigo-700/50 rounded-lg hover:bg-indigo-600/50 transition-colors"
                        >
                          <Phone className="w-4 h-4 text-indigo-200" />
                        </a>
                      )}
                      <div className="p-2 bg-yellow-400/20 rounded-lg">
                        <Eye className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Donation Detail Modal */}
      <AnimatePresence>
        {showModal && selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-indigo-900 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-indigo-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 bg-indigo-800 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-indigo-300 text-sm">Donor Name</label>
                    <p className="text-white font-medium">{selectedDonation.donor_name}</p>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Email</label>
                    <p className="text-white font-medium">{selectedDonation.donor_email}</p>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Phone</label>
                    <p className="text-white font-medium">{selectedDonation.donor_phone || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Amount</label>
                    <p className="text-2xl font-bold text-yellow-400">{formatAmount(selectedDonation.amount)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-indigo-300 text-sm">Payment ID</label>
                    <p className="text-white font-medium font-mono text-sm">{selectedDonation.payment_id}</p>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Type</label>
                    <p className="text-white font-medium capitalize">{selectedDonation.type}</p>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Status</label>
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(selectedDonation.payment_status)}`}
                    >
                      {getStatusIcon(selectedDonation.payment_status)}
                      {selectedDonation.payment_status?.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <label className="text-indigo-300 text-sm">Date</label>
                    <p className="text-white font-medium">{formatDate(selectedDonation.donation_date)}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <a
                  href={`mailto:${selectedDonation.donor_email}?subject=Thank you for your donation&body=Dear ${selectedDonation.donor_name},%0D%0A%0D%0AThank you for your generous donation of ${formatAmount(selectedDonation.amount)} to Exodus Music Ministry.`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                  Send Thank You
                </a>
                {selectedDonation.donor_phone && (
                  <a
                    href={`tel:${selectedDonation.donor_phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200"
                  >
                    <Phone className="w-4 h-4" />
                    Call Donor
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransactionTracker
