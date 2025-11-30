import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Dashboard from '@/app/dashboard/page'

describe('Dashboard Page', () => {
    it('renders the dashboard header', () => {
        render(<Dashboard />)
        expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })

    it('renders navigation cards', () => {
        render(<Dashboard />)
        expect(screen.getByText('School Management')).toBeInTheDocument()
        expect(screen.getByText('Material Requests')).toBeInTheDocument()
        expect(screen.getByText('Contributors')).toBeInTheDocument()
    })

    it('contains correct links', () => {
        render(<Dashboard />)
        expect(screen.getByRole('link', { name: /Add New School/i })).toHaveAttribute('href', '/schools/add')
        expect(screen.getByRole('link', { name: /Create Request/i })).toHaveAttribute('href', '/requests/create')
        expect(screen.getByRole('link', { name: /Register Contributor/i })).toHaveAttribute('href', '/contributors/register')
    })
})
