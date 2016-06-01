import _ from 'lodash';
import Promise from 'bluebird';
import GitHubApi from 'github';
import fetch from '../../core/fetch';
import moment from 'moment';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const username = 'cokeSchlumpf';
const repo = 'wellnr-blog';
const auth = 'client_id=d381568f0f063b08ed17&client_secret=364fe0c7c2a9822121c15ff2acd14bc2f0b9d4e4'

function gitAPICall(pUrl, options, pParser) {
  let url = pUrl;

  if (url.indexOf('?') > -1) {
    url = url + `&${auth}`;
  } else {
    url = url + `?${auth}`;
  }

  if (url.indexOf('/') > 0) {
    url = '/' + url;
  }

  url = `https://api.github.com${url}`;

  let parser = pParser ? pParser : response => response.json();

  return fetch(url, options).then(response => {
    return parser(response).then(body => {
      if (response.status !== 200) {
        console.error(`Received status ${response.status} from '${url}.'`);
        console.error(body);
        throw new Error(`Received status ${response.status} from '${url}.'`);
      } else {
        return body;
      }
    });
  });
}

const posts = {
  getAll() {
    if (lastFetchTask) {
      return lastFetchTask;
    }

    return gitAPICall(`/repos/${username}/${repo}/events`)
      .then(events => {
        let lastEvent = new Date(events[0].created_at);
        if (lastFetchTime.getTime() >= lastEvent.getTime() && items.length !== 0) {
          return items;
        } else {
          console.log('Fetching posts from github ...');

          lastFetchTime = lastEvent;
          lastFetchTask = gitAPICall(`/repos/${username}/${repo}/git/trees/master?recursive=1`)
            .then(data => {
              return _(data.tree)
                .chain()
                .filter(item => _.endsWith(item.path, '.md') && item.type === 'blob' && !_.endsWith(item.path, 'README.md'))
                .map(item => {
                  return fetch(`${item.url}?${auth}`)
                    .then(response => response.json())
                    .then(content => _.assign({}, item, {
                      content: Buffer.from(content.content, 'base64').toString('utf8')
                    }));
                })
                .value();
            })
            .all()
            .then(posts => {
              return gitAPICall(`/repos/${username}/${repo}/commits`)
                .then(commits => {
                  return _.map(commits, commit => fetch(`${commit.url}?${auth}`)
                    .then(response => response.json()));
                })
                .all()
                .then(commits => {
                  return _(posts)
                    .map(post => {
                      const commit = _.findLastIndex(commits, commit => _.findIndex(commit.files, {
                          'filename': post.path
                        }) > -1);

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
                        link: `/post/${post.path}`,
                        author: commits[commit].commit.author.name,
                        publishedDate: moment(new Date(commits[commit].commit.author.date)).format('MMMM DD, YYYY'),
                        contentSnippet: contentSnippet,
                        content: content
                      }
                    })
                    .value();
                });
            })
            .then(posts => {
              return _.map(posts, post => {
                return Promise.join(
                  gitAPICall(`/markdown`, {
                    method: 'POST',
                    body: JSON.stringify({
                      'text': post.contentSnippet,
                      'mode': 'markdown',
                      'context': `${username}/${repo}`
                    })
                  }, response => response.text()),
                  gitAPICall(`/markdown`, {
                    method: 'POST',
                    body: JSON.stringify({
                      'text': post.content,
                      'mode': 'markdown',
                      'context': `${username}/${repo}`
                    })
                  }, response => response.text()), function(contentSnippet, content) {
                    return _.assign({}, post, {
                      content: content,
                      contentSnippet: contentSnippet
                    });
                  });
              });
            })
            .all()
            .then(data => {
              items = _.orderBy(data, ['publishedDate'], ['desc']);
              return items;
            })
            .finally(() => {
              lastFetchTask = null;
            });

          if (items.length > 0) {
            return items;
          } else {
            return lastFetchTask
          }
        }
      })
      .all();
  }
};

export default posts;
