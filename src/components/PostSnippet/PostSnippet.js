import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostSnippet.scss';

function PostSnippet({title, link, author, publishedDate, contentSnippet} , context) {
  return (
    <article className={s.post}>
      <h2><a href={link} title={title}>{title}</a></h2>
      <footer className={s["post-info"]}>
        Posted on <span className={s["post-meta"]}>{publishedDate}</span>
      </footer>
      <div className="markdown-body" dangerouslySetInnerHTML={ {
      __html: contentSnippet
    }} />
      <a href={link} title={title}>Read more »</a>
    </article>);
}

PostSnippet.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  publishedDate: PropTypes.string.isRequired,
  contentSnippet: PropTypes.string.isRequired
};

export default withStyles(s)(PostSnippet);
