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

    // Build base where clause (School & District only) for stats
    const baseWhere: any = {}
    if (schoolName || district) {
        baseWhere.school = {}
        if (schoolName) {
            baseWhere.school.name = {
                contains: schoolName,
                mode: 'insensitive',
            }
        }
        if (district) {
            baseWhere.school.district = district
        }
    }

    // Build final where clause (Base + Status) for fetching data
    const finalWhere = { ...baseWhere }
    if (status) {
        finalWhere.status = status
    }

    try {
        const [requests, total, statsGrouped] = await Promise.all([
            prisma.materialRequest.findMany({
                skip,
                take: limit,
                where: finalWhere,
                include: {
                    school: {
                        select: {
                            id: true,
                            name: true,
                            district: true,
                            contactNumber: true,
                            contactName: true
                        },
                    },
                    items: true,
                },
                orderBy: [
                    { status: 'desc' }, // PENDING > FULFILLED > ASSIGNED
                    { createdAt: 'asc' }, // Oldest first
                ],
            }),
            prisma.materialRequest.count({ where: finalWhere }),
            prisma.materialRequest.groupBy({
                by: ['status'],
                where: baseWhere,
                _count: {
                    status: true,
                },
            }),
        ])

        // Format stats
        const stats = {
            pending: 0,
            assigned: 0,
            fulfilled: 0,
        }

        statsGrouped.forEach((group) => {
            const s = group.status.toLowerCase() as keyof typeof stats
            if (stats.hasOwnProperty(s)) {
                stats[s] = group._count.status
            }
        })

        // Remove editToken from requests for security
        const sanitizedRequests = requests.map(({ editToken, ...request }) => request)

        const response = NextResponse.json({
            data: sanitizedRequests,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats,
        })

        // Add Cache-Control header
        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

        return response
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }
}
