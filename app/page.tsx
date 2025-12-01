'use client'

import { useState, useEffect } from 'react'
import { FileText, MapPin, School as SchoolIcon, Clock, User, Phone, Search, Edit, Plus, RefreshCw, Key, Trash2, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react'
import { SRI_LANKA_DISTRICTS } from '@/lib/constants'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MaterialRequest {
  id: string
  description: string | null
  status: string
  createdAt: string
  school: {
    id: string
    name: string
    district: string
    contactName: string | null
    contactNumber: string | null
  }
  items: {
    id: string
    material: string
    quantity: number
  }[]
}

interface School {
  id: string
  name: string
  district: string
  address: string | null
  contactName: string | null
  contactNumber: string | null
  type: string
}

export default function Home() {
  const [requests, setRequests] = useState<MaterialRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [searchSchool, setSearchSchool] = useState('')
  const [searchDistrict, setSearchDistrict] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [appliedFilters, setAppliedFilters] = useState({
    school: '',
    district: '',
    status: ''
  })

  // Dashboard modal states
  const [showEditModal, setShowEditModal] = useState(false)
  const [token, setToken] = useState('')
  const [modalLoading, setModalLoading] = useState(false)
  const [editRequest, setEditRequest] = useState<MaterialRequest | null>(null)
  const [error, setError] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Submit request modal states
  const router = useRouter()
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([{ material: '', quantity: 1 }])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [schoolName, setSchoolName] = useState('')
  const [existingSchool, setExistingSchool] = useState<School | null>(null)
  const [district, setDistrict] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('')
  const [tokenCopied, setTokenCopied] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/materials/requests')
      const responseData = await res.json()
      if (responseData.data && Array.isArray(responseData.data)) {
        setRequests(responseData.data)
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Failed to fetch requests', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
    // Fetch schools for submit modal
    fetch('/api/schools')
      .then(res => res.json())
      .then(responseData => {
        if (responseData.data && Array.isArray(responseData.data)) {
          setSchools(responseData.data)
        }
      })
      .catch(err => console.error('Failed to fetch schools:', err))
  }, [])

  // Phone validation function for Sri Lankan numbers
  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s-]/g, '')
    const phoneRegex = /^(?:0\d{9}|\+947\d{8})$/
    return phoneRegex.test(cleanPhone)
  }

  // Handle phone input change with validation
  const handlePhoneChange = (value: string) => {
    setContactNumber(value)
    if (value.trim() && !validatePhone(value)) {
      setPhoneError('Please enter a valid Sri Lankan phone number (e.g., 0771234567)')
    } else {
      setPhoneError('')
    }
  }

  // Check if school name exists
  useEffect(() => {
    if (schoolName.trim()) {
      const found = schools.length > 0 && schools.find(
        school => school.name.toLowerCase() === schoolName.trim().toLowerCase()
      )
      setExistingSchool(found || null)

      if (found) {
        setDistrict(found.district)
        setAddress(found.address || '')
        setContactName(found.contactName || '')
        setContactNumber(found.contactNumber || '')
      }
    } else {
      setExistingSchool(null)
    }
  }, [schoolName, schools])

  // Item management functions
  const addItem = () => {
    setItems([...items, { material: '', quantity: 1 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  // Submit request handler
  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (existingSchool) {
      alert('This school is already registered. Please contact the school administrator to submit a request.')
      return
    }

    if (!validatePhone(contactNumber)) {
      setPhoneError('Please enter a valid Sri Lankan phone number before submitting')
      return
    }

    setSubmitLoading(true)
    try {
      // Create new school
      const schoolRes = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schoolName,
          district,
          address,
          contactName,
          contactNumber,
        }),
      })

      if (!schoolRes.ok) {
        alert('Failed to create school')
        setSubmitLoading(false)
        return
      }

      const newSchool = await schoolRes.json()

      // Create the material request
      const res = await fetch('/api/materials/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: newSchool.id,
          description,
          items,
        }),
      })

      if (res.ok) {
        const requestData = await res.json()
        setGeneratedToken(requestData.editToken)
        setShowSubmitModal(false)
        setShowTokenModal(true)
        // Refresh requests list
        fetchRequests()
        // Reset form
        resetSubmitForm()
      } else {
        alert('Failed to create request')
      }
    } catch (error) {
      console.error(error)
      alert('Error creating request')
    } finally {
      setSubmitLoading(false)
    }
  }

  const resetSubmitForm = () => {
    setSchoolName('')
    setDistrict('')
    setAddress('')
    setContactName('')
    setContactNumber('')
    setDescription('')
    setItems([{ material: '', quantity: 1 }])
    setPhoneError('')
    setExistingSchool(null)
  }


  // Handle search button click
  const handleSearch = () => {
    setAppliedFilters({
      school: searchSchool,
      district: searchDistrict,
      status: searchStatus
    })
  }

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchSchool('')
    setSearchDistrict('')
    setSearchStatus('')
    setAppliedFilters({
      school: '',
      district: '',
      status: ''
    })
  }

  // Dashboard handlers
  const handleVerifyToken = async () => {
    if (!token.trim()) {
      setError('Please enter a token')
      return
    }

    setModalLoading(true)
    setError('')
    setEditRequest(null)

    try {
      const res = await fetch(`/api/materials/requests/${token}`)

      if (res.ok) {
        const data = await res.json()
        setEditRequest(data)
        setSelectedStatus(data.status)
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Invalid token')
      }
    } catch (err) {
      setError('Failed to verify token')
    } finally {
      setModalLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    if (!token || !selectedStatus) return

    setUpdating(true)
    setUpdateSuccess(false)
    setError('')

    try {
      const res = await fetch(`/api/materials/requests/${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (res.ok) {
        const data = await res.json()
        setEditRequest(data)
        setUpdateSuccess(true)
        setTimeout(() => setUpdateSuccess(false), 3000)
        // Refresh the main requests list
        fetchRequests()
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Failed to update status')
      }
    } catch (err) {
      setError('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  const getAllowedNextStatuses = (currentStatus: string): string[] => {
    const transitions: Record<string, string[]> = {
      'PENDING': ['ASSIGNED'],
      'ASSIGNED': ['FULFILLED'],
      'FULFILLED': []
    }
    return transitions[currentStatus] || []
  }

  // Filter requests based on applied search criteria
  const filteredRequests = requests.filter((request) => {
    const matchesSchool = appliedFilters.school === '' ||
      request.school.name.toLowerCase().includes(appliedFilters.school.toLowerCase())
    const matchesDistrict = appliedFilters.district === '' ||
      request.school.district === appliedFilters.district
    const matchesStatus = appliedFilters.status === '' ||
      request.status === appliedFilters.status
    return matchesSchool && matchesDistrict && matchesStatus
  })

  // Calculate statistics
  const pendingCount = requests.filter(r => r.status === 'PENDING').length
  const assignedCount = requests.filter(r => r.status === 'ASSIGNED').length
  const fulfilledCount = requests.filter(r => r.status === 'FULFILLED').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED': return 'bg-green-100 text-green-800'
      case 'FULFILLED': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image */}
      <div className="relative bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white py-20 sm:py-32 overflow-hidden">
        {/* Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: 'url(/flood-hero-bg.jpg)',
            backgroundBlendMode: 'multiply'
          }}
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 via-teal-800/70 to-emerald-900/80" />

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-400/30 rounded-full">
            <span className="text-amber-200 font-semibold text-sm">🇱🇰 Supporting Flood Affected Students In Sri Lanka</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 sm:mb-8 leading-tight">
            What We Can Do,<br />
            <span className="text-amber-300">For Rebuild Education</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-3xl mx-auto px-4 leading-relaxed text-teal-50">
            ගංවතුරෙන් අවතැන් වී සිටින ලමුන් සදහා පාසල් උපකරණ ලබාදීමේ වැඩසටහන. මේ ඔවුන්ට ඔබගේ උදව් අවශය මොහොතයි.
          </p>
        </div>
      </div>

      {/* Dashboard Action Cards */}
      <div className="bg-white py-12 sm:py-16 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Submit Request Card */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="block group w-full text-left"
              >
                <div className="bg-white border-2 border-gray-200 hover:border-teal-500 rounded-2xl p-8 transition-all hover:shadow-xl h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-6 mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <Plus className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Submit a Request</h3>
                    <p className="text-gray-600 mb-6">
                      සිසුන් සදහා අවශය පාසල් උපකරණ සදහා ඉල්ලීමක් යොමුකරන්න
                    </p>
                  </div>
                </div>
              </button>

              {/* Edit Request Card */}
              <button
                onClick={() => setShowEditModal(true)}
                className="block group w-full text-left"
              >
                <div className="bg-white border-2 border-gray-200 hover:border-teal-500 rounded-2xl p-8 transition-all hover:shadow-xl h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 mb-6 shadow-lg group-hover:scale-110 transition-transform">
                      <Edit className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Edit Request Status</h3>
                    <p className="text-gray-600 mb-6">
                      ඉල්ලීමක නව තත්වය වෙනස් කිර්‍රම
                    </p>
                  </div>
                </div>
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">Material Requests</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              පාසල් උපකරණ සදහා ඉල්ලීම් සොයන්න
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 sm:p-6 rounded-xl border border-yellow-100">
                <div className="text-3xl sm:text-4xl font-bold text-yellow-700 mb-1">{pendingCount}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700">Pending Requests</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-100">
                <div className="text-3xl sm:text-4xl font-bold text-green-700 mb-1">{assignedCount}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700">Assigned Requests</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 sm:p-6 rounded-xl border border-blue-100">
                <div className="text-3xl sm:text-4xl font-bold text-blue-700 mb-1">{fulfilledCount}</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-700">Fulfilled Requests</div>
              </div>
            </div>
          </div>

          {/* Search Filters */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 Filter Requests</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <label htmlFor="searchSchool" className="block text-sm font-medium text-gray-700 mb-2">
                  Search by School Name
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="searchSchool"
                    type="text"
                    placeholder="Enter school name..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    value={searchSchool}
                    onChange={(e) => setSearchSchool(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="searchDistrict" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by District
                </label>
                <select
                  id="searchDistrict"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none bg-white"
                  value={searchDistrict}
                  onChange={(e) => setSearchDistrict(e.target.value)}
                >
                  <option value="">All Districts</option>
                  {SRI_LANKA_DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label htmlFor="searchStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  id="searchStatus"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all appearance-none bg-white"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="FULFILLED">Fulfilled</option>
                </select>
              </div>
            </div>

            {/* Search and Clear Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-all font-medium shadow-sm hover:shadow-md"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all font-medium"
              >
                Clear Filters
              </button>
            </div>

            {(appliedFilters.school || appliedFilters.district || appliedFilters.status) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> of <span className="font-semibold text-gray-900">{requests.length}</span> requests
                </p>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              <p className="mt-4 text-gray-500">Loading requests...</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRequests.map((request) => (
                <div key={request.id} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-teal-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-gradient-to-br from-teal-100 to-emerald-50 p-3 rounded-xl">
                      <FileText className="text-teal-600 w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <SchoolIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1">{request.school.name}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{request.school.district}</span>
                    </div>
                    {request.school.contactName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{request.school.contactName}</span>
                      </div>
                    )}
                    {request.school.contactNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{request.school.contactNumber}</span>
                      </div>
                    )}
                  </div>

                  {request.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">{request.description}</p>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Materials Needed:</p>
                    <ul className="space-y-1.5">
                      {request.items.slice(0, 3).map((item) => (
                        <li key={item.id} className="text-sm text-gray-600 flex justify-between items-center">
                          <span className="line-clamp-1 flex-1">{item.material}</span>
                          <span className="font-semibold text-gray-900 ml-2">×{item.quantity}</span>
                        </li>
                      ))}
                      {request.items.length > 3 && (
                        <li className="text-sm text-teal-600 font-medium">
                          +{request.items.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto px-4">
                <p className="text-gray-500 mb-4">
                  {requests.length === 0 ? 'No material requests yet.' : 'No requests match your search criteria.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Edit Request</h2>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditRequest(null)
                  setToken('')
                  setError('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="modal-token" className="block text-sm font-medium text-gray-700 mb-2">
                    Request Token
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id="modal-token"
                      type="text"
                      placeholder="Enter your token"
                      className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 transition-all"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleVerifyToken()}
                    />
                    <button
                      onClick={handleVerifyToken}
                      disabled={modalLoading}
                      className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      {modalLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      {modalLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">!</div>
                    <p className="text-sm text-red-800 flex-1">{error}</p>
                  </div>
                )}

                {updateSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs">✓</div>
                    <p className="text-sm text-green-800 flex-1 font-medium">Status updated successfully!</p>
                  </div>
                )}

                {editRequest && (
                  <div className="border-t border-gray-200 pt-5 space-y-5">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 text-base">Request Details</h4>
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 text-sm border border-gray-200">
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="font-semibold text-gray-700">School:</span>
                          <span className="text-gray-900">{editRequest.school.name}</span>
                        </div>
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="font-semibold text-gray-700">District:</span>
                          <span className="text-gray-900">{editRequest.school.district}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold text-gray-700">Current Status:</span>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(editRequest.status)}`}>
                            {editRequest.status}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700 block mb-2">Items:</span>
                          <ul className="space-y-1.5 ml-1">
                            {editRequest.items.map((item, idx) => (
                              <li key={idx} className="text-gray-900 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                                {item.material} <span className="font-semibold">(×{item.quantity})</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="modal-status" className="block text-sm font-semibold text-gray-700 mb-2">
                        Update Status
                      </label>
                      {editRequest.status === 'FULFILLED' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                          <p className="font-semibold">✓ Request Fulfilled</p>
                          <p className="mt-1">This request has been completed and cannot be modified.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="relative flex-1">
                            <select
                              id="modal-status"
                              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 pr-10 transition-all appearance-none bg-white cursor-pointer hover:border-teal-400"
                              value={selectedStatus}
                              onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                              <option value={editRequest.status}>{editRequest.status}</option>
                              {getAllowedNextStatuses(editRequest.status).map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                          <button
                            onClick={handleUpdateStatus}
                            disabled={updating || selectedStatus === editRequest.status || getAllowedNextStatuses(editRequest.status).length === 0}
                            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                          >
                            <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                            {updating ? 'Updating...' : 'Update'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )
      }

      {/* Submit Request Modal */}
      {
        showSubmitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-2xl font-bold text-gray-900">Request Educational Materials</h2>
                <button
                  onClick={() => {
                    setShowSubmitModal(false)
                    resetSubmitForm()
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmitRequest} className="space-y-6">
                  {/* School Information */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-2">
                        School Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="schoolName"
                        type="text"
                        required
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 transition-all"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter school name"
                      />

                      {schoolName.trim() && existingSchool && (
                        <div className="mt-3 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-red-800 flex-1">
                            <p className="font-semibold mb-1">School already registered</p>
                            <p>
                              This school ({existingSchool.name}) is already in our system.
                              Please contact the school administrator to submit a material request.
                            </p>
                          </div>
                        </div>
                      )}

                      {schoolName.trim() && !existingSchool && (
                        <div className="mt-3 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-green-800 flex-1">
                            <p className="font-semibold">New school - please complete the details below</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="district"
                          required
                          disabled={!!existingSchool}
                          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer transition-all hover:border-teal-400"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        >
                          <option value="">Select District</option>
                          {SRI_LANKA_DISTRICTS.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="address"
                        required
                        disabled={!!existingSchool}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter school address"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactName"
                        type="text"
                        required
                        disabled={!!existingSchool}
                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter contact person name"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contactNumber"
                        type="tel"
                        required
                        disabled={!!existingSchool}
                        className={`block w-full rounded-lg shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed ${phoneError ? 'border-red-500' : 'border-gray-300'
                          }`}
                        value={contactNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="e.g., 0771234567"
                      />
                      {phoneError && (
                        <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Request Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      required
                      disabled={!!existingSchool}
                      rows={3}
                      className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the materials needed and their purpose"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Items Needed <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addItem}
                        disabled={!!existingSchool}
                        className="text-sm text-teal-600 hover:text-teal-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" /> Add Item
                      </button>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Material Name (e.g., Textbooks)"
                            required
                            disabled={!!existingSchool}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={item.material}
                            onChange={(e) => updateItem(index, 'material', e.target.value)}
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            min="1"
                            required
                            disabled={!!existingSchool}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-500 border px-4 py-2.5 disabled:bg-gray-100 disabled:cursor-not-allowed"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            disabled={!!existingSchool}
                            className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading || !!existingSchool}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                  >
                    {submitLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    {submitLoading ? 'Submitting...' : existingSchool ? 'School Already Registered' : 'Submit Request'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Token Success Modal */}
      {
        showTokenModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Request Created!</h3>
                  <p className="text-sm text-gray-600">Your request has been submitted successfully</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Please save this unique token to update your request status later:
                </p>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between gap-3">
                    <code className="text-sm sm:text-base font-mono text-gray-900 break-all flex-1 font-semibold">
                      {generatedToken}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedToken)
                        setTokenCopied(true)
                        setTimeout(() => setTokenCopied(false), 2000)
                      }}
                      className="flex-shrink-0 p-2.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-all active:scale-95"
                      title="Copy to clipboard"
                    >
                      {tokenCopied ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    <strong className="font-bold">⚠️ Important:</strong> Save this token in a safe place. You will need it to update your request status. This token cannot be recovered if lost.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowTokenModal(false)
                  setGeneratedToken('')
                  setTokenCopied(false)
                }}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 active:bg-teal-800 transition-all font-semibold shadow-sm hover:shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        )
      }
    </main >
  )
}
