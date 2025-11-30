import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddSchool from '@/app/schools/add/page'

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

describe('Add School Page', () => {
    it('renders the form', () => {
        render(<AddSchool />)
        expect(screen.getByText('Add New School')).toBeInTheDocument()
        expect(screen.getByLabelText('School Name')).toBeInTheDocument()
        expect(screen.getByLabelText('District')).toBeInTheDocument()
    })

    it('submits the form with correct data', async () => {
        render(<AddSchool />)

        fireEvent.change(screen.getByLabelText('School Name'), { target: { value: 'Test School' } })
        fireEvent.change(screen.getByLabelText('District'), { target: { value: 'Colombo' } })
        fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Street' } })

        fireEvent.click(screen.getByRole('button', { name: /Add School/i }))

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/schools', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('Test School'),
            }))
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })
})
