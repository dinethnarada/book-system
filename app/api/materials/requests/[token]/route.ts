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
        const validStatuses = ['PENDING', 'ASSIGNED', 'FULFILLED']
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be one of: PENDING, ASSIGNED, FULFILLED' },
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

        // Status transition validation
        const currentStatus = existingRequest.status

        // Define allowed transitions: current status -> allowed next statuses
        const allowedTransitions: Record<string, string[]> = {
            'PENDING': ['ASSIGNED'],
            'ASSIGNED': ['FULFILLED'],
            'FULFILLED': [] // Final state - no transitions allowed
        }

        // Check if the new status is the same as current (no change needed)
        if (currentStatus === status) {
            return NextResponse.json(
                { error: `Request is already in ${status} status` },
                { status: 400 }
            )
        }

        // Check if transition is allowed
        const allowedNextStatuses = allowedTransitions[currentStatus] || []
        if (!allowedNextStatuses.includes(status)) {
            // Provide specific error messages for common invalid transitions
            let errorMessage = ''

            if (currentStatus === 'FULFILLED') {
                errorMessage = 'Cannot change status of a FULFILLED request. This is a final state.'
            } else if (status === 'PENDING') {
                errorMessage = 'Cannot move back to PENDING status. Status transitions are one-way.'
            } else if (currentStatus === 'PENDING' && status === 'FULFILLED') {
                errorMessage = 'Cannot move directly from PENDING to FULFILLED. Must go through ASSIGNED first.'
            } else {
                errorMessage = `Invalid status transition from ${currentStatus} to ${status}. Allowed transitions: ${allowedNextStatuses.join(', ') || 'none'}`
            }

            return NextResponse.json(
                { error: errorMessage },
                { status: 400 }
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
