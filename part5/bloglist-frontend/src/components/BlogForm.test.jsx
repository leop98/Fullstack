import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

function TestWrapper({ createBlogMock }) {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    createBlogMock({ 
      title: newTitle, 
      author: newAuthor, 
      url: newUrl 
    })
  }

  return (
    <BlogForm
      newTitle={newTitle}
      newAuthor={newAuthor}
      newUrl={newUrl}
      handleTitleChange={(e) => setNewTitle(e.target.value)}
      handleAuthorChange={(e) => setNewAuthor(e.target.value)}
      handleUrlChange={(e) => setNewUrl(e.target.value)}
      handleSubmit={handleSubmit}
    />
  )
}

test('<BlogForm /> updates parent state and calls onSubmit with correct data', async () => {
  const user = userEvent.setup()
  const createBlogMock = vi.fn()

  render(<TestWrapper createBlogMock={createBlogMock} />)

  await user.type(screen.getByPlaceholderText('write title here'), 'test title')
  await user.type(screen.getByPlaceholderText('write author here'), 'test author')
  await user.type(screen.getByPlaceholderText('write url here'), 'test.com')
  await user.click(screen.getByText('create'))

  expect(createBlogMock).toHaveBeenCalledTimes(1)
  expect(createBlogMock.mock.calls[0][0].title).toBe('test title')
  expect(createBlogMock.mock.calls[0][0].author).toBe('test author')
  expect(createBlogMock.mock.calls[0][0].url).toBe('test.com')
})
