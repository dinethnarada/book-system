import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { teacherId, description, urgency, items } = body

        const result = await prisma.materialRequest.create({
            data: {
                teacherId,
                description,
                urgency,
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
    try {
        const requests = await prisma.materialRequest.findMany({
            include: {
                teacher: {
                    include: {
                        school: true,
                    },
                },
                items: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        })
        return NextResponse.json(requests)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
    }
}
