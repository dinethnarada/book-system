import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const district = searchParams.get('district')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    try {
        const [schools, total] = await Promise.all([
            prisma.school.findMany({
                where: {
                    AND: [
                        name ? { name: { contains: name, mode: 'insensitive' } } : {},
                        district ? { district: { contains: district, mode: 'insensitive' } } : {},
                    ],
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.school.count({
                where: {
                    AND: [
                        name ? { name: { contains: name, mode: 'insensitive' } } : {},
                        district ? { district: { contains: district, mode: 'insensitive' } } : {},
                    ],
                },
            }),
        ])

        const response = NextResponse.json({
            data: schools,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        })

        // Add Cache-Control header
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

        return response
    } catch (error) {
        console.error('Error fetching schools:', error)
        return NextResponse.json({ error: 'Failed to fetch schools' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, district, address, contactName, contactNumber } = body

        // Validate required fields
        if (!name || !district || !address || !contactName || !contactNumber) {
            return NextResponse.json(
                { error: 'Missing required fields: name, district, address, contactName, and contactNumber are required' },
                { status: 400 }
            )
        }

        // Validate phone number format (Sri Lankan)
        const cleanPhone = contactNumber.replace(/[\s-]/g, '')
        const phoneRegex = /^(?:0\d{9}|\+947\d{8})$/
        if (!phoneRegex.test(cleanPhone)) {
            return NextResponse.json(
                { error: 'Invalid phone number format. Please use Sri Lankan format (e.g., 0771234567)' },
                { status: 400 }
            )
        }

        // Check if school with the same name AND district already exists
        const existingSchool = await prisma.school.findFirst({
            where: {
                AND: [
                    {
                        name: {
                            equals: name,
                            mode: 'insensitive'
                        }
                    },
                    {
                        district: district
                    }
                ]
            }
        })

        if (existingSchool) {
            return NextResponse.json(
                { error: 'A school with this name already exists in this district. Please contact the school administrator' },
                { status: 409 }
            )
        }


        const school = await prisma.school.create({
            data: {
                name,
                district,
                address,
                contactName,
                contactNumber,
            },
        })
        return NextResponse.json(school, { status: 201 })
    } catch (error) {
        console.error('Error creating school:', error)
        return NextResponse.json({ error: 'Failed to create school', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
    }
}
