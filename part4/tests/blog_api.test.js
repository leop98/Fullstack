const { test, after, beforeEach, describe } = require('node:test')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('blog tests', () => {
  
    let token = null

    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})

        const newUser = {
        username: 'testuser',
        password: 'testpass'
        }
        await api.post('/api/users').send(newUser)

        const loginResponse = await api
        .post('/api/login')
        .send({ username: 'testuser', password: 'testpass' })
        token = loginResponse.body.token

        let blogObject = new Blog(helper.initialBlogs[0])
        await blogObject.save()
        blogObject = new Blog(helper.initialBlogs[1])
        await blogObject.save()
    })

    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('should return correct amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('should return blogs with right id property', async () => {
        const response = await api.get('/api/blogs');

        response.body.forEach((blog) => {
            assert.ok(blog.id, 'Expected `id` to be defined');
            assert.strictEqual(blog._id, undefined, 'Expected `_id` to be undefined');
        });
    });

    test('a valid blog can be added', async () => {
        const newBlog = {
          title: 'test post blog',
          author: 'tester3',
          url: 'test3.com',
          likes: 3,
        }
      
        await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        assert(contents.includes('test post blog'))
      })

    test('a valid blog cannot be added without token', async () => {
        const newBlog = {
          title: 'test post blog w/o token',
          author: 'tester99',
          url: 'test99.com',
          likes: 99,
        }
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
      
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
        assert(!contents.includes('test post blog w/o token'))
      })

    test('a blog post without like value gets like value 0 ', async () => {
        const newBlog = {
            title: 'no like value',
            author: 'tester3',
            url: 'test3.com',
        }
    
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
    
        const contents = response.body.map(r => r.likes)
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    
        assert.strictEqual(contents[helper.initialBlogs.length], 0)
    })

    test('Blog without url is not added', async () => {
        const newBlog = {
            title: 'test post blog w/o url',
            author: 'tester4',
            likes: 3,
        }
    
        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
    
        const response = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
        assert(!contents.includes('test post blog w/o url'))
    })

    test('blog post can be updated', async () => {
        const blogsAtStart = await api.get('/api/blogs')

        const newBlog = {
        title: blogsAtStart.body[0].title,
        author: blogsAtStart.body[0].author,
        url: blogsAtStart.body[0].url,
        likes: 99999
        }  

        await api    
        .put(`/api/blogs/${blogsAtStart.body[0].id}`)  
        .send(newBlog)  
        .expect(200)    
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        
        assert.strictEqual(response.body[0].likes, 99999)
    })
})

describe('deleting blogs', () => {
    let token = null
    let blogId = null
  
    beforeEach(async () => {
      await User.deleteMany({})
      await Blog.deleteMany({})
  
      const newUser = { username: 'deleteUser', password: 'deletePass' }
      await api.post('/api/users').send(newUser)
  
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'deleteUser', password: 'deletePass' })
  
      token = loginResponse.body.token
  
      const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'blog to be deleted',
          author: 'dude',
          url: 'example.com',
          likes: 5,
        })
        .expect(201)
  
      blogId = createdBlog.body.id
    })
  
    test('a blog can be deleted by its owner', async () => {
      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
  
      const remainingBlogs = await api.get('/api/blogs')
      assert.strictEqual(remainingBlogs.body.length, 0)
    })
  
    test('delete fails if the blog is owned by another user', async () => {
      const anotherUser = { username: 'other', password: 'otherPass' }
      await api.post('/api/users').send(anotherUser)
  
      const otherUserLogin = await api
        .post('/api/login')
        .send({ username: 'other', password: 'otherPass' })
      const otherToken = otherUserLogin.body.token
  
      await api
        .delete(`/api/blogs/${blogId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(403)
    })
  })
  
describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with proper statuscode and message if username shorter than 3', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'ro',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username and password must be at least 3 characters long'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })

    test('creation fails with proper statuscode and message if password shorter than 3', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'dude',
          name: 'Superuser',
          password: 'sa',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username and password must be at least 3 characters long'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with proper statuscode and message if username doesnt exist', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          name: 'hyperuser',
          password: 'salis',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username and password must be provided'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
    test('creation fails with proper statuscode and message if password doesnt exist', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'random',
          name: 'hyperuser',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Username and password must be provided'))
    
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
      })
    
  })

after(async () => {
  await mongoose.connection.close()
})