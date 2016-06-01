import React, { Component, PropTypes } from 'react';
import ReactDisqusThread from 'react-disqus-thread';
import cx from 'classnames';
import s from '../PostSnippet/PostSnippet.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

class Post extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    publishedDate: PropTypes.string.isRequired,
    contentSnippet: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }

  static contextTypes = {
    insertCss: PropTypes.func.isRequired,
    setTitle: PropTypes.func.isRequired
  }

  componentWillMount() {
    console.log(this.context);
  // const {insertCss} = this.props.context;
  // this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    // this.removeCss();
  }

  openWindow(id, width, height) {
    return (event) => {
      window.open(event.target.href, id, `width=${width},height=${height}`);
      event.preventDefault();
      return false;
    }
  }

  render() {
    let {title, link, author, publishedDate, contentSnippet, content} = this.props;

    return (<div>
      <article className={s.post}>
        <a className={ s.btn } href="/" title="Back to homepage">« Back to home</a>
        <h1><a href={link} title={title}>{title}</a></h1>
        <footer className={s["post-info"]}>
          Posted on <span className={s["post-meta"]}>{publishedDate}</span>
        </footer>
        <div className="markdown-body" dangerouslySetInnerHTML={ {
        __html: contentSnippet
      }} />

        <div className="markdown-body" dangerouslySetInnerHTML={ {
        __html: content
      }} />

        <ul className={s["share-buttons"]}>
            <li>Share this article:</li>
            <li>
              <a className={ cx(s["icon-facebook-squared"], "icon-foo") } href={"https://www.facebook.com/sharer/sharer.php?u=" + link}
      onClick={ this.openWindow('facebook-share', 580, 296) } title="Share on Facebook"></a></li>
            <li><a className={ cx(s["icon-twitter"], "icon-twitter") }  href={"https://twitter.com/share?text=" + encodeURIComponent(title) + "&amp;url=" + link}
      onClick={ this.openWindow('twitter-share', 550, 235) } title="Tweet this page"></a></li>
            <li><a className={ cx(s["icon-linkedin"], "icon-foo") }  href={"https://www.linkedin.com/shareArticle?mini=true&url=" + link + "&title=" + encodeURIComponent(title)} onClick={ this.openWindow('linkedin-share', 600, 494) } title="Share on LinkenIn"></a></li>
        </ul>
      </article>
      <div className={ s.comments }>
        <h3>Comments</h3>
        <ReactDisqusThread shortname="example" identifier="something-unique-12345" title="Example Thread" url="http://www.example.com/example-thread" category_id="123456" />
      </div>
    </div>);
  }
}

export default withStyles(s)(Post);
