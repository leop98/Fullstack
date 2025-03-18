import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [createVisible, setCreateVisible] = useState(false)
  const [refreshBlog, setRefreshBlog] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((x,y) => y.likes - x.likes)
      setBlogs( blogs )
    })

  }, [refreshBlog])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newTitle,
        author: newAuthor,
        url: newUrl
      }
      const returnedBlog = await blogService.create(blogObject)

      returnedBlog.user = {
        username: user.username,
        name: user.name,
        id: user._id
      }

      setBlogs(blogs.concat(returnedBlog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setCreateVisible(false)

      setErrorMessage(`a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setMessageType('success')
      setTimeout(() => setErrorMessage(null), 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setMessageType('error')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const blogForm = () => {
    const hideWhenVisible = { display: createVisible ? 'none' : '' }
    const showWhenVisible = { display: createVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setCreateVisible(true)}>create</button>
        </div>
        <div style={showWhenVisible}>
          <BlogForm
            newTitle={newTitle}
            newAuthor={newAuthor}
            newUrl={newUrl}
            handleTitleChange={({ target }) => setNewTitle(target.value)}
            handleAuthorChange={({ target }) => setNewAuthor(target.value)}
            handleUrlChange={({ target }) => setNewUrl(target.value)}
            handleSubmit={addBlog}
          />
          <button onClick={() => setCreateVisible(false)}>cancel</button>
        </div>
      </div>
    )

  }

  const addLikes = async (id, blogObject) => {
    await blogService.update(id, blogObject)
    setRefreshBlog(!refreshBlog)
  }

  const deleteBlog = async id => {
    await blogService.remove(id)
    setRefreshBlog(!refreshBlog)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type={messageType} />

        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={messageType} />
      {user && <div>
        <p>{user.name} logged in <button type="submit" onClick={handleLogout}>logout</button></p>
      </div>
      }
      {blogForm()}

      {blogs.map(blog => (
        <Blog key={blog.id} blog={blog} user={user} addLikes={addLikes} deleteBlog={deleteBlog} />
      ))}
    </div>
  )

}

export default App