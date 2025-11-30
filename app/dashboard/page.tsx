import Link from 'next/link'
import { School, FileText, UserPlus, LayoutDashboard } from 'lucide-react'

export default function Dashboard() {
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
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    <Link href="/schools/add" className="block group">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                        <School className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">School Management</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">Add New School</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm text-blue-700 font-medium group-hover:text-blue-900">
                                    View details &rarr;
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/requests/create" className="block group">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
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

                    <Link href="/contributors/register" className="block group">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                        <UserPlus className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Contributors</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">Register Contributor</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm text-purple-700 font-medium group-hover:text-purple-900">
                                    View details &rarr;
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/teachers/register" className="block group">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
                                        <UserPlus className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Teachers</dt>
                                            <dd>
                                                <div className="text-lg font-medium text-gray-900">Register Teacher</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-5 py-3">
                                <div className="text-sm text-orange-700 font-medium group-hover:text-orange-900">
                                    View details &rarr;
                                </div>
                            </div>
                        </div>
                    </Link>

                </div>
            </main>
        </div>
    )
}
