import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET: Verify token and return request details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params

        const materialRequest = await prisma.materialRequest.findUnique({
            where: { editToken: token },
            include: {
                school: true,
                items: true,
            },
        })

        if (!materialRequest) {
            return NextResponse.json(
                { error: 'Invalid token. Request not found.' },
                { status: 404 }
            )
        }

        return NextResponse.json(materialRequest)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to verify token' },
            { status: 500 }
        )
    }
}

// PATCH: Update request status
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const body = await request.json()
        const { status } = body

        // Validate status
        const validStatuses = ['PENDING', 'ASSIGNED', 'FULFILLED', 'REJECTED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: PENDING, ASSIGNED, FULFILLED, REJECTED' },
                { status: 400 }
            )
        }

        // Find request by token
        const existingRequest = await prisma.materialRequest.findUnique({
            where: { editToken: token },
        })

        if (!existingRequest) {
            return NextResponse.json(
                { error: 'Invalid token. Request not found.' },
                { status: 404 }
            )
        }

        // Update status
        const updatedRequest = await prisma.materialRequest.update({
            where: { editToken: token },
            data: { status },
            include: {
                school: true,
                items: true,
            },
        })

        return NextResponse.json(updatedRequest)
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to update request status' },
            { status: 500 }
        )
    }
}
