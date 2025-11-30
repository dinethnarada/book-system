'use client'

import { useState, useEffect } from 'react'
import { FileText, MapPin, School as SchoolIcon, Clock, User, Phone, Search } from 'lucide-react'

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
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch requests', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // Extract unique districts from requests only
  const uniqueDistricts = Array.from(new Set(requests.map(req => req.school.district))).sort()

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
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Educational Material Support System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Supporting schools with educational materials. View current requests and help make a difference.
          </p>

          <div className="mt-8">
            <a href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Requests Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Material Requests</h2>

        {/* Search Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <label htmlFor="searchSchool" className="block text-sm font-medium text-gray-700 mb-1">
                Search by School Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="searchSchool"
                  type="text"
                  placeholder="Enter school name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchSchool}
                  onChange={(e) => setSearchSchool(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <div className="relative">
              <label htmlFor="searchDistrict" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by District
              </label>
              <select
                id="searchDistrict"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {uniqueDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label htmlFor="searchStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                id="searchStatus"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>

          {(appliedFilters.school || appliedFilters.district || appliedFilters.status) && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredRequests.length} of {requests.length} requests
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <div key={request.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FileText className="text-blue-600 w-6 h-6" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SchoolIcon className="w-4 h-4 text-gray-600" />
                    <h3 className="text-lg font-bold text-gray-900">{request.school.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    {request.school.district}
                  </div>
                  {request.school.contactName && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4" />
                      {request.school.contactName}
                    </div>
                  )}
                  {request.school.contact && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      {request.school.contact}
                    </div>
                  )}
                </div>

                {request.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">{request.description}</p>
                )}

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Materials Needed:</p>
                  <ul className="space-y-1">
                    {request.items.slice(0, 3).map((item) => (
                      <li key={item.id} className="text-sm text-gray-600 flex justify-between">
                        <span>{item.material}</span>
                        <span className="font-medium">×{item.quantity}</span>
                      </li>
                    ))}
                    {request.items.length > 3 && (
                      <li className="text-sm text-gray-500 italic">
                        +{request.items.length - 3} more items
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(request.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              {requests.length === 0 ? 'No material requests yet.' : 'No requests match your search criteria.'}
            </p>
            <a href="/requests/create" className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium">
              Create the first request →
            </a>
          </div>
        )}
      </div>
    </main>
  )
}
