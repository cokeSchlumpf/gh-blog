import _ from 'lodash';
import GitHubApi from 'github';
import NodeCache from 'node-cache';
import Promise from 'bluebird';

import fetch from './fetch';
import { application as config } from '../config';

const cache = new NodeCache({
  stdTTL: 600
});

const github = () => {
  const github = new GitHubApi({
    version: '3.0.0',
    debug: false,
    protocol: "https",
    host: "api.github.com",
    timeout: 5000,
    headers: {
      "user-agent": config.github.user
    }
  });

  github.authenticate({
    type: "oauth",
    key: config.github.client_id,
    secret: config.github.client_secret
  })

  return github;
}

export const getBlob = (owner, repo, sha) => {
  const key = `${owner}/${repo}/blobs/${sha}`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().gitdata.getBlob({
          user: owner,
          repo: repo,
          sha: sha
        }, handler(res, rej, {
          key: key,
          ttl: 600
        }));
      } else {
        res(value);
      }
    });
  });
}

export const getCommit = (owner, repo, sha) => {
  const key = `${owner}/${repo}/commits/${sha}`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().repos.getCommit({
          user: owner,
          repo: repo,
          sha: sha
        }, handler(res, rej, {
          key: key,
          ttl: 1200
        }))
      } else {
        res(value);
      }
    });
  });
}

export const getCommits = (owner, repo, path) => {
  const key = `${owner}/${repo}/commits/${path}`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().repos.getCommits({
          user: owner,
          repo: repo,
          path: path
        }, handler(res, rej, {
          key: key,
          ttl: 60
        }));
      } else {
        res(value);
      }
    })
  });
}

export const getFile = (owner, repo, path) => {
  return getRepoTree(owner, repo).then(({tree}) => {
    return _.find(tree, {
      path: path
    });
  });
}

export const getText = (owner, repo, sha) => {
  return getBlob(owner, repo, sha).then(response => {
    return Buffer.from(response.content, 'base64').toString('utf8');
  });
}

export const getTextFile = (owner, repo, path, defaultContent) => {
  return getFile(owner, repo, path).then(blob => {
    if (!blob && defaultContent) {
      return defaultContent;
    } else if (!blob) {
      throw new Error(`${path} does not exist in ${owner}/${repo}.`);
    }

    return getText(owner, repo, blob.sha);
  });
}

export const getRepoTree = (owner, repo) => {
  const key = `${owner}/${repo}/tree`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().gitdata.getTree({
          user: owner,
          repo: repo,
          sha: 'master',
          recursive: true
        }, handler(res, rej, {
          key: key,
          ttl: 60
        }));
      } else {
        res(value);
      }
    });
  });
}

export const getUserData = (owner) => {
  const key = `${owner}/userdata`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().user.getFrom({
          user: owner
        }, handler(res, rej, {
          key: key,
          ttl: 600
        }));
      } else {
        res(value);
      }
    });
  });
}

export const handler = (resolve, reject, {key, ttl}) => {
  return (err, res) => {
    if (err != null) {
      console.error(err);
      console.error(err.stack);
      reject(err);
    } else {
      if (key) cache.set(key, res, ttl);
      resolve(res);
    }
  }
}

export const renderMarkdown = (owner, repo, id, text, mode) => {
  const key = `${owner}/${repo}/${id}`;

  return new Promise((res, rej) => {
    cache.get(key, (err, value) => {
      if (!value) {
        github().markdown.render({
          text: text,
          mode: mode || 'markdown',
          context: `${owner}/${repo}`
        }, handler(res, rej, {
          key: key,
          ttl: 600
        }));
      } else {
        res(value);
      }
    });
  });
}

export default github;
