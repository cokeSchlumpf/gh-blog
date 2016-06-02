'use strict';
import _ from 'lodash';
import Moment from 'moment';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLNonNull as NonNull, GraphQLString as StringType } from 'graphql';

import { getBlob, getCommit, getCommits, getRepoTree, getText, getUserData, handler, renderMarkdown } from '../../core/github';
import { renderPost } from '../../core/posts';
import PostItemType from '../types/PostType';
import Posts from '../models/posts';

const events = {
  type: new List(PostItemType),

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    }
  },

  resolve(request, {owner, repo}) {
    return getRepoTree(owner, repo).then(({tree}) => {
      const result = _(tree)
        .filter(item => _.endsWith(item.path, '.md') && item.type === 'blob' && !_.endsWith(item.path, 'README.md'))
        .map(item => {
          return getText(owner, repo, item.sha).then(content => {
            return _.assign({}, item, {
              content: content
            });
          });
        })
        .value();
      return result;
    }).all().then(posts => {
      return _.map(posts, post => {
        return renderPost(owner, repo, post);
      });
    }).all().then(posts => {
      return _.orderBy(posts, ['publishedDate'], ['desc']);
    });
  }
};

export default events;
