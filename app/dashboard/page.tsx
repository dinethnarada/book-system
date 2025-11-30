'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, LayoutDashboard, Key, RefreshCw } from 'lucide-react'

interface MaterialRequest {
    id: string
    description: string | null
    status: string
    createdAt: string
    school: {
        name: string
        district: string
    }
    items: {
        material: string
        quantity: number
    }[]
}

export default function Dashboard() {
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [request, setRequest] = useState<MaterialRequest | null>(null)
    const [error, setError] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [updating, setUpdating] = useState(false)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const handleVerifyToken = async () => {
        if (!token.trim()) {
            setError('Please enter a token')
            return
        }

        setLoading(true)
        setError('')
        setRequest(null)

        try {
            const res = await fetch(`/api/materials/requests/${token}`)

            if (res.ok) {
                const data = await res.json()
                setRequest(data)
                setSelectedStatus(data.status)
            } else {
                const errorData = await res.json()
                setError(errorData.error || 'Invalid token')
            }
        } catch (err) {
            setError('Failed to verify token')
        } finally {
            setLoading(false)
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
                setRequest(data)
                setUpdateSuccess(true)
                setTimeout(() => setUpdateSuccess(false), 3000)
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800'
            case 'ASSIGNED': return 'bg-green-100 text-green-800'
            case 'FULFILLED': return 'bg-blue-100 text-blue-800'
            case 'REJECTED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <LayoutDashboard className="h-8 w-8 text-blue-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900">Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link href="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Create Request Card */}
                    <Link href="/requests/create" className="block group">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow h-full">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Material Requests</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">Create Request</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm text-green-700 font-medium group-hover:text-green-900">
                                    View details &rarr;
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Status Update Widget */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                    <Key className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-5">
                                    <h3 className="text-lg font-medium text-gray-900">Update Request Status</h3>
                                    <p className="text-sm text-gray-500">Enter your token to manage your request</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                                        Request Token
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="token"
                                            type="text"
                                            placeholder="Enter your token"
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleVerifyToken()}
                                        />
                                        <button
                                            onClick={handleVerifyToken}
                                            disabled={loading}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                                        >
                                            {loading ? 'Verifying...' : 'Verify'}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                        <p className="text-sm text-red-800">{error}</p>
                                    </div>
                                )}

                                {updateSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                                        <p className="text-sm text-green-800">✓ Status updated successfully!</p>
                                    </div>
                                )}

                                {request && (
                                    <div className="border-t pt-4 space-y-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Request Details</h4>
                                            <div className="bg-gray-50 rounded-md p-3 space-y-2 text-sm">
                                                <div>
                                                    <span className="font-medium text-gray-700">School:</span>{' '}
                                                    <span className="text-gray-900">{request.school.name}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">District:</span>{' '}
                                                    <span className="text-gray-900">{request.school.district}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Current Status:</span>{' '}
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Items:</span>
                                                    <ul className="mt-1 ml-4 list-disc">
                                                        {request.items.map((item, idx) => (
                                                            <li key={idx} className="text-gray-900">
                                                                {item.material} (×{item.quantity})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                                Update Status
                                            </label>
                                            <div className="flex gap-2">
                                                <select
                                                    id="status"
                                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                                    value={selectedStatus}
                                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="ASSIGNED">Assigned</option>
                                                    <option value="FULFILLED">Fulfilled</option>
                                                    <option value="REJECTED">Rejected</option>
                                                </select>
                                                <button
                                                    onClick={handleUpdateStatus}
                                                    disabled={updating || selectedStatus === request.status}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
                                                >
                                                    <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                                                    {updating ? 'Updating...' : 'Update'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}
