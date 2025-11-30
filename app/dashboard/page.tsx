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
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    // Get allowed next statuses based on current status
    const getAllowedNextStatuses = (currentStatus: string): string[] => {
        const transitions: Record<string, string[]> = {
            'PENDING': ['ASSIGNED'],
            'ASSIGNED': ['FULFILLED'],
            'FULFILLED': [] // Final state - no transitions
        }
        return transitions[currentStatus] || []
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <LayoutDashboard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                                <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Dashboard</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-all">
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Manage Requests</h1>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Create Request Card */}
                    <Link href="/requests/create" className="block group">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden shadow-sm rounded-xl hover:shadow-lg transition-all h-full border border-green-200">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-500 rounded-xl p-3 shadow-sm">
                                        <FileText className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 flex-1">
                                        <dt className="text-sm font-medium text-green-700 mb-1">Material Requests</dt>
                                        <dd className="text-xl font-bold text-gray-900">Create Request</dd>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-green-100 bg-opacity-50 px-6 py-3">
                                <div className="text-sm text-green-700 font-semibold group-hover:text-green-900 flex items-center">
                                    Get started <span className="ml-1 group-hover:ml-2 transition-all">→</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Status Update Widget */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
                        <div className="p-5 sm:p-6">
                            <div className="flex items-start sm:items-center mb-5">
                                <div className="flex-shrink-0 bg-blue-500 rounded-xl p-3 shadow-sm">
                                    <Key className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Update Request Status</h3>
                                    <p className="text-sm text-gray-600 mt-1">Enter your token to manage your request</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                                        Request Token
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            id="token"
                                            type="text"
                                            placeholder="Enter your token"
                                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 border px-4 py-2.5 transition-all"
                                            value={token}
                                            onChange={(e) => setToken(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleVerifyToken()}
                                        />
                                        <button
                                            onClick={handleVerifyToken}
                                            disabled={loading}
                                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                        >
                                            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                            {loading ? 'Verifying...' : 'Verify'}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in duration-300">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold text-xs">!</div>
                                        <p className="text-sm text-red-800 flex-1">{error}</p>
                                    </div>
                                )}

                                {updateSuccess && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-in fade-in duration-300">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs">✓</div>
                                        <p className="text-sm text-green-800 flex-1 font-medium">Status updated successfully!</p>
                                    </div>
                                )}

                                {request && (
                                    <div className="border-t border-gray-200 pt-5 space-y-5 animate-in fade-in duration-500">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-3 text-base">Request Details</h4>
                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3 text-sm border border-gray-200">
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span className="font-semibold text-gray-700">School:</span>
                                                    <span className="text-gray-900">{request.school.name}</span>
                                                </div>
                                                <div className="flex flex-wrap items-baseline gap-1">
                                                    <span className="font-semibold text-gray-700">District:</span>
                                                    <span className="text-gray-900">{request.school.district}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-gray-700">Current Status:</span>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(request.status)}`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-gray-700 block mb-2">Items:</span>
                                                    <ul className="space-y-1.5 ml-1">
                                                        {request.items.map((item, idx) => (
                                                            <li key={idx} className="text-gray-900 flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                                {item.material} <span className="font-semibold">(×{item.quantity})</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Update Status
                                            </label>
                                            {request.status === 'FULFILLED' ? (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                                                    <p className="font-semibold">✓ Request Fulfilled</p>
                                                    <p className="mt-1">This request has been completed and cannot be modified.</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col sm:flex-row gap-2">
                                                    <select
                                                        id="status"
                                                        className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500 border px-4 py-2.5 transition-all appearance-none bg-white"
                                                        value={selectedStatus}
                                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                                    >
                                                        <option value={request.status}>{request.status}</option>
                                                        {getAllowedNextStatuses(request.status).map((status) => (
                                                            <option key={status} value={status}>
                                                                {status}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={handleUpdateStatus}
                                                        disabled={updating || selectedStatus === request.status || getAllowedNextStatuses(request.status).length === 0}
                                                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
            </main>
        </div>
    )
}
