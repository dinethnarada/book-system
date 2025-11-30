import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, nic, contact, schoolId, subjects } = body

        // Create User and Teacher profile in a transaction
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: 'TEACHER',
                },
            })

            const teacher = await prisma.teacher.create({
                data: {
                    userId: user.id,
                    schoolId,
                    nic,
                    contact,
                    subjects,
                },
            })

            return teacher
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Failed to register teacher' }, { status: 500 })
    }
}
