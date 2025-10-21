import { fireEvent, render, screen } from '@testing-library/react'
import { useToast, ToastProvider } from './ToastProvider'

const ToastTrigger = ({ toastProps }) => {
  const toast = useToast()
  return (
    <button type="button" onClick={() => toast.push(toastProps)}>
      Trigger toast
    </button>
  )
}

describe('ToastProvider', () => {
  it('renders a toast when push is called', () => {
    render(
      <ToastProvider>
        <ToastTrigger toastProps={{ title: 'Saved', description: 'Project updated', duration: 0 }} />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText(/trigger toast/i))

    expect(screen.getByText(/saved/i)).toBeInTheDocument()
    expect(screen.getByText(/project updated/i)).toBeInTheDocument()
  })

  it('invokes action callback and dismisses the toast', () => {
    const actionHandler = jest.fn()

    render(
      <ToastProvider>
        <ToastTrigger
          toastProps={{
            title: 'Deleted',
            action: { label: 'Undo', onClick: actionHandler },
            duration: 0,
          }}
        />
      </ToastProvider>
    )

    fireEvent.click(screen.getByText(/trigger toast/i))

    const actionButton = screen.getByRole('button', { name: /undo/i })
    fireEvent.click(actionButton)

    expect(actionHandler).toHaveBeenCalled()
    expect(screen.queryByText(/deleted/i)).not.toBeInTheDocument()
  })
})

