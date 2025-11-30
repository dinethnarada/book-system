'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'

export default function RegisterContributor() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        type: 'INDIVIDUAL',
        organization: '',
        contact: '',
        address: '',
    })
    const [materials, setMaterials] = useState([{ materialType: '', quantity: 0, notes: '' }])
    const [loading, setLoading] = useState(false)

    const addMaterial = () => {
        setMaterials([...materials, { materialType: '', quantity: 0, notes: '' }])
    }

    const removeMaterial = (index: number) => {
        setMaterials(materials.filter((_, i) => i !== index))
    }

    const updateMaterial = (index: number, field: string, value: string | number) => {
        const newMaterials = [...materials]
        // @ts-ignore
        newMaterials[index] = { ...newMaterials[index], [field]: value }
        setMaterials(newMaterials)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/contributors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    materials,
                }),
            })

            if (res.ok) {
                router.push('/')
            } else {
                alert('Failed to register contributor')
            }
        } catch (error) {
            console.error(error)
            alert('Error registering contributor')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Register as Contributor</h2>
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                id="name"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select
                            id="type"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="INDIVIDUAL">Individual</option>
                            <option value="ORGANIZATION">Organization</option>
                        </select>
                    </div>

                    {formData.type === 'ORGANIZATION' && (
                        <div>
                            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">Organization Name</label>
                            <input
                                id="organization"
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.organization}
                                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact</label>
                            <input
                                id="contact"
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input
                                id="address"
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-medium text-gray-700">Materials You Can Provide</label>
                            <button
                                type="button"
                                onClick={addMaterial}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" /> Add Material
                            </button>
                        </div>

                        {materials.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-3 rounded-md">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Material Type"
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={item.materialType}
                                        onChange={(e) => updateMaterial(index, 'materialType', e.target.value)}
                                    />
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        placeholder="Qty"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={item.quantity}
                                        onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Notes"
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        value={item.notes}
                                        onChange={(e) => updateMaterial(index, 'notes', e.target.value)}
                                    />
                                </div>
                                {materials.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeMaterial(index)}
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    )
}
