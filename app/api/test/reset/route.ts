import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(request: Request) {
    try {
        // Use transaction to ensure all deletions succeed or fail together
        // Order matters due to foreign key constraints
        await prisma.$transaction([
            prisma.requestItem.deleteMany(),
            prisma.materialRequest.deleteMany(),
            prisma.school.deleteMany(),
        ])

        return NextResponse.json({ message: 'Database reset successfully' })
    } catch (error) {
        console.error('Error resetting database:', error)
        return NextResponse.json(
            { error: 'Failed to reset database', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        )
    }
}
