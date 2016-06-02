import _ from 'lodash';
import Moment from 'moment';
import Promise from 'bluebird';
import { getCommits, renderMarkdown } from './github';

export const renderPost = (owner, repo, post) => {
  return getCommits(owner, repo, post.path).then(commits => {
    const commit = _.last(commits);

    let content = _.trim(post.content.substr(post.content.indexOf('\n') + 1), '\n');
    let contentSnippet = content;
    let split = content.indexOf('---');

    if (split > -1) {
      contentSnippet = _.trim(content.substr(0, split), '\n');
      content = _.trim(content.substr(split), '\n');
    }

    return {
      key: post.path,
      title: _.trim(_.trimStart(_.head(_.split(post.content, '\n')), '#')),
      link: `/blog/${owner}/${repo}/post/${post.path}`,
      author: commit.commit.author.name,
      publishedDate: Moment(new Date(commit.commit.author.date)).format('MMMM DD, YYYY'),
      contentSnippet: contentSnippet,
      content: content
    }
  }).then((post) => {
    return Promise.join(
      renderMarkdown(owner, repo, post.key, post.contentSnippet),
      renderMarkdown(owner, repo, post.key, post.content),
      function(contentSnippet, content) {
        return _.assign({}, post, {
          content: content,
          contentSnippet: contentSnippet
        });
      });
  });
}
