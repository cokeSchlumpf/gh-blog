'use strict';

import _ from 'lodash';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';

import BlogType from '../types/BlogType';
import { getRepoTree, getTextFile, getUserData, handler } from '../../core/github';

const blog = {
  type: BlogType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    }
  },

  resolve(request, {owner, repo}) {
    return Promise.join(
      getRepoTree(owner, repo),
      getUserData(owner),
      getTextFile(owner, repo, '.blog'),
      getTextFile(owner, repo, 'template/index.jade', 'index default'),
      getTextFile(owner, repo, 'template/posts.jade', 'posts default'),
      getTextFile(owner, repo, 'template/post.jade', 'index default'),
      ({tree}, user, pConfig, pIndexTemplate, pPostsTemplate, pPostTemplate) => {
        const config = JSON.parse(pConfig);

        return {
          title: config.title,
          url: `/blogs/${owner}/${repo}`,
          user: owner,
          repo: repo,
          owner: {
            name: user.name,
            avatar: user.avatar_url,
            twitter: config.twitter,
            github: user.html_url
          },
          template: {
            styles: _.map(_.filter(tree, file => _.endsWith(file.path, '.css')), file => file.path),
            index: pIndexTemplate,
            posts: pPostsTemplate,
            post: pPostTemplate
          }
        };
      });
  }
};

export default blog;
