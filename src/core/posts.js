import _ from 'lodash';
import Moment from 'moment';
import Promise from 'bluebird';
import { getCommits, getText, renderMarkdown } from './github';

export const renderPost = (owner, repo, post) => {
  return Promise.join(getText(owner, repo, post.sha), getCommits(owner, repo, post.path), (pContent, pCommits) => {
    const commit = _.last(pCommits);

    let content = _.trim(pContent.substr(pContent.indexOf('\n') + 1), '\n');
    let contentSnippet = content;
    let split = content.indexOf('---');

    if (split > -1) {
      contentSnippet = _.trim(content.substr(0, split), '\n');
      content = _.trim(content.substr(split), '\n');
    }

    return {
      key: post.path,
      title: _.trim(_.trimStart(_.head(_.split(pContent, '\n')), '#')),
      link: `/blogs/${owner}/${repo}/posts/${post.path}`,
      author: commit.commit.author.name,
      publishedDate: Moment(new Date(commit.commit.author.date)).format('MMMM DD, YYYY'),
      lastModifiedDate: Moment(new Date(_.first(pCommits).commit.author.date)).format('MMMM DD, YYYY'),
      contentSnippet: contentSnippet,
      content: content
    }
  }).then((post) => {
    return Promise.join(
      renderMarkdown(owner, repo, `${post.key}-snippet`, post.contentSnippet),
      renderMarkdown(owner, repo, `${post.key}-content`, post.content),
      function(contentSnippet, content) {
        return _.assign({}, post, {
          content: content,
          contentSnippet: contentSnippet
        });
      });
  });
}
