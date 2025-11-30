import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateRequest from '@/app/requests/create/page'

// Mock useRouter
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}))

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
) as jest.Mock

describe('Create Request Page', () => {
    it('renders the form', () => {
        render(<CreateRequest />)
        expect(screen.getByText('Request Educational Materials')).toBeInTheDocument()
        expect(screen.getByLabelText('Teacher ID')).toBeInTheDocument()
    })

    it('allows adding multiple items', () => {
        render(<CreateRequest />)

        const addButton = screen.getByText('Add Item')
        fireEvent.click(addButton)

        const materialInputs = screen.getAllByPlaceholderText('Material Name (e.g., Textbooks)')
        expect(materialInputs).toHaveLength(2)
    })

    it('submits the form', async () => {
        render(<CreateRequest />)

        fireEvent.change(screen.getByLabelText('Teacher ID'), { target: { value: 'teacher-123' } })
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Need books' } })

        const materialInput = screen.getByPlaceholderText('Material Name (e.g., Textbooks)')
        fireEvent.change(materialInput, { target: { value: 'Math Books' } })

        fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }))

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/materials/requests', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('Math Books'),
            }))
            expect(mockPush).toHaveBeenCalledWith('/dashboard')
        })
    })
})
