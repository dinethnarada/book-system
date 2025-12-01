'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CheckCircle, Search, Edit, Plus, AlertCircle, HelpCircle } from 'lucide-react'

export default function GuidePage() {
    const [language, setLanguage] = useState<'en' | 'si'>('en')

    const content = {
        en: {
            title: "How to Use EduReliefLK",
            subtitle: "A step by step guide to requesting and managing educational material support.",
            backToHome: "Back to Home",
            sections: [
                {
                    title: "Submitting a Request",
                    icon: <Plus className="w-6 h-6 text-teal-600" />,
                    steps: [
                        "Click on the 'Submit a Request' button on the homepage.",
                        "Fill in your school details (Name, District, Address, Contact).",
                        "Add the materials you need (Item name and Quantity). You can add multiple items.",
                        "Click 'Submit Request'.",
                        "IMPORTANT: After submission, you will see a 'Request Token'. Please save this token! You will need it to update your request status later."
                    ]
                },
                {
                    title: "Updating Request Status",
                    icon: <Edit className="w-6 h-6 text-amber-600" />,
                    steps: [
                        "Click on the 'Edit Request Status' button on the homepage.",
                        "Enter the 'Request Token' you received when you submitted the request.",
                        "Click 'Verify'.",
                        "If the token is valid, you can see your request details.",
                        "Select the new status (Pending -> Assigned -> Fulfilled) and click 'Update Status'."
                    ]
                },
                {
                    title: "Searching for Requests",
                    icon: <Search className="w-6 h-6 text-blue-600" />,
                    steps: [
                        "Scroll down to the 'Material Requests' section on the homepage.",
                        "You can filter requests by School Name, District, or Status.",
                        "Click 'Search' to find specific requests.",
                        "Click 'Clear Filters' to see all requests again."
                    ]
                }
            ],
            note: "If you have any issues, please contact us at +94 (078) 869-5286."
        },
        si: {
            title: "EduReliefLK භාවිතා කරන ආකාරය",
            subtitle: "පාසල් උපකරණ ඉල්ලීම් සහ කළමනාකරණය සඳහා පියවරෙන් පියවර උපදෙස්.",
            backToHome: "මුල් පිටුවට",
            sections: [
                {
                    title: "ඉල්ලීමක් ඉදිරිපත් කිරීම",
                    icon: <Plus className="w-6 h-6 text-teal-600" />,
                    steps: [
                        "මුල් පිටුවේ ඇති 'Submit a Request' බොත්තම ක්ලික් කරන්න.",
                        "ඔබගේ පාසලේ විස්තර පුරවන්න (නම, දිස්ත්‍රික්කය, ලිපිනය, දුරකථන අංකය).",
                        "ඔබට අවශ්‍ය ද්‍රව්‍ය එක් කරන්න (ද්‍රව්‍යයේ නම සහ ප්‍රමාණය). ඔබට ද්‍රව්‍ය කිහිපයක් එක් කළ හැක.",
                        " 'Submit Request' ක්ලික් කරන්න.",
                        "වැදගත්: ඉල්ලීම යොමු කළ පසු ඔබට 'Request Token' එකක් ලැබෙනු ඇත. එය සුරක්ෂිතව තබා ගන්න! පසුව ඉල්ලීමේ තත්වය යාවත්කාලීන කිරීමට එය අවශ්‍ය වේ."
                    ]
                },
                {
                    title: "ඉල්ලීමේ තත්වය යාවත්කාලීන කිරීම",
                    icon: <Edit className="w-6 h-6 text-amber-600" />,
                    steps: [
                        "මුල් පිටුවේ ඇති 'Edit Request Status' බොත්තම ක්ලික් කරන්න.",
                        "ඉල්ලීම ඉදිරිපත් කරන විට ඔබට ලැබුණු 'Request Token' එක ඇතුළත් කරන්න.",
                        " 'Verify' ක්ලික් කරන්න.",
                        "ටෝකනය නිවැරදි නම්, ඔබට ඉල්ලීමේ විස්තර දැකගත හැක.",
                        "නව තත්වය තෝරා (Pending -> Assigned -> Fulfilled) 'Update Status' ක්ලික් කරන්න."
                    ]
                },
                {
                    title: "ඉල්ලීම් සොයන ආකාරය",
                    icon: <Search className="w-6 h-6 text-blue-600" />,
                    steps: [
                        "මුල් පිටුවේ පහළට ඇති 'Material Requests' කොටසට යන්න.",
                        "ඔබට පාසලේ නම, දිස්ත්‍රික්කය හෝ තත්වය අනුව ඉල්ලීම් පෙරහන් (filter) කළ හැක.",
                        "අවශ්‍ය ඉල්ලීම් සොයා ගැනීමට 'Search' ක්ලික් කරන්න.",
                        "සියලුම ඉල්ලීම් නැවත බැලීමට 'Clear Filters' ක්ලික් කරන්න."
                    ]
                }
            ],
            note: "ඔබට යම් ගැටළුවක් ඇත්නම්, කරුණාකර +94 (078) 869-5286 හරහා අපව අමතන්න."
        }
    }

    const t = content[language]

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-teal-900 text-white py-12 px-4 sm:px-6 shadow-lg">
                <div className="container mx-auto max-w-4xl">
                    <Link href="/" className="inline-flex items-center text-teal-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.backToHome}
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t.title}</h1>
                            <p className="text-teal-100 text-lg">{t.subtitle}</p>
                        </div>

                        {/* Language Toggle */}
                        <div className="bg-teal-800/50 p-1 rounded-lg inline-flex flex-shrink-0 self-start md:self-center">
                            <button
                                onClick={() => setLanguage('en')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'en'
                                    ? 'bg-white text-teal-900 shadow-sm'
                                    : 'text-teal-100 hover:bg-teal-700/50'
                                    }`}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setLanguage('si')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${language === 'si'
                                    ? 'bg-white text-teal-900 shadow-sm'
                                    : 'text-teal-100 hover:bg-teal-700/50'
                                    }`}
                            >
                                සිංහල
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 -mt-8">
                <div className="grid gap-8">
                    {t.sections.map((section, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                                </div>

                                <div className="space-y-4">
                                    {section.steps.map((step, stepIndex) => (
                                        <div key={stepIndex} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center font-bold text-sm border border-teal-100">
                                                {stepIndex + 1}
                                            </div>
                                            <p className="text-gray-700 pt-1 leading-relaxed">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Help Note */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
                        <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                        <p className="text-blue-800 font-medium">
                            {t.note}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
