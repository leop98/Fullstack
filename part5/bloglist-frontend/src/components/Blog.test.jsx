import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'test blog',
    author: 'tester guy',
    url: 'test.com',
    likes: 10,
    user:{
      id:'asd'
    }
  }

  const user = {
    id: 'asd'
  }

  const { container } = render(<Blog blog={blog} user={user}/>)

  const div = container.querySelector('.whenHidden')

  expect(div).toHaveTextContent(
    'test blog'
  )
})

test('renders blogs when full blog is shown', () => {
    const blog = {
      title: 'test blog',
      author: 'tester guy',
      url: 'test.com',
      likes: 10,
      user:{
        id:'asd',
        name: 'mr. tester'
      }
    }
  
    const user = {
      name: 'mr. tester',
      id: 'asd'
    }
  
    const { container } = render(<Blog blog={blog} user={user}/>)
  
    const div = container.querySelector('.whenShown')
  
    expect(div).toHaveTextContent('test.com')
    expect(div).toHaveTextContent('10')
    expect(div).toHaveTextContent('mr. tester')
  })

test('clicking the like button calls event handler twice', async () => {
    const blog = {
        title: 'test blog',
        author: 'tester guy',
        url: 'test.com',
        likes: 10,
        user:{
          id:'asd',
          name: 'mr. tester'
        }
      }
    
    const user = {
        name: 'mr. tester',
        id: 'asd'
      }
  
    const mockHandler = vi.fn()
  
    render(
      <Blog blog={blog} user={user} addLikes={mockHandler} />
    )
  
    const users = userEvent.setup()
    const button = screen.getByText('like')
    await users.click(button)
    await users.click(button)
  
    expect(mockHandler.mock.calls).toHaveLength(2)
})