import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { schoolId, description, items } = body

        // Generate unique random token
        const editToken = crypto.randomBytes(16).toString('hex')

        const result = await prisma.materialRequest.create({
            data: {
                schoolId,
                description,
                editToken,
                items: {
                    create: items.map((item: any) => ({
                        material: item.material,
                        quantity: item.quantity,
                    })),
                },
            },
            include: {
                items: true,
            },
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to create material request' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Extract filters
    const schoolName = searchParams.get('school')
    const district = searchParams.get('district')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}

    if (status) {
        where.status = status
    }

    if (schoolName || district) {
        where.school = {}
        if (schoolName) {
            where.school.name = {
                contains: schoolName,
                mode: 'insensitive',
            }
        }
        if (district) {
            where.school.district = district
        }
    }

    try {
        const [requests, total] = await Promise.all([
            prisma.materialRequest.findMany({
                skip,
                take: limit,
                where,
                include: {
                    school: {
                        select: {
                            id: true,
                            name: true,
                            district: true,
                        },
                    },
                    items: true,
                },
                orderBy: [
                    { status: 'desc' }, // PENDING > FULFILLED > ASSIGNED (alphabetical desc: P, F, A)
                    { createdAt: 'asc' }, // Oldest first
                ],
            }),
            prisma.materialRequest.count({ where }),
        ])

        const response = NextResponse.json({
            data: requests,
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
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }
}
