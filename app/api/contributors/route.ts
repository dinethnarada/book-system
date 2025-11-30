import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, type, organization, contact, address, materials } = body

        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: 'CONTRIBUTOR',
                },
            })

            const contributor = await prisma.contributor.create({
                data: {
                    userId: user.id,
                    type,
                    organization,
                    contact,
                    address,
                    materials: {
                        create: materials.map((mat: any) => ({
                            materialType: mat.materialType,
                            quantity: mat.quantity,
                            notes: mat.notes,
                        })),
                    },
                },
            })

            return contributor
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to register contributor' }, { status: 500 })
    }
}
