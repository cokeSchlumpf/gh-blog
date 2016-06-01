'use strict';

import { GraphQLList as List } from 'graphql';

import PostItemType from '../types/PostType';
import Posts from '../models/posts';

const events = {
  type: new List(PostItemType),
  resolve() {
    return Posts.getAll();
  }
};

export default events;
