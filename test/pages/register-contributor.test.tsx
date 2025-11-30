import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterContributor from '@/app/contributors/register/page'

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

describe('Register Contributor Page', () => {
    it('renders the form', () => {
        render(<RegisterContributor />)
        expect(screen.getByText('Register as Contributor')).toBeInTheDocument()
        expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('toggles organization field based on type', () => {
        render(<RegisterContributor />)

        const typeSelect = screen.getByLabelText('Type')
        fireEvent.change(typeSelect, { target: { value: 'ORGANIZATION' } })

        expect(screen.getByLabelText('Organization Name')).toBeInTheDocument()
    })

    it('submits the form', async () => {
        render(<RegisterContributor />)

        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } })
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } })

        const materialInput = screen.getByPlaceholderText('Material Type')
        fireEvent.change(materialInput, { target: { value: 'Pens' } })

        fireEvent.click(screen.getByRole('button', { name: /Register/i }))

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/contributors', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('john@example.com'),
            }))
            expect(mockPush).toHaveBeenCalledWith('/')
        })
    })
})
