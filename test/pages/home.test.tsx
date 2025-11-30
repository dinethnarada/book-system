import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
) as jest.Mock

describe('Home Page', () => {
    it('renders the hero section', () => {
        render(<Home />)
        expect(screen.getByText('Educational Material Support System')).toBeInTheDocument()
    })

    it('renders search inputs', () => {
        render(<Home />)
        expect(screen.getByPlaceholderText('Search by school name...')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Filter by district...')).toBeInTheDocument()
    })

    it('calls API when search button is clicked', async () => {
        render(<Home />)
        const searchInput = screen.getByPlaceholderText('Search by school name...')
        const searchButton = screen.getByText('Search')

        fireEvent.change(searchInput, { target: { value: 'Royal' } })
        fireEvent.click(searchButton)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/schools?name=Royal'))
        })
    })
})
