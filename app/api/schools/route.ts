import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name')
    const district = searchParams.get('district')

    try {
        const schools = await prisma.school.findMany({
            where: {
                AND: [
                    name ? { name: { contains: name, mode: 'insensitive' } } : {},
                    district ? { district: { contains: district, mode: 'insensitive' } } : {},
                ],
            },
        })
        return NextResponse.json(schools)
    } catch (error) {
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
                { error: 'Invalid phone number format. Please use Sri Lankan format (e.g., 0771234567 or +94771234567)' },
                { status: 400 }
            )
        }

        console.log('Creating school with data:', { name, district, address, contactName, contactNumber })

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
