import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]),
    })
) as jest.Mock

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn(),
    }),
    usePathname: () => '',
}))

describe('Home Page', () => {
    it('renders the hero section', () => {
        render(<Home />)
        expect(screen.getByText('For Rebuild Education')).toBeInTheDocument()
    })

    it('renders search inputs', () => {
        render(<Home />)
        expect(screen.getByPlaceholderText('Enter school name...')).toBeInTheDocument()
        // District is a select, so checking for the default option text
        expect(screen.getByText('All Districts')).toBeInTheDocument()
    })

    it('calls API when search button is clicked', async () => {
        render(<Home />)
        const searchInput = screen.getByPlaceholderText('Enter school name...')
        const searchButton = screen.getByText('Search')

        fireEvent.change(searchInput, { target: { value: 'Royal' } })
        fireEvent.click(searchButton)

        await waitFor(() => {
            // The search functionality now calls /api/materials/requests with search parameters
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/api/materials/requests?page=1&limit=10&school=Royal')
            )
        })
    })
})
