'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, School as SchoolIcon } from 'lucide-react'
import { SRI_LANKA_DISTRICTS } from '@/lib/constants'

interface School {
  id: string
  name: string
  district: string
  address: string | null
  type: string | null
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [districtTerm, setDistrictTerm] = useState('')
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(false)

  const searchSchools = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('name', searchTerm)
      if (districtTerm) params.append('district', districtTerm)

      const res = await fetch(`/api/schools?${params.toString()}`)
      const data = await res.json()
      setSchools(data)
    } catch (error) {
      console.error('Failed to fetch schools', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial load or debounce could go here
    searchSchools()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Educational Material Support System
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connecting schools, teachers, and contributors to improve education resources across the country.
          </p>

          {/* Search Box */}
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="search-school" className="sr-only">Search by school name</label>
              <Search className="absolute left-3 top-3 text-gray-400" />
              <input
                id="search-school"
                type="text"
                placeholder="Search by school name..."
                className="w-full pl-10 pr-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <label htmlFor="filter-district" className="sr-only">Filter by district</label>
              <MapPin className="absolute left-3 top-3 text-gray-400" />
              <select
                id="filter-district"
                className="w-full pl-10 pr-4 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                value={districtTerm}
                onChange={(e) => setDistrictTerm(e.target.value)}
              >
                <option value="">All Districts</option>
                {SRI_LANKA_DISTRICTS.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={searchSchools}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-md font-semibold transition-colors"
            >
              Search
            </button>
          </div>

          <div className="mt-8">
            <a href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registered Schools</h2>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading...</div>
        ) : schools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <div key={school.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <SchoolIcon className="text-blue-600 w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {school.type || 'School'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                <div className="text-gray-600 space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {school.district}
                  </p>
                  {school.address && <p>{school.address}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">No schools found matching your criteria.</p>
          </div>
        )}
      </div>
    </main>
  )
}
