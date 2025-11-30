'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react'
import { SRI_LANKA_DISTRICTS } from '@/lib/constants'

interface School {
    id: string
    name: string
    district: string
    address: string | null
    contactName: string | null
    contact: string | null
    type: string
}

export default function CreateRequest() {
    const router = useRouter()
    const [schools, setSchools] = useState<School[]>([])
    const [description, setDescription] = useState('')
    const [items, setItems] = useState([{ material: '', quantity: 1 }])
    const [loading, setLoading] = useState(false)

    // Unified school form data
    const [schoolName, setSchoolName] = useState('')
    const [existingSchool, setExistingSchool] = useState<School | null>(null)
    const [district, setDistrict] = useState('')
    const [address, setAddress] = useState('')
    const [contactName, setContactName] = useState('')
    const [contact, setContact] = useState('')
    const [type, setType] = useState('Primary')

    // Phone validation state
    const [phoneError, setPhoneError] = useState('')

    // Token modal state
    const [showTokenModal, setShowTokenModal] = useState(false)
    const [generatedToken, setGeneratedToken] = useState('')
    const [tokenCopied, setTokenCopied] = useState(false)

    // Phone validation function for Sri Lankan numbers
    const validatePhone = (phone: string): boolean => {
        // Remove spaces and dashes for validation
        const cleanPhone = phone.replace(/[\s-]/g, '')
        // Sri Lankan phone patterns:
        // Mobile: 07XXXXXXXX (10 digits starting with 07)
        // International mobile: +947XXXXXXXX
        // Landline: 0XXXXXXXXX (10 digits starting with 0)
        const phoneRegex = /^(?:0\d{9}|\+947\d{8})$/
        return phoneRegex.test(cleanPhone)
    }

    // Handle phone input change with validation
    const handlePhoneChange = (value: string) => {
        setContact(value)
        if (value.trim() && !validatePhone(value)) {
            setPhoneError('Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)')
        } else {
            setPhoneError('')
        }
    }

    useEffect(() => {
        // Fetch schools
        fetch('/api/schools')
            .then(res => res.json())
            .then(data => setSchools(data))
            .catch(err => console.error('Failed to fetch schools:', err))
    }, [])

    // Check if school name exists
    useEffect(() => {
        if (schoolName.trim()) {
            const found = schools.find(
                school => school.name.toLowerCase() === schoolName.trim().toLowerCase()
            )
            setExistingSchool(found || null)

            // If found, populate fields with existing data
            if (found) {
                setDistrict(found.district)
                setAddress(found.address || '')
                setContactName(found.contactName || '')
                setContact(found.contact || '')
                setType(found.type)
            }
        } else {
            setExistingSchool(null)
        }
    }, [schoolName, schools])

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Prevent submission if school already exists
        if (existingSchool) {
            alert('This school is already registered. Please contact the school administrator to submit a request.')
            return
        }

        // Validate phone number
        if (!validatePhone(contact)) {
            setPhoneError('Please enter a valid Sri Lankan phone number before submitting')
            return
        }

        setLoading(true)
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
                    contact,
                    type,
                }),
            })

            if (!schoolRes.ok) {
                alert('Failed to create school')
                setLoading(false)
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
                // Show token modal
                setGeneratedToken(requestData.editToken)
                setShowTokenModal(true)
            } else {
                alert('Failed to create request')
            }
        } catch (error) {
            console.error(error)
            alert('Error creating request')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Request Educational Materials</h2>
                    <p className="text-sm sm:text-base text-gray-600">Fill out the form below to submit your request</p>
                </div>
                <div className="bg-white p-5 sm:p-8 rounded-xl shadow-lg border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Unified School Information */}
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    School Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="schoolName"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 border px-4 py-2.5 transition-all"
                                    value={schoolName}
                                    onChange={(e) => setSchoolName(e.target.value)}
                                    placeholder="Enter school name"
                                />

                                {/* Validation Message */}
                                {schoolName.trim() && existingSchool && (
                                    <div className="mt-3 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-in fade-in duration-300">
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
                                    <div className="mt-3 flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-green-800 flex-1">
                                            <p className="font-semibold">New school - please complete the details below</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Additional fields - shown always but disabled if school exists */}
                            <div>
                                <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                    District <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="district"
                                    required
                                    disabled={!!existingSchool}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="address"
                                    required
                                    disabled={!!existingSchool}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter school address"
                                    rows={2}
                                />
                            </div>

                            <div>
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                                    Contact Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contactName"
                                    type="text"
                                    required
                                    disabled={!!existingSchool}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                    placeholder="Enter contact person name"
                                />
                            </div>

                            <div>
                                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="contact"
                                    type="tel"
                                    required
                                    disabled={!!existingSchool}
                                    className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${phoneError ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    value={contact}
                                    onChange={(e) => handlePhoneChange(e.target.value)}
                                    placeholder="e.g., 0771234567 or +94771234567"
                                />
                                {phoneError && (
                                    <p className="mt-1 text-sm text-red-600">{phoneError}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    School Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="type"
                                    required
                                    disabled={!!existingSchool}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="Primary">Primary</option>
                                    <option value="Secondary">Secondary</option>
                                    <option value="Collegiate">Collegiate</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Request Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                required
                                disabled={!!existingSchool}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                            disabled={loading || !!existingSchool}
                            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
                        >
                            {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            {loading ? 'Submitting...' : existingSchool ? 'School Already Registered' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Token Modal */}
            {showTokenModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
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
                                        className="flex-shrink-0 p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-95"
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
                                router.push('/dashboard')
                            }}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold shadow-sm hover:shadow-md"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
