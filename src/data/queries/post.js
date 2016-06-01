'use strict';

import _ from 'lodash';
import { GraphQLList as List, GraphQLString as StringType, GraphQLNonNull as NonNull } from 'graphql';
import PostItemType from '../types/PostType';
import Posts from '../models/posts';

const post = {
  type: new List(PostItemType),
  args: {
    key: {
      type: new NonNull(StringType)
    },
  },
  resolve(request, {key}) {
    return Posts.getAll().then(posts => {
      return [_.find(posts, {
        key: key
      })];
    });
  }
};

export default post;
