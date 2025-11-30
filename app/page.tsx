'use client'

import { useState, useEffect } from 'react'
import { FileText, MapPin, School as SchoolIcon, Clock, User, Phone, Search } from 'lucide-react'
import { SRI_LANKA_DISTRICTS } from '@/lib/constants'

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
    contact: string | null
  }
  items: {
    id: string
    material: string
    quantity: number
  }[]
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

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/materials/requests')
      const data = await res.json()
      if (Array.isArray(data)) {
        setRequests(data)
      } else {
        console.error('API returned non-array data:', data)
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
  }, [])

  // Extract unique districts from requests only - REMOVED in favor of static list
  // const uniqueDistricts = Array.from(new Set(requests.map(req => req.school.district))).sort()

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Educational Material Support System
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Supporting schools with educational materials. View current requests and help make a difference.
          </p>

          <div className="mt-6 sm:mt-8">
            <a href="/dashboard" className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all transform hover:scale-105 min-h-[44px] flex items-center justify-center">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Material Requests</h2>

        {/* Search Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Requests</h3>
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
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-sm hover:shadow-md"
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl">
                    <FileText className="text-blue-600 w-6 h-6" />
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
                  {request.school.contact && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{request.school.contact}</span>
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
                      <li className="text-sm text-blue-600 font-medium">
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
              <a href="/requests/create" className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                Create the first request →
              </a>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
