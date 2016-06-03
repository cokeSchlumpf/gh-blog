## gh-blog — Publishing made simple

> An instance of gh-blog is running on IBM Bluemix. Visit [reTHINKit](http://gh-blog.mybluemix.net/blogs/cokeSchlumpf/rethink-it) for a living example.

**gh-blog** is a lightweight Node.js based web application to publish your public GitHub repository as a blog utilizing GitHub's markdown rendering. It's *clean and simple* and offers *absolutely **no** cool features* like a WYSIWYG editor, multi-author or draft- and archive management for your posts. All this can be achieved with your usual tools like [Atom](https://atom.io/) and [GitHub](http://www.github.com).

### Getting started

Simply set up a GitHub repository with the following structure or fork [cokeSchlumpf/rethink-it](https://github.com/cokeSchlumpf/rethink-it/).

```
/
  ├ template
  │ ├ index.jade
  │ ├ post.jade
  │ ├ posts.jade
  │ └ styles.css
  ├ .blog
  └ my-first-post.md
```

gh-blog will recognize the `.blog` file to identify the repository as a valid blog repository. The file should contain a few options:

```json
{
  "title": "reTHINKit",
  "twitter": "cokeSchlumpf"
}
```

The Jade files in the `template` directory will be used to render your blog. See [How to create templates](./how-to/create-templates.md) for details.

All markdown files within your repository (with extension `.md`), except for `README.md`, will be considered as blog posts. Each blog post should follow a simple structure to be parsed correctly:

```markdown
# The first line should contain the title of your post

Then you can just write whatever you want with every markdown feature available on GitHub.

You can mark the split between the preview and the rest of the post with ...

---

... a horizontal line. On the single view of your post, the preview as well as the rest of the article will be displayed.
```

Make sure to use absolute URLs with [https://raw.githubusercontent.com](https://raw.githubusercontent.com) to link images or attachments.

**Finally** visit `http://gh-blog.mybluemix.net/blogs/:gitUser/:gitRepo`, e.g. [http://gh-blog.mybluemix.net/blogs/cokeSchlumpf/rethink-it](http://gh-blog.mybluemix.net/blogs/cokeSchlumpf/rethink-it), to view your Blog.

### How to create templates

Three [Jade](http://www.jade-lang.com) templates are used to render your blog:

```
/
  └ template
    ├ index.jade
    ├ post.jade
    ├ posts.jade
    └ styles.css

```

gh-blog will also inject all files with `*.css` file-extension into the webpage.

- **posts.jade** is used to render the blog's landing page (`/:gitUser/:gitRepo`).
- **post.jade** is used to render the view of an article (`/:gitUser/:gitRepo/posts/:markdownFilePath`).
- **index.jade** is always rendered, the rendered `posts.jade` or `post.jade` are injected.

The following data structures will be available while rendering:

```
{
  blog {
    title,            // Title of the blog defined in /.blog
    url,              // URL of the blog
    baseUrl,          // BaseUrl of the blog, e.g. http://:host
    user,             // GitHub username
    repo,             // GitHub repository
    owner {           
      name,           // Name of the repository owner
      url,            // Website URL from owner's GitHub profile
      company,        // Company from owner's GitHub profile
      location,       // Location from owner's GitHub profile
      avatar,         // Owner's GitHub avatar URL
      twitter,        // The twitter name from /.blog-file
      github          // GitHub user profile URL
    }
  },
  posts [             // Only in posts.jade, ordered by publishedDate desc
    title,            // The title of the post
    link,             // URI of the post without host, e.g /:user/:repo/posts/:file
    author,           // Name of the author who committed the file initially
    publishedDate,    // Date of the first commit of the post
    contentSnippet    // Preview content of the post
  ],
  post {              // Only in post.jade
    title,            // The title of the post
    link,             // URI of the post without host, e.g /:user/:repo/posts/:file
    author,           // Name of the author who committed the file initially
    publishedDate,    // Date of the first commit of the post
    lastModifiedDate, // Date of the latest commit modified the post
    contentSnippet,   // Preview content of the post
    content           // Remaining content of the post
  },
  content             // Only in index.jade; Rendered content of posts.jade or post.jade
}
```

**Note:** The content of the posts is rendered by GitHub's markdown engine, thus the markup will also contain all CSS style names from GitHub. gh-blog always includes a CSS file including all necessary styles to display syntax-highlighting, cite-boxes, etc..

### Feedback and support is welcome!

The work on gh-blog is continued. Upcoming features are listed [here](https://github.com/cokeSchlumpf/gh-blog/issues). The application is based on [kriasoft/react-starter-kit](https://github.com/kriasoft/react-starter-kit).

I really appreciate feedback and demands for new features as well as pull requests.
