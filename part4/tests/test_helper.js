const Blog = require('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
        title: 'test blog',
        author: 'tester1',
        url: 'test.com',
        likes: 1,
    },
    {
        title: 'test blog 2',
        author: 'tester2',
        url: 'test2.com',
        likes: 2,
    },
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }
  
  module.exports = {
    initialBlogs, blogsInDb, usersInDb
  }