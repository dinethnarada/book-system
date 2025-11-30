'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

export default function CreateRequest() {
    const router = useRouter()
    const [teacherId, setTeacherId] = useState('') // Ideally fetched from auth context
    const [description, setDescription] = useState('')
    const [urgency, setUrgency] = useState('NORMAL')
    const [items, setItems] = useState([{ material: '', quantity: 1 }])
    const [loading, setLoading] = useState(false)

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
        setLoading(true)
        try {
            // For demo purposes, we might need a valid teacherId. 
            // In a real app, this comes from the logged-in user.
            // If teacherId is empty, the API will fail due to foreign key constraint.
            // We'll assume the user inputs a valid ID for now or we fetch it.

            const res = await fetch('/api/materials/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teacherId,
                    description,
                    urgency,
                    items,
                }),
            })

            if (res.ok) {
                router.push('/dashboard') // Redirect to dashboard
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Request Educational Materials</h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Teacher ID Input (Temporary until Auth is fully integrated) */}
                    <div>
                        <label htmlFor="teacherId" className="block text-sm font-medium text-gray-700">Teacher ID</label>
                        <input
                            id="teacherId"
                            type="text"
                            required
                            placeholder="Enter your Teacher ID"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            required
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency</label>
                        <select
                            id="urgency"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                        >
                            <option value="LOW">Low</option>
                            <option value="NORMAL">Normal</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Items Needed</label>
                            <button
                                type="button"
                                onClick={addItem}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={item.material}
                                        onChange={(e) => updateItem(index, 'material', e.target.value)}
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                {items.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>
        </div>
    )
}
