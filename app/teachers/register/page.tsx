'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface School {
    id: string
    name: string
}

export default function RegisterTeacher() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        nic: '',
        contact: '',
        schoolId: '',
        subjects: '',
    })
    const [schools, setSchools] = useState<School[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch schools for the dropdown
        fetch('/api/schools')
            .then((res) => res.json())
            .then((data) => setSchools(data))
            .catch((err) => console.error('Failed to fetch schools', err))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    subjects: formData.subjects.split(',').map((s) => s.trim()),
                }),
            })

            if (res.ok) {
                const data = await res.json()
                alert(`Teacher registered successfully! Your ID is: ${data.id}`)
                router.push('/dashboard')
            } else {
                alert('Failed to register teacher')
            }
        } catch (error) {
            console.error(error)
            alert('Error registering teacher')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Register as Teacher</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="nic" className="block text-sm font-medium text-gray-700">NIC / ID</label>
                        <input
                            id="nic"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.nic}
                            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input
                            id="contact"
                            type="text"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.contact}
                            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                    </div>
                    <div>
                        <label htmlFor="school" className="block text-sm font-medium text-gray-700">School</label>
                        <select
                            id="school"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.schoolId}
                            onChange={(e) => setFormData({ ...formData, schoolId: e.target.value })}
                        >
                            <option value="">Select a School</option>
                            {schools.map((school) => (
                                <option key={school.id} value={school.id}>
                                    {school.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="subjects" className="block text-sm font-medium text-gray-700">Subjects (comma separated)</label>
                        <input
                            id="subjects"
                            type="text"
                            placeholder="Math, Science"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 text-gray-900"
                            value={formData.subjects}
                            onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Registering...' : 'Register Teacher'}
                    </button>
                </form>
            </div>
        </div>
    )
}
