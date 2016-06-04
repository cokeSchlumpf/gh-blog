'use strict';
import _ from 'lodash';
import Moment from 'moment';
import Promise from 'bluebird';
import { GraphQLList as List, GraphQLNonNull as NonNull, GraphQLString as StringType, GraphQLInt as IntType } from 'graphql';

import { getRepoTree, getTextFile } from '../../core/github';
import { renderPost } from '../../core/posts';
import { PostItemsType } from '../types/PostType';

const events = {
  type: PostItemsType,

  args: {
    owner: {
      type: new NonNull(StringType)
    },
    repo: {
      type: new NonNull(StringType)
    },
    page: {
      type: IntType
    }
  },

  resolve(request, {owner, repo, page}) {
    if (!page)
      page = 1;

    return getRepoTree(owner, repo).then(({tree}) => {
      const result = _(tree)
        .filter(item => _.endsWith(item.path, '.md') && item.type === 'blob' && !_.endsWith(item.path, 'README.md'))
        .value();
      return result;
    }).all().then(posts => {
      return _.map(posts, post => {
        return renderPost(owner, repo, post);
      });
    }).all().then(posts => {
      return getTextFile(owner, repo, '.blog').then(pConfig => {
        const config = JSON.parse(pConfig);
        const ppp = pConfig.postPerPage || 3;

        console.log(`${page}, ${ppp}, ${posts.length}`);

        return {
          posts: _.slice(_.orderBy(posts, ['publishedTime'], ['desc']), (page - 1) * ppp, page * ppp),
          pages: Math.ceil(posts.length / ppp),
          page: page
        };
      });
    });
  }
};

export default events;
