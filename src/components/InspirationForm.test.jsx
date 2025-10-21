import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import InspirationForm from './InspirationForm'

describe('InspirationForm', () => {
  it('submits trimmed values', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined)

    render(
      <InspirationForm
        initialValues={{ url: ' https://example.com ', notes: '  Add hero note ' }}
        onSubmit={handleSubmit}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /save inspiration/i }))

    await waitFor(() =>
      expect(handleSubmit).toHaveBeenCalledWith({
        url: 'https://example.com',
        notes: 'Add hero note',
      })
    )
  })

  it('disables preview button when url input is empty', () => {
    const fetchMetadata = jest.fn()
    render(<InspirationForm onFetchMetadata={fetchMetadata} />)

    const previewButton = screen.getByRole('button', { name: /fetch preview/i })
    expect(previewButton).toBeDisabled()
  })
})

