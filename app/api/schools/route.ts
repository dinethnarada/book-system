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
        const { name, district, address, contact, type } = body

        const school = await prisma.school.create({
            data: {
                name,
                district,
                address,
                contact,
                type,
            },
        })
        return NextResponse.json(school, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create school' }, { status: 500 })
    }
}
