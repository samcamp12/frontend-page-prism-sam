import { fireEvent, render, screen } from '@testing-library/react'
import InspirationCard from './InspirationCard'

const baseInspiration = {
  id: 'insp-1',
  projectId: 'proj-1',
  notes: 'Keep the hero section light and breathable.',
  screenshot_uri: 'https://example.com/screenshot.png',
  createdAt: '2024-10-01T10:10:00.000Z',
  updatedAt: '2024-10-02T11:15:00.000Z',
  websiteMetadata: {
    url: 'https://example.com',
    title: 'Example Inspiration',
    description: 'A clean landing page layout with bold typography.',
    favicon: null,
    author: null,
    date: null,
    image: null,
    logo: null,
    publisher: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: [],
    ogLocale: null,
    ogUrl: null,
    charset: null,
    urlRequested: 'https://example.com',
    urlResolved: 'https://example.com',
  },
}

describe('InspirationCard', () => {
  it('renders inspiration details', () => {
    render(<InspirationCard inspiration={baseInspiration} />)

    expect(screen.getByRole('heading', { name: /example inspiration/i })).toBeInTheDocument()
    expect(screen.getByText(/example\.com/i)).toBeInTheDocument()
    expect(
      screen.getByText(/A clean landing page layout with bold typography./i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Keep the hero section light and breathable./i)
    ).toBeInTheDocument()
  })

  it('invokes edit and delete callbacks', () => {
    const handleEdit = jest.fn()
    const handleDelete = jest.fn()

    render(
      <InspirationCard
        inspiration={baseInspiration}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /edit/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete/i }))

    expect(handleEdit).toHaveBeenCalledWith(baseInspiration)
    expect(handleDelete).toHaveBeenCalledWith(baseInspiration)
  })
})

