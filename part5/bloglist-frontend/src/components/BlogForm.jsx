const BlogForm = ({
  newTitle,
  newAuthor,
  newUrl,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleSubmit
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
          title:
        <input
          value={newTitle}
          onChange={handleTitleChange}
          placeholder='write title here'
          name="title"
          id='title'
        />
      </div>
      <div>
          author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder='write author here'
          name="author"
          id='author'
        />
      </div>
      <div>
          url:
        <input
          value={newUrl}
          onChange={handleUrlChange}
          placeholder='write url here'
          name="url"
          id='url'
        />
      </div>
      <button type="submit" id='create-button'>create</button>
    </form>
  )
}

export default BlogForm
