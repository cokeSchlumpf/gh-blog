import _ from 'lodash';
import GitHubApi from 'github';
import fetch from './fetch';
import { application as config } from '../config';

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

export const getText = (owner, repo, sha) => {
  return new Promise((res, rej) => github().gitdata.getBlob({
    user: owner,
    repo: repo,
    sha: sha
  }, handler(res, rej))).then(response => {
    return Buffer.from(response.content, 'base64').toString('utf8');
  });
}

export const getTextFile = (owner, repo, path, defaultContent) => {
  return getRepoTree(owner, repo).then(({tree}) => {
    const blob = _.find(tree, {
      path: path
    });

    if (!blob && defaultContent) {
      return defaultContent;
    } else if (!blob) {
      throw new Error(`${path} does not exist in ${owner}/${repo}.`);
    }

    return getText(owner, repo, blob.sha);
  });
}

export const getRepoTree = (owner, repo) => {
  return new Promise((res, rej) => github().gitdata.getTree({
    user: owner,
    repo: repo,
    sha: 'master',
    recursive: true
  }, handler(res, rej)));
}

export const getUserData = (owner) => {
  return new Promise((res, rej) => github().user.getFrom({
    user: owner
  }, handler(res, rej)));
}

export const handler = (resolve, reject) => {
  return (err, res) => {
    if (err != null) {
      reject(err);
    } else {
      resolve(res);
    }
  }
}

export default github;
