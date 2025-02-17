const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = []

test('dummy returns one', () => {

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]
const listWithManyBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  }
  ]

describe('total likes', () => {
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })
    
    test('of a bigger list is calculated right', () => {
      const result = listHelper.totalLikes(listWithManyBlogs)
      assert.strictEqual(result, 24)
    })
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes(blogs)
      assert.strictEqual(result, 0)
    })
    test('of empty list is null', () => {
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result, null)
    })
    
  })
describe('favorite blog', () => {
    test('list with only one blog equals that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result,  {
          title: 'Go To Statement Considered Harmful',
          author: 'Edsger W. Dijkstra',
          likes: 5,
        })
      })
    
    test('of a bigger list is correct', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        assert.deepStrictEqual(result,{
          title: 'Canonical string reduction',
          author: 'Edsger W. Dijkstra',
          likes: 12
        })
      })
    test('of empty list is null', () => {
      const result = listHelper.favoriteBlog(blogs)
      assert.strictEqual(result, null)
    })
  })

describe('most blogs', () => {
  test('of empty list is null', () => {
      const result = listHelper.mostBlogs(blogs)
      assert.strictEqual(result, null)
    })
  
  test('of a list with only one blog equals author of that blog', () => {
      const result = listHelper.mostBlogs(listWithOneBlog)
      assert.deepStrictEqual(result,  {
        author: 'Edsger W. Dijkstra',
        blogs: 1,
      })
    })
  
  test('of a bigger list is correct', () => {
      const result = listHelper.mostBlogs(listWithManyBlogs)
      assert.deepStrictEqual(result,{
        author: 'Edsger W. Dijkstra',
        blogs: 2,
      })
    })
  })

describe('most likes', () => {
    test('of empty list is null', () => {
      const result = listHelper.mostLikes(blogs)
      assert.strictEqual(result, null)
    })
  
    test('of a list with only one blog equals author of that blog', () => {
      const result = listHelper.mostLikes(listWithOneBlog)
      assert.deepStrictEqual(result,{
        author: 'Edsger W. Dijkstra',
        likes: 5,
      })
    })
  
    test('of a bigger list is correct', () => {
      const result = listHelper.mostLikes(listWithManyBlogs)
      assert.deepStrictEqual(result,{
        author: 'Edsger W. Dijkstra',
        likes: 17
      })
    })
  })